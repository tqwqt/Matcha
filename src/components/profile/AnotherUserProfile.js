import React, {Component} from 'react';
import {blockProfile, getAnotherUser, getProfile, likeProfile, reportProfile} from '../../api';
import {observer} from 'mobx-react';
import Lightbox from 'react-image-lightbox';
import PropTypes from 'prop-types';
import { WithContext as ReactTags } from 'react-tag-input';
import css from './react-tag-input.css';
import TextareaWithCounter from './TextareaWithCounter';

@observer
class AnotherUserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myId: 0,
            profileId: parseInt(this.props.profileId),
            name: "user_name",
            lastName: "",
            nickname: null,
            avatar: "",
            photos: [],
            age: 0,
            gender: "",
            orientation: "",
            bio: "",
            tags: [
            ],
            isLike: null,
            isConnected: null,
            isOpenAvatar: false,
            photoIndex: 0,
            photoIndexNext: 1,
            isOpenPhotos: false,
            isOpenPhotosNext : false,
        };
    }


    componentDidMount() {
        const myId = this.props.userID;
        if (myId && myId !== this.state.profileId){

            this.setState({myId}, ()=>{

                getAnotherUser({myId:this.state.myId, profileId: this.state.profileId, login:localStorage.getItem('login')})
                    .then(resp => {
                        let photos = resp.data[0].photos.split(',');
                        const ava = photos[0];
                        photos.splice(0, 1);
                        if (resp.data.length !== 0){
                            this.setState({
                                name:resp.data[0].name,
                                lastName: resp.data[0].lastName,
                                nickname: resp.data[0].login,
                                photos,
                                age: resp.data[0].age,
                                gender: resp.data[0].sex,
                                orientation: resp.data[0].orientation,
                                bio: resp.data[0].bio,
                                tags: resp.data[0].tags,
                                isLike: resp.data[0].is_like,
                                isConnected: resp.data[0].is_connected,
                                avatar: ava,
                            });
                        }

                    }).catch(reason => {
                });
            });
        }else {
            window.location.assign('/cabinet/profile');
        }
    }

    // getAge = (dob) =>{
    //     let diff_ms = Date.now() - dob.getTime();
    //     let age_dt = new Date(diff_ms);
    //
    //     return Math.abs(age_dt.getUTCFullYear() - 1970);
    // };
    getUserInfo = ()=>{

        getProfile().then(resp => {
            const data = resp.data;
            let ava = "";
            let photos = [];
            const age = data[0].age;
            data.forEach(function(item, i, data) {
                if (item.is_avatar)
                    ava = item.url;
                else
                    photos.push(item.url);
            });
            this.setState({
                name:data[0].name,
                avatar:ava,
                photos,
                age,
                lastName: data[0].lastName,
                nickname:data[0].login,
                gender:data[0].sex,
                orientation:data[0].orientation,
                bio:data[0].bio
            });
        }).catch((reason) => {
            localStorage.removeItem("userToken");
        })
    };
    likeHandler = () => {
        likeProfile({profileId:this.state.profileId, isLike: this.state.isLike, login:localStorage.getItem('login'), profileLogin: this.state.nickname}).then(resp => {
            const like = this.state.isLike === 0 ? 1 : 0;
            this.setState({isLike: like});
            if (like === 0){
                this.props.chatStore.removeChat(this.state.profileId);
            }

        }).catch(reason => console.log(reason));
    };
    blockHandler = () => {
        blockProfile(this.state.profileId).then(resp => {
            window.location.assign('/cabinet/profile');
        }).catch(reason => console.log(reason));
    };
    reportHandler = () => {

            reportProfile(this.state.profileId).then((resp) => {
                this.props.sendNotif('Report:', 'sent');
            }).catch(err => {
                console.error(err);
            });
    };
    renderAvatarsOrUploader = () => {
        if (this.state.edit === 1) {
            return (
                <div className="avatar-area">
                    <div className="profile-avatar">
                        <input type="file"/>
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
    displayTags = ()=>{

            if ((this.state.tags).length !== 0) {

                const tags = this.state.tags.split(',');

                let list = [];

                tags.forEach((tag, index) => {
                    list.push(<span className="profile-tags" key={"tag-" + index}>{ tag }</span>);
                });

                return <div className="profile-display-tags"><p className="fx-14">Highlighted interests</p>{list}</div>
            }
    };
    renderProfileOrError = () => {
        if (this.state.nickname !== null)
        {return (
                <div className="profile-page">
                    <p className="fx-18">{this.state.name} {this.state.lastName}</p>
                    <p className="gender fx-14">{this.state.gender}</p>
                    <p className="age fx-14">{this.state.age} years</p>
                    <p className="sex-orientation fx-14">{this.state.orientation}</p>
                    <p className="biography fx-14">{this.state.bio ? this.state.bio : "(No biography written)"}</p>
                    {this.displayTags()}
                    <div className={this.state.isLike ? "profile-button like-button-liked" : "profile-button like-button"} onClick={this.likeHandler}>
                        <p className="fx-16 fas fa-heart"></p>
                        <p className="fx-16 pl-2">Like</p>
                    </div>
                    <div className="profile-button report-button" onClick={this.reportHandler}>
                        <p className="fx-16 fas fa-exclamation-triangle"></p>
                        <p className="fx-16 pl-2">Report as "fake"</p>
                    </div>
                    <div className="profile-button block-button" onClick={this.blockHandler}>
                        <p className="fx-16 fas fa-times-circle"></p>
                        <p className="fx-16 pl-2">Block</p>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="profile-page">
                    <div className="profile-title-attention row nopadding">
                        <div className="col-auto nopadding">
                            <i className="fx-30 fas fa-exclamation-circle"/>
                        </div>
                        <div className="col nopadding">
                            <p className="fx-16 pt-2"><b>User not found</b></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
    render() {
        // const { tags, suggestions } = this.state;
        return (
            <div className="row h-100 nopadding">
                <div className="col-12 col-lg-auto">
                    {this.renderProfileOrError()}
                </div>
                <div className="col-12 col-lg">
                    {this.renderAvatarsOrUploader()}
                </div>
            </div>
        )
    }
}

export default AnotherUserProfile;