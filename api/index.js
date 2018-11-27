import express from 'express'
import multer from 'multer';
import path from 'path';

import {sendVerify, sendRestore} from './mailer'
import {addUser} from "./dbAddUser";
import {isEmailLoginExist} from "./dbIsEmailLoginExist";
import randToken from 'rand-token'
import validateReg from './validation/regValidation'
import {isLogPassValid} from "./dbIsLogPassExist";
import {confirmUser} from "./dbConfrimUser";
import {getProfile} from "./dbGetUserProfile";
import jwt from 'jsonwebtoken'
import {getSearch} from "./search/getSortedByDistance";
import {getTags} from "./search/getTags";
import {getPreSearchUserInfo} from "./search/getPreSerarchUserInfo";
import {isFieldExist} from "./set/isFieldExist";
import {setLogin} from "./set/setLogin";
import {setEmail} from "./set/setEmail";
import {setPassword} from "./set/setPassword";
import {setField} from "./set/setField";
import {checkInBlack} from "./user_actions/checkInBlack";
import {madeVisit} from "./user_actions/userMadeVisit";
import {getAnotherUser} from "./user_actions/getAnotherUser";
import {notify} from "./socket/socketBack"
import {setBool} from "./user_actions/setLike";
import {isConnected} from "./user_actions/is_connected";
import {isExistChat} from "./chat/isExistChat";
import {createChat} from "./chat/createChat";
import {setChatStatus} from "./chat/setChatStatus";
import {blockUser} from "./user_actions/blockProfile";
import {getUnseenMsgCount} from "./user_actions/getUnseenCount";
import {reportUser} from "./user_actions/reportUser";
import {checkPassword} from "./validation/checkCorrectPassword";
import {setRate} from "./set/setRate";
import {selectNotifications} from "./set/selectNotifications";
import {insertNotification} from "./set/insertNotification";
import {updateSeenNotifications} from "./set/updateSeenNotifications";
import {updateCoords} from "./editProfile/updateCoords";
import {checkAccess} from "./dbCheckAccess";
import {hasToAccess} from "./dbHasAccess";
import {updateAccess} from "./dbUpdateAccess";
import {updateProfile} from "./editProfile/dbUpdateProfile";
import {removeProfileTags} from "./editProfile/dbRemoveTags";
import {updateProfileTags} from "./editProfile/dbUpdateProfileTags";
import {updateProfilePhotos} from "./editProfile/dbUpdateProfilePhotos";
import {removePhoto} from './editProfile/dbRemovePhoto';
import {setNewAvatar} from './editProfile/dbSetNewAvatar';
import {unsetAvatar} from './editProfile/dbUnsetAvatar';
import {isLoginExist} from './isLoginExist';


const router = express.Router();

const storage = multer.diskStorage({
   destination: './public/userInfo/photos',
   filename: function (req, file, callback) {
     callback(null, file.fieldname + '-' + Date.now() + (path.extname(file.originalname).length === 0 ? ".png" : path.extname(file.originalname)));
   }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000}
}).any();


router.post('/register', (req, res) =>{

    const data  = req.body;

    let result = validateReg.validateReg(data);
    isEmailLoginExist(data.email, data.login).then((errors) => {

        if (result.length !== 0 || errors.length !== 0)
        {
            result = result.concat(errors);
            res.send(result);
        }
        else {
            const token = randToken.generate(18);
            if (addUser(data, token))
            {
                sendVerify(data.email, data.login, token);
                res.send(true);
            }
        }

    }).catch(reason => res.send(reason));

});

router.post('/signin', (req, res) => {

   const data = req.body;

    isLogPassValid(data.password, data.login).then((result) => {

        let id, errors = null;

        if (!Array.isArray(result)) {

            id = result;

            jwt.sign({id}, 'abandon_all_hope_549510o', {expiresIn: '3h'}, (err, token) => {
                res.send({token, login: data.login});
            });
        }
        else {
            errors = result;
            res.send(errors);
        }
    }).catch((error) => {
        res.sendStatus(500);
    });

});

router.post('/confirm', (req, res) => {

    confirmUser(req.body.login, req.body.token).then((result) => {
       res.sendStatus(200);
    }).catch((error) => {
        res.sendStatus(500);
    });
 });

router.post('/restore', (req, res) => {

    const data = req.body;
    const valid = validateReg.validateEmail(data.email);

    if (valid === true) {

        isFieldExist('email', data.email).then((obj) => {
            if (obj.bool === true) {
                const token = randToken.generate(25);
                if (sendRestore(data.email, token)) {
                    setField('email', data.email, 'restore_token', token).then((result) => {
                        res.status(200).send(true);
                    }).catch((error) => {
                        res.status(500).send(false);
                    });
                }
            }
        }).catch((error) => {
            res.send("No such email");
        });
    } else {
        res.send(valid);
    }
});

router.post('/restoreData', (req, res) => {

   const {pass, repass} = req.body;
   const {email, token} = req.body.params;
   const valid = validateReg.validateSetPassword(pass, repass);

   if (valid === true) {

       isFieldExist('restore_token', token).then((obj) => {

           if (obj.result.length === 1)
           {
               if (obj.result[0].email.localeCompare(email) === 0) {

                   setPassword(obj.result[0].id, pass, 1).then(() => {
                       res.send(null);
                   }).catch((error) => {
                       res.send(error);
                   });
               }
           } else {
               res.send("Invalid restore link");
           }
       });
   }
   else {
       res.send(valid);
   }
});

router.post('/cabinet', verifyToken, (req, res) => {

    if (req.authData !== undefined && req.authData)
    {
        getUnseenMsgCount(req.authData.id).then((data) => {
            selectNotifications(req.authData.id).then(result => {
                res.send({authData: req.authData, unseenMsg:data, notifications: result});
            }).catch(reason => console.error(reason));

        }).catch(reason => console.error(reason));
    }

});

router.post('/update-profile', verifyToken, (req, res) => {

    const myId = req.authData.id;
    const data = req.body;

    updateProfile(myId, data).then((data) => {
        res.sendStatus(200);
    }).catch((error => {
    }));
});

router.get('/remove-tags', verifyToken, (req, res) => {
    const myId = req.authData.id;

    removeProfileTags(myId).then(() => {
        res.sendStatus(200);
    }).catch((error => {
        res.status(500).send(false);
    }));
});

router.post('/update-tags', verifyToken, (req, res) => {

    const myId = req.authData.id;
    const tags = req.body;

    updateProfileTags(myId, tags).then((tags) => {
        res.sendStatus(200);
    }).catch((error => {
        res.status(500).send(false);
    }));
});

router.post("/update-photos", verifyToken, (req, res) => {

    upload(req, res, (err) => {

        if (!err) {

            const myId = req.authData.id;
            const photos = req.files;

            updateProfilePhotos(myId, photos).then((result) => {
                res.send(result);

            }).catch((error => {
                res.status(500).send(false);
            }));
        }
    });

});

router.post("/remove-photo", verifyToken, (req, res) => {

    const myId = req.authData.id;
    const source = req.body;

    removePhoto(myId, source).then((source) => {
        res.sendStatus(200);
    }).catch((error) => {
        res.status(500).send(false);
    });

});


router.post("/set-new-avatar", verifyToken, (req, res) => {

    const myId = req.authData.id;
    const source = req.body;

    setNewAvatar(myId, source).then((source) => {
        res.sendStatus(200);
    }).catch((error) => {
        res.status(500).send(false);
    });

});

router.get("/unset-avatar", verifyToken, (req, res) => {

    const myId = req.authData.id;

    unsetAvatar(myId).then(() => {
        res.sendStatus(200);
    }).catch((error) => {
        res.status(500).send(false);
    });

});

router.get('/profile', verifyToken, (req, res) => {

    getProfile(req.authData.id).then((result) => {
        res.status(200).send(result);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

router.get('/check-access', verifyToken, (req, res) => {
    checkAccess(req.authData.id).then((result) => {
        res.status(200).send(result);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

router.get('/has-to-access', verifyToken, (req, res) => {
    hasToAccess(req.authData.id).then( result => {
        res.send(result);
    }).catch( reason => {
        res.send(reason);
    });

});

router.get('/update-access', verifyToken, (req, res) => {
    updateAccess(req.authData.id).then((result) => {
        res.status(200).send(result);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

router.get('/tags', verifyToken, (req, res) => {

        getTags(req.authData.id).then( result => {
            res.send(result);
        }).catch ( reason => res.send(reason));
});

router.get('/preSearch', verifyToken, (req, res) => {

        getPreSearchUserInfo(req.authData.id).then(result => {
            res.send(result);
        }).catch( err => res.send(err));
});

router.post('/search', verifyToken,  (req, res) => {
           const params = req.body.data;
           params.user_id = req.authData.id;
           getSearch(params).then(result => {
               res.send(result);
           }).catch( reason => res.send(reason));
});

router.post('/like', verifyToken, (req, res) => {// при матч на профайл сенд инсиин
   const myId = req.authData.id;
   const profileId = req.body.data.profileId;
   const myLogin = req.body.data.login;
   const profileLogin = req.body.data.profileLogin;
   const {isLike} = req.body.data;

   setBool(myId, profileId, 'is_like').then((result) => {
       if (isLike === 1)
       {
           setRate(profileId, -5, false).catch(reason => console.error(reason));
           insertNotification(myId, profileId, 'unlike').then(() =>{
               notify(profileId, 'notification', {login: myLogin, id: myId, id2: profileId, type: 3});
           }).catch(reason => console.error(reason));

       }
       else
       {
           setRate(profileId, 5, false).catch(reason => console.error(reason));
           insertNotification(myId, profileId, 'like').then(() => {
               notify(profileId, 'notification', {login: myLogin, id: myId, id2: profileId, type: 2});
           }).catch(reason => console.error(reason));
       }

       isConnected(myId, profileId).then((result) => {
           if (result === true) {
               isExistChat(myId, profileId).then((result) => {
                   if (result.length !== 0 && parseInt(result[0].is_active) === 0) {

                       setChatStatus(-1, result[0].user1_id, result[0].user2_id).then((result) => {
                           getUnseenMsgCount(profileId).then(result => {
                               insertNotification(myId, profileId, 'matched').then(() => {
                                   notify(profileId, 'notification', {login: myLogin, id: myId, id2: profileId, type: 4, unseenMsgArr: result});
                               }).catch(reason => res.send(reason));
                           }).catch( reason => res.send(reason));
                           insertNotification(profileId, myId, 'matched').then(() => {//send match to me
                               notify(myId, 'notification', {login: profileLogin, id: myId, id2: profileId, type: 4});
                           }).catch(reason => res.send(reason));
                           res.sendStatus(200);
                       });
                   }
                   else if (result.length === 0)
                   {
                       createChat(myId, profileId).then((result) => {
                           insertNotification(myId, profileId, 'matched').then(() => {
                               notify(profileId, 'notification', {login: myLogin, id: myId, id2: profileId, type: 4});
                           }).catch(reason => console.error(reason));
                           insertNotification(profileId, myId, 'matched').then(() => {//send match to me
                               notify(myId, 'notification', {login: profileLogin, id: myId, id2: profileId, type: 4});
                           }).catch(reason => console.error(reason));
                           res.sendStatus(200);//sfsdfsddgerth
                       });
                   }
               });
           } else if (result === false) { // vice versa
               isExistChat(myId, profileId).then((result) => {
                   if (result.length !== 0 && parseInt(result[0].is_active) === 1) {
                       setChatStatus(-1, result[0].user1_id, result[0].user2_id).then((result) => {
                           res.sendStatus(200);
                       });

                   } else {
                       res.sendStatus(200);
                   }
               });
           }
       });
   });
});

router.post('/block', verifyToken, (req, res) => {
    const myId = req.authData.id;
    const profileId = req.body.id;
    blockUser(myId, profileId).then((data)=> {
        blockUser(profileId, myId).then(()=>{
            setChatStatus(false, myId, profileId, (err, data) => {
                if (err === null)
                    res.sendStatus(200);
            });
        }).catch(reason => console.error(reason));
        res.sendStatus(200);//sdf
    }).catch(reason => {
        console.error(reason);
        res.sendStatus(500);
    });
});

router.post('/report', verifyToken, (req, res) => {
    const myId = req.authData.id;
    const profileId = req.body.id;
    reportUser(myId, profileId).then((response) => {
        res.send(true);
    }).catch( (err) => {
        res.send(false);
    });

});

router.post('/anotherUser', verifyToken,  (req, res) => {
    const myId = req.body.data.myId;
    const myLogin = req.body.data.login;
    const profileId = req.body.data.profileId;
    checkInBlack(myId, profileId)
        .then((data)=>{
            if (data === true){
                return Promise.reject(false);
        }
    }).then(()=>{
        madeVisit(myId, profileId).then((isAlreadyVisited) => {
            setRate(profileId, 1, isAlreadyVisited).then((affectedRows)=> {
                getAnotherUser(profileId, myId).then((anotherData)=> {
                        insertNotification(myId, profileId, 'visited').then(() => {
                            notify(profileId, 'notification', {login:myLogin, type: 1, isAlreadyVisited});
                        }).catch(reason => console.error(reason));
                    res.send(anotherData);
                })
            }).catch(reason => {console.error(reason)});

        }).catch(reason => console.log(reason));
    }).catch(reason => {
        if (reason === true)
            res.send([]);
        else {
            res.sendStatus(500);
        }
    });
});

router.post('/setLogin', verifyToken, (req, res) => {
   const newLogin = req.body.data.login;
   const {id} = req.authData;
   const password = req.body.data.password;
   const loginValid = validateReg.validateLogin(newLogin);
   if (loginValid === true)
   {
       checkPassword(id, password).then((data) => {

           isLoginExist(newLogin).then((result) => {
               if (result === true) {
                   setLogin(id, newLogin).then((result) => {
                       res.status(200).send({code: 0});
                   }).catch((error) => {
                       res.status(500).send(error);
                   });
               }
               else {
                   res.status(200).send({err: "This login is already used.", code: 1});
               }
           }).catch(error => {
              res.status(500);
           });
       }).catch(reason => {
          res.status(200).send({err:"Invalid current password!", code: 2});
       });

   }else {
       res.status(200).send({err:loginValid, code: 3});//error invalid login
   }
});

router.post('/setEmail', verifyToken, (req, res) => {
    const newEmail = req.body.data.email;
    const password = req.body.data.password;
    const {id} = req.authData;
    const emailValid = validateReg.validateEmail(newEmail);
    if (emailValid === true)
    {
        checkPassword(id, password).then(() => {
            isFieldExist('email', newEmail).then((obj) => {
                if (obj.length === 0) {
                    setEmail(id, newEmail).then((result) => {
                        res.status(200).send({code: 0});
                    }).catch((error) => {
                        res.status(500).send(error);
                    });
                }
                else {
                    res.status(200).send({err: 'This email is already exist!', code: 1});
                }
            });
        }).catch(reason => {
        res.status(200).send({err:"Invalid current password!", code:2});
    });
    } else {
        res.status(200).send({err:emailValid, code: 3});
    }
});

router.post('/setPassword', verifyToken, (req, res) => {
    const newPass = req.body.data.newPass;
    const repPass = req.body.data.rep;
    const oldpassword = req.body.data.old;
    const {id} = req.authData;
    const passValid = validateReg.validateSetPassword(newPass, repPass);
    if (passValid === true)
    {       checkPassword(id, oldpassword).then(() => {

                setPassword(id, newPass, 1).then((result) => {
                    res.status(200).send({code: 0});
                }).catch((error) => {
                    res.status(200).send({code: 1, error});
                });

        }).catch(reason => {
                res.status(200).send({err:"Invalid current password!", code:2});
            });
    }else {
        res.status(200).send({err:passValid, code: 3});//error invalid pass
    }
});

router.post('/seenNotifications', verifyToken, (req, res) => {
    const myId = req.authData.id;
    updateSeenNotifications(myId).then(resp =>{
        res.sendStatus(200);
    }).catch(reason => console.error(reason));
});

router.post('/setCoords', verifyToken, (req, res) => {
    const {coords, myId} = req.body;
    if (coords === null)
        res.send(null);
    else {
        updateCoords(myId, coords).then( resp => {
            res.sendStatus(200);
        }).catch(reason => {
            console.error(reason);
            res.send(reason);
        })
    }
});

//FORMAT OF TOKEN
// Authorization : Bearer <access_token>
function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //set token
        //Next middleware
        jwt.verify(bearerToken, 'abandon_all_hope_549510o', (err, authData) => {
            if (err)
                res.sendStatus(418);//I`m teapot
            else{
                req.authData = authData;
            }
            next();
        });
    }else {
        //Forbidden

        res.sendStatus(403);
    }

}
///test
router.get('*',(req, res) => {
    res.status(404).send('fuuuuuuuuuu....');
});

export default router;