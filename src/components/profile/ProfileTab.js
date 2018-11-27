import React, {Component} from 'react';
import {getProfile, getTags, updateProfile, removeProfileTags, updateProfileTags, updateProfilePhotos, removePhoto, setNewAvatar, unsetAvatar} from '../../api';
import PropTypes from 'prop-types';
import { WithContext as ReactTags } from 'react-tag-input';
import css from './react-tag-input.css';
import TextareaWithCounter from './TextareaWithCounter';
import FormData from "form-data";

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported

import Modal from 'react-modal';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// ECMAScript 2015
import regeneratorRuntime from "regenerator-runtime";

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');

class ProfileTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            surname: "",
            nickname: "",
            avatar: "",
            photos: [],
            dobDay: "ns",
            dobMonth : "ns",
            dobYear: "ns",
            age: 0,
            rate: 0,
            gender: "",
            orientation: "",
            bio: "",
            tags: [],
            suggestions: [
                { id: 'travel', text: 'Travel' },
                { id: 'football', text: 'Football' },
                { id: 'programming', text: 'Programming' },
                { id: 'chess', text: 'Chess' },
                { id: 'php', text: 'PHP' },
                { id: 'dota', text: 'Dota' },
                { id: 'bdsm', text: 'BDSM' },
                { id: 'web development', text: 'Web Development' },
                { id: '42 school', text: '42 school' },
                { id: 'politics', text: 'Politics' },
                { id: 'sport', text: 'Sport' },
                { id: 'history', text: 'History' },
                { id: 'hiking', text: 'Hiking' },
                { id: 'jogging', text: 'Jogging' },
                { id: 'marathons', text: 'Marathons' }
            ],
            edit: 0,
            firstnameErrors : [],
            surnameErrors : [],
            dobErrors: [],
            isOpenAvatar: false,
            photoIndex: 0,
            photoIndexNext: 1,
            isOpenPhotos: false,
            isOpenPhotosNext : false,
            isAvatarEditorIndex : 0,
            EditorPhotos : null,
            avatarStorage : null,
            filesForFormData: {},
            modalIsOpen: false,
            crop: {
                aspect: 1/1
            },
            ReactCropImage: null,
            OriginalReactCropImage: null,
            CropImageWidth: null,
            CropImageHeight: null,
            ModifiedCroppedImage: null,
            onlineStatus: null,
            hasAccess: this.props.hasAccess

        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({ModifiedCroppedImage: null, modalIsOpen: false});
    }


    componentDidMount() {
        this.getUserInfo();
        this.getUserTags();
    }

    getAge = (dob) =>{
        let diff_ms = Date.now() - dob.getTime();
        let age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    getUserInfo = () => {
        getProfile().then(resp => {

            let data = resp.data;
            let photos, ava, dob, dobDay, dobMonth, dobYear, age, orientation, sex;

            photos = data[0].photos === null ? [] : data[0].photos.split(',');
            ava = photos.length === 0 ? "" : photos[0];
            photos.splice(0, 1);

            photos = photos.reverse();

            if (data[0].dob !== null)
            {
                dob = new Date(data[0].dob);
                let getMonthResult = dob.getMonth();
                dobDay = dob.getDate();
                dobMonth = dob.getMonth() + 1 <= 9 ? "0" + (getMonthResult + 1) : getMonthResult + 1;
                dobYear = dob.getFullYear();
                age = data[0].bday === null ? "not set" : this.getAge(new Date(data[0].bday));
            }
            else
            {
                dobDay = "ns";
                dobMonth = "ns";
                dobYear = "ns";
                age = 0;
            }

            if (data[0].orientation === null) {
                orientation = "bisexual";
            }
            else {
                orientation = data[0].orientation;
            }

            if (data[0].sex === null) {
                sex = "ns";
            }
            else {
                sex = data[0].sex;
            }

            this.setState({
                firstname: data[0].name,
                avatar: ava,
                photos: photos,
                age: age,
                birthday: data[0].dob,
                surname: data[0].lastName,
                nickname:data[0].login,
                gender: sex,
                orientation: orientation,
                bio: data[0].bio,
                dobDay: dobDay,
                dobMonth: dobMonth,
                dobYear: dobYear,
                onlineStatus: 1,
                rate: data[0].rate,
                hasAccess: data[0].has_access,
            });
        }).catch((reason) => {
            localStorage.removeItem("userToken");
        });
    };

    getUserTags = () => {
        getTags().then(resp => {
            const data = resp.data;
            data.forEach((el, data) => {
                el.id += '';
                el.text = el.tag;
            });
            this.setState({tags: data});
        });
    };

    updateDataOnSave = () => {

        if (this.state.firstnameErrors.length === 0 && this.state.surnameErrors.length === 0 && this.state.dobErrors.length === 0) {

            let bday, gender;

            if (this.state.dobDay !== "ns" && this.state.dobMonth !== "ns" && this.state.dobYear !== "ns") {
                bday = this.state.dobYear + "-" + this.state.dobMonth + "-" + this.state.dobDay;
            }
            else {
                bday = null;
            }

            if (this.state.gender !== "ns") {
                gender = this.state.gender;
            }
            else {
                gender = null;
            }

            const data = {firstname : this.state.firstname,
                surname : this.state.surname,
                bday : bday,
                gender : gender,
                orientation : this.state.orientation,
                bio : this.state.bio,
            };

            updateProfile(data).then((res) =>
            {
                removeProfileTags().then((res) => {
                    if (this.state.tags.length !== 0) {
                        updateProfileTags(this.state.tags).then((res) => {
                            this.setState({edit: 0}, () => {
                                if (this.state.avatar !== null &&
                                    this.state.avatar.length !== 0 &&
                                    this.state.gender !== null &&
                                    this.state.gender !== "ns" &&
                                    this.state.dobDay !== "ns" &&
                                    this.state.dobMonth !== "ns" &&
                                    this.state.dobYear !== "ns" &&
                                    this.state.tags.length !== 0 &&
                                    this.state.tags !== null) {
                                    this.props.grantAccess(1);
                                }
                            })
                        }).catch(error => {
                        });
                    }
                    else {
                        this.setState({edit: 0}, () => {
                            if (this.state.avatar !== null &&
                                this.state.avatar.length !== 0 &&
                                this.state.gender !== null &&
                                this.state.gender !== "ns" &&
                                this.state.dobDay !== "ns" &&
                                this.state.dobMonth !== "ns" &&
                                this.state.dobYear !== "ns" &&
                                this.state.tags.length !== 0 &&
                                this.state.tags !== null) {
                                this.props.grantAccess(0);
                            }
                        });
                    }
                }).catch(error => {
                });
            }).catch(error => {
            });
        }
        this.forceUpdate();
    };

    saveChanges = (e) => {

        e.preventDefault();

        this.setState({ firstnameErrors : [], surnameErrors : [], dobErrors : []}, () => {


            if ((this.state.firstname).length < 2 || (this.state.firstname).length > 30) {
                this.state.firstnameErrors.push("Firstname should not have less than 2 and more than 30 chars");
            }
            if ((this.state.firstname).search(/([0-9]+)/) !== -1) {
                this.state.firstnameErrors.push("Firstname should not contain digits");
            }
            if ((this.state.surname).length < 2 || (this.state.surname).length > 30) {
                this.state.surnameErrors.push("Surname should not have less than 2 and more than 30 chars");
            }
            if ((this.state.surname).search(/([0-9]+)/) !== -1) {
                this.state.surnameErrors.push("Surname should not contain digits");
            }
            if ((this.state.dobDay !== "ns" || this.state.dobMonth !== "ns" || this.state.dobYear !== "ns") &&
                !(this.state.dobDay !== "ns" && this.state.dobMonth !== "ns" && this.state.dobYear !== "ns")) {
                this.state.dobErrors.push("Incorrect day of birth");
            }
            if (this.state.isAvatarEditorIndex > 0)
            {
                this.setState({avatarStorage: this.state.avatar}, () => {

                    this.setState({avatar: this.state.photos[this.state.isAvatarEditorIndex - 1]}, () => {

                        let newPhotos = this.state.photos;

                        newPhotos.splice(this.state.isAvatarEditorIndex - 1, 1);
                        newPhotos.unshift(this.state.avatarStorage);

                        this.setState({ photos: newPhotos, isAvatarEditorIndex : 0}, () => {
                            this.updateDataOnSave();
                        });
                    });
                });
            }
            else {
                this.updateDataOnSave();
            }
        });

    };


    displayFirstnameErrors = () => {

        if (this.state.firstnameErrors.length !== 0) {

            const errors = this.state.firstnameErrors;

            return (errors.map((error, index) => {
                return (
                    <span className="input-error" key={index}>{ error }</span>
                )
            }));
        }
    };

    displaySurnameErrors = () => {

        if (this.state.surnameErrors.length !== 0) {

            const errors = this.state.surnameErrors;

            return (errors.map((error, index) => {
                return (
                    <span className="input-error" key={index}>{ error }</span>
                );
            }));
        }
    };


    checkInputs = (e) => {
        const input = e.target.name;

        this.setState({ [input] : e.target.value } );
    };

    editProfile = (e) => {
        e.preventDefault();

        this.setState({edit : 1});
    };

    renderAvatar = () => {
        const { isOpenAvatar } = this.state;
        if (this.state.avatar !== null && this.state.avatar.length !== 0) {
            return (
                <div className="MajorPhoto text-center">
                    <img className="MajorPhoto" src={this.state.avatar} onClick={() => this.setState({ isOpenAvatar: true })}/>
                    {isOpenAvatar &&
                        (<Lightbox
                            mainSrc={this.state.avatar}
                            onCloseRequest={() => this.setState({ isOpenAvatar : false })}
                            enableZoom={false}
                        />
                        )
                    }
                </div>
            );
        }
        else
            return null;
    };


    IndexHandle = (e) => {

        let arrowType = e.target.getAttribute('data-arrow');

        if (arrowType === "left") {
            if (this.state.photoIndex - 1 < 0)
            {
                this.setState({ photoIndex: this.state.photos.length - 1});
            }
            else
                this.setState({ photoIndex : this.state.photoIndex - 1});
            if (this.state.photoIndexNext - 1 < 0)
            {
                this.setState({ photoIndexNext : this.state.photos.length - 1});
            }
            else
                this.setState({photoIndexNext : this.state.photoIndexNext - 1 })
        }

        if (arrowType === "right") {

            if (this.state.photoIndexNext + 1 === this.state.photos.length) {
                this.setState({photoIndexNext: 0})
            }
            else {
                this.setState({photoIndexNext: this.state.photoIndexNext + 1});
            }
            if (this.state.photoIndex + 1 === this.state.photos.length)
                this.setState({ photoIndex : 0});
            else
                this.setState({photoIndex : this.state.photoIndex + 1});
        }
    };


    renderPhotosContainer = () => {
        const { isOpenPhotos, isOpenPhotosNext, photoIndex, photoIndexNext } = this.state;

        if (this.state.photos !== null && this.state.photos.length !== 0) {
            let nextItem = <img className="Photo" src={this.state.photos[photoIndexNext]} onClick={() => this.setState({ isOpenPhotosNext : true })}/>;
            let arrowLeft = <i className="fx-30 nav-arrow-left fas fa-arrow-circle-left" data-arrow="left" onClick={this.IndexHandle}/>;
            let arrowRight = <i className="fx-30 nav-arrow-right fas fa-arrow-circle-right" data-arrow="right" onClick={this.IndexHandle}/>;
            return (
              <div className="photo-container">
                  { this.state.photos.length > 2 ? arrowLeft : null }
                  <img className="Photo" src={this.state.photos[photoIndex]} onClick={() => this.setState({ isOpenPhotos : true })}/>
                  { this.state.photos.length > 1 ?  nextItem : null }
                  { this.state.photos.length > 2 ? arrowRight : null }
                  {isOpenPhotos && (
                      <Lightbox
                          mainSrc={this.state.photos[photoIndex]}
                          onCloseRequest={() => this.setState({ isOpenPhotos: false })}
                          enableZoom={false}
                      />
                  )}
                  {isOpenPhotosNext && (
                      <Lightbox
                          mainSrc={this.state.photos[photoIndexNext]}
                          onCloseRequest={() => this.setState({ isOpenPhotosNext: false })}
                          enableZoom={false}
                      />
                  )}
              </div>
            );
        }
    };


    EditorRemovePhoto = (index) => {

        let { photos } = this.state;
        let newPhotos = [...photos];


        if (index === 0)
        {
            newPhotos.splice(0, 1);
            this.setState({ avatar: this.state.photos[0], photos : newPhotos });
        }
        if (index > 0)
        {
            newPhotos.splice(index - 1, 1);
            this.setState({ photos : newPhotos,  isAvatarEditorIndex: 0});
        }
    };

    setPhotoAsAvatar = (index, src) => {
        if (index !== this.state.isAvatarEditorIndex) {
            unsetAvatar().then((res) => {
                setNewAvatar(src);
                this.setState({isAvatarEditorIndex : index});
            });
        }
    };

    renderRemoveButton = (index, src) => {

        if (index === 0 && this.state.photos.length === 0) {
            return null;
        }
        else
            return (
                <div className="RemovePhotoButton" onClick={ ()  => {
                    removePhoto(src).then((res) => {
                        if (index === 0) {
                            setNewAvatar(this.state.photos[0]);
                        }
                        this.EditorRemovePhoto(index);
                    });
                } }>
                    <p className="fx-16 fas fa-times-circle"/>
                    <p className="fx-16 pl-2">Remove</p>
                </div>
            );

    };

    renderCurrentPhotos = () => {

        if (this.state.avatar.length !== 0) {
            let { photos, avatar } = this.state;
            let copyPhotos =  [...photos];

            copyPhotos.unshift(avatar);
            return (copyPhotos.map((src, index) => {
                return (
                    <div key={index} className="editor-photo-item row nopadding justify-content-center">
                        <div className="col-auto nopadding">
                            <img className={"editor-photo" + ((this.state.isAvatarEditorIndex === index && this.state.photos.length !== 0) ? " PhotoAsAvatar" : "")} src={src} onClick={() => this.setPhotoAsAvatar(index, src)}/>
                        </div>
                        <div className="EditPhotosControlButtons col-auto nopadding">
                            {this.renderRemoveButton(index, src)}
                        </div>
                    </div>
                )
            }));
        }
    };


    handlePhotoUpload = (e) => {

        if (this.state.photos.length + 1 === 5) {

            alert("The max number of photos has been already uploaded. But you can remove one photo to upload another one instead.");
            e.target.value = null;
            return false;
        }
        else {
            let file = {...e.target.files};
            let found = 0;

            e.target.value = null;
            if (typeof(file) !== "undefined")
            {
                let mime_types = ["image/jpeg", "image/png"];

                for (let i = 0, type; type = mime_types[i]; i++)
                {
                    if (file[0].type === type)
                    {
                        found = 1;
                        break ;
                    }
                }

                if (file[0].size >= 2000000)
                {
                    alert("File couldn't weight more than 2 megabytes");
                    return false;
                }

                if (found === 1)
                {
                    let reader = new FileReader();

                    reader.readAsDataURL(file[0]);

                    const scope = this;

                    reader.onload = (e) => {
                        let img = new Image();

                        img.src = e.target.result;


                        img.onload = function () {
                            let width = this.width;
                            let height = this.height;

                            if (width < 400 || height < 400) {
                                alert("The photo can not have width or height less than 400px");
                                return false;
                            }

                            let newCrop = scope.state.crop;

                            newCrop['x'] = 0;
                            newCrop['y'] = 0;
                            newCrop['width'] = (400 * 100) / width;
                            newCrop['height'] = (400 * 100) / height;

                            scope.setState({ReactCropImage: img.src, modalIsOpen: true, CropImageWidth: width, CropImageHeight: height, crop: newCrop});
                        };
                    }
                }
                else
                {
                    alert("Image should be in JPEG or PNG format");
                    return false;
                }

            }
            else
            {
                alert("This browser does not support HTML5");
                return false;
            }
        }
    };

    handleOnCropChange = (crop) => {
        this.setState({crop: crop});
    };

    handleImageLoaded = (image) => {

        this.state.OriginalReactCropImage = image;
    };

    handleOnCropComplete = (crop, pixelCrop) => {

        let canvas = document.createElement('canvas');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        let ctx = canvas.getContext("2d");

        ctx.drawImage(
            this.state.OriginalReactCropImage,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        let image = canvas.toDataURL('image/png');

        this.setState({ModifiedCroppedImage: image});
    };

    renderCropper = () => {
      return (
          <ReactCrop
              src={this.state.ReactCropImage}
              crop={this.state.crop}
              onImageLoaded={this.handleImageLoaded}
              onComplete={this.handleOnCropComplete}
              onChange={this.handleOnCropChange}
              minWidth={(400 * 100) / this.state.CropImageWidth}
              minHeight={(400 * 100) / this.state.CropImageHeight}
          />
      )
    };

    handleCropping = () => {

        if (this.state.ModifiedCroppedImage !== null) {

            const image = this.state.ModifiedCroppedImage;

            fetch(image)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "cropped image");

                    let formData = new FormData();

                    if (this.state.avatar.length === 0) {
                        formData.append("avatar", file);
                    }
                    else {
                        formData.append("photo", file);
                    }

                    updateProfilePhotos(formData).then((result) => {
                        let url = result.data[0];
                        let is_avatar = result.data[1];
                        if (is_avatar === 1) {
                            this.setState({avatar : url}, () => {
                                this.setState({modalIsOpen: false});
                            });
                        }
                        else {
                            let updatedPhotos = this.state.photos;
                            updatedPhotos.push(url);
                            this.setState({photos: updatedPhotos}, () => {
                                this.setState({modalIsOpen: false});
                            });
                        }
                    });
                })
        }

    };

    renderAvatarsOrUploader = () => {

        const { croppedImageUrl } = this.state;

        if (this.state.edit === 1) {
            return (
                <div className="avatar-area text-center">
                    <form>
                        { this.renderCurrentPhotos() }
                        <input type="file" name="photo" className="InputFilePhotos" onChange={this.handlePhotoUpload} accept="image/png, image/jpg, image/gif"/>
                    </form>

                    <div>
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            contentLabel="Example Modal"
                            style={customStyles}
                        >

                            { this.state.ReactCropImage !== null ? this.renderCropper() : null}

                            <div className="Cropper-Modal-Control text-center" onClick={this.handleCropping}>
                                <div className="crop-button">
                                    <p className="fas fa-crop-alt"/>
                                    <p className="fx-16 pl-2">Crop</p>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="avatar-area text-center">
                        { this.renderAvatar() }
                    { this.renderPhotosContainer() }
                </div>
            );
        }
    };

    displayOnlineStatus = () => {
      return (
          <div className="whois">
              { this.state.firstname !== null && this.state.surname !== null ? <div className="fx-18" key="username">{ this.state.firstname + " " + this.state.surname}</div> :
                  <div className="fx-18" key="username">User</div>}

              { this.state.onlineStatus === 1 ? <div className="status-online" key="online"/> : <div>{this.state.onlineStatus}</div>}
          </div>
      )
    };

    displayProfile = () => {

        let profile = [];

        if (this.state.gender !== null && this.state.gender !== "ns") {
            profile.push(<p className="gender fx-14" key="gender"> { this.state.gender }</p>);
        }

        if (this.state.age !== null && this.state.age !== 0) {
            profile.push(<p className="age fx-14" key="age">{ this.state.age + " years" }</p>)
        }

        if (this.state.orientation !== null) {
            profile.push(<p className="sex-orientation fx-14" key="orientation">{ this.state.orientation }</p>)
        }

        if (this.state.bio !== null && this.state.bio !== "") {
            profile.push(<p className="biography fx-14" key="bio">{ this.state.bio }</p>)
        }
        else {
            profile.push(<p className="biography fx-14" key="bio">(No biography written)</p>)
        }

        return profile;
    };

    displayTagList = () => {

      if ((this.state.tags).length !== 0) {

          const tags = this.state.tags;

          let list = [];

          tags.forEach((tag, index) => {
              list.push(<span className="profile-tags" key={"tag-" + index}>{ tag.text }</span>);
          });

          return <div className="profile-display-tags"><p className="fx-14">Highlighted interests</p>{list}</div>
      }
    };

    updateGender = (e) => {
        if (e.target.value !== "ns") {
            this.setState({ gender : e.target.value });
        }
    };


    DOBSelectors = () => {
        let DOptions = [];
        let MOptions = [];
        let YOptions = [];

        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentYear = new Date().getFullYear();

        if (this.state.dobDay === "ns") {
            DOptions.push(<option key="day-undefined" value="ns">not set</option>);
        }
        if (this.state.dobMonth === "ns") {
            MOptions.push(<option key="month-undefined" value="ns">not set</option>);
        }
        if (this.state.dobYear === "ns") {
            YOptions.push(<option key="year-undefined" value="ns">not set</option>);
        }

        for (let i = 1; i <= 28; i++) {
            DOptions.push(<option key={"day-" + i} value={i}>{i}</option>);
        }

        for (let i = 1; i < 13; i++) {
            MOptions.push(<option key={"month-" + i} value={i <= 9 ? "0" + i : i}>{months[i - 1]}</option>);
        }

        switch(this.state.dobMonth) {
            case "02":
                if (this.state.dobYear % 4 === 0) {
                    DOptions.push(<option key="day-29" value="29">29</option>);
                }
                break ;
            case "04":
            case "06":
            case "09":
            case "11":
                DOptions.push(<option key="day-29" value="29">29</option>);
                DOptions.push(<option key="day-30" value="30">30</option>);
                break ;
            default:
                DOptions.push(<option key="day-29" value="29">29</option>);
                DOptions.push(<option key="day-30" value="30">30</option>);
                DOptions.push(<option key="day-31" value="31">31</option>);
                break ;
        }

        for (let i = currentYear - 18; i >= currentYear - 100; i--) {
            YOptions.push(<option key={"year-" + i} value={i}>{i}</option>);
        }

        return (
            <div className="dob-selectors">
                <select className="dob-selector" value={ this.state.dobDay } onChange={this.checkDOBDay}>{DOptions}</select>
                <select className="dob-selector" value={ this.state.dobMonth } onChange={this.checkDOBMonth}>{MOptions}</select>
                <select className="dob-selector" value={ this.state.dobYear } onChange={this.checkDOBYear}>{YOptions}</select>
            </div>
        );
    };

    checkDOBDay = (e) => {


        this.setState({dobDay : e.target.value }, () => {
            let dob = new Date(this.state.dobYear, this.state.dobMonth, this.state.dobDay);

            this.setState({ age: this.getAge(dob) });
        });
    };

    checkDOBMonth = (e) => {


        this.setState({ dobMonth : e.target.value }, () => {
            let dob = new Date(this.state.dobYear, this.state.dobMonth, this.state.dobDay);

            this.setState({ age: this.getAge(dob) });
        });
    };

    checkDOBYear = (e) => {


        this.setState({ dobYear : e.target.value }, () => {
            let dob = new Date(this.state.dobYear, this.state.dobMonth, this.state.dobDay);

            this.setState({ age: this.getAge(dob) });

        });
    };

    updateOrientation = (e) => {
        this.setState({ orientation : e.target.value });
    };

    updateBiography = (value) => {

        this.setState({ bio : value });

    };

    doNotHaveAccess = () => {
      if (this.state.avatar === null ||
          this.state.avatar.length === 0 ||
          this.state.gender === null ||
          this.state.gender === "ns" ||
          this.state.dobDay === "ns" ||
          this.state.dobMonth === "ns" ||
          this.state.dobYear === "ns" ||
          this.state.tags.length === 0 ||
          this.state.tags === null) {
          return (
              <div className="profile-title-attention row nopadding">
                  <div className="col-auto nopadding">
                      <i className="fx-30 fas fa-exclamation-circle"/>
                  </div>
                  <div className="col nopadding">
                      <p className="fx-16">Your profile is not visible to others until you set up <u>an avatar image</u>, <u>sex</u>, <u>the day of birth</u> and <u>tags of interests</u></p>
                  </div>
              </div>
          );
      }
      else {
          return null;
      }
    };

    renderGenderSelector = () => {
        let genderOptions = [];

        if (this.state.gender === "ns") {
            genderOptions.push(<option key="ns" value="ns">not set</option>);
        }

        genderOptions.push(<option key="female" value="female">Female</option>);
        genderOptions.push(<option key="male" value="male">Male</option>);

        return (
            <select className="profile-selector" value={this.state.gender} onChange={this.updateGender}>
                { genderOptions }
            </select>
        );
    };

    displayDOBErrors = () => {

        if (this.state.dobErrors.length !== 0) {

            const errors = this.state.dobErrors;

            return (errors.map((error, index) => {
                return (
                    <span className="input-error" key={index}>{ error }</span>
                )
            }));
        }

    };

    displayRateBar = () => {
        if (this.state.hasAccess) {
            return (
                <div className="rate-bar">
                    <p>rate</p>
                    <p>{this.state.rate + "%"}</p>
                </div>
            )
        }
    };

    renderProfileOrEditor = () => {
        if (this.state.edit === 1) {
            return (
                <div className="profile-edit">
                    <p className="fx-18">Edit Profile</p>
                    <div className="name-inputs-group">
                        <input className="input-name fx-18" name="firstname" maxLength={30} type="text" placeholder="Firstname" value={this.state.firstname} onChange={this.checkInputs}/>
                        { this.displayFirstnameErrors() }
                        <input className="input-surname fx-18" name="surname" maxLength={30} type="text" placeholder="Surname" value={this.state.surname} onChange={this.checkInputs}/>
                        { this.displaySurnameErrors() }
                    </div>
                    <p className="profile-selector-desc pt-3">Gender</p>
                    {this.renderGenderSelector()}
                    <p className="profile-selector-desc">Day of birth</p>
                    { this.DOBSelectors() }
                    { this.displayDOBErrors() }
                    <p className="profile-selector-desc">Sexual orientation</p>
                    <select className="profile-selector" value={this.state.orientation} onChange={this.updateOrientation}>
                        <option value="straight">straight</option>
                        <option value="bisexual">bisexual</option>
                        <option value="gay">gay</option>
                    </select>
                    <p className="profile-selector-desc pt-3">Biography</p>
                    <TextareaWithCounter CustomClass="profile-textarea" CounterClass="char-remained" placeholder="Tell about yourself..." maxlength={500} text={ this.state.bio } updateBiography={this.updateBiography} />
                    <div className="profile-display-tags">
                        <p className="profile-selector-desc">Highlighted interests</p>
                        <ReactTags tags={this.state.tags}
                                   suggestions={this.state.suggestions}
                                   handleDelete={this.handleDelete}
                                   handleAddition={this.handleAddition}
                                   handleDrag={this.handleDrag}
                                   delimiters={delimiters}
                                   maxLength={20}
                        />
                    </div>
                    <div className="save-changes-button" onClick={this.saveChanges}>
                        <p className="far fa-save fx-16"/>
                        <p className="fx-16 pl-2">Save changes</p>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="profile-page">
                    { this.doNotHaveAccess() }
                    { this.displayOnlineStatus()}
                    { this.displayRateBar() }
                    { this.displayProfile() }
                    { this.displayTagList() }
                    <div className="profile-button edit-profile-button" onClick={this.editProfile}>
                        <p className="fas fa-pen fx-16"/>
                        <p className="fx-16 pl-2">Edit profile</p>
                    </div>
                </div>
            );
        }
    };

    render() {
        return (
            <div className="row h-100 nopadding">
                <div className="col-12 col-lg-auto">
                    {this.renderProfileOrEditor()}
                </div>
                <div className="col-12 col-lg">
                    {this.renderAvatarsOrUploader()}
                </div>
            </div>
        )
    }
}

ProfileTab.propTypes = {};

export default ProfileTab;
