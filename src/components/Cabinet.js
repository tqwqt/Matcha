import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import ProfileTab from './profile/ProfileTab';
import * as api from '../api';
import ChatTab from './chat/ChatTab';
import SearchTab from './search/SearchTab';
import Store from '../stores/chatTabStore';
import SocketStore from '../stores/SocketStore';
import UserStore from '../stores/UserStore';
import SettingsTab from './settings/SettingsTab'
import AnotherUserProfile from "./profile/AnotherUserProfile";
import NotificationTab from './notifications/NotificationTab';
import {observer} from 'mobx-react';
import {setCoords} from "../api";
const storeChatTab = new Store();
const socketStore = new SocketStore();
const userStore = new UserStore();
//UPDATE users SET location = (Point(50.484379 30.596581)) WHERE id = 8

 @observer
class Cabinet extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userID: null,
        redirect: false,
        choice: this.props.choice ? this.props.choice : 0,
        unseen: null,
        has_access : 0,
        mark: null
    };
    window.history.pushState({choice:this.state.choice}, "", window.location.href);
    this.grantAccess = this.grantAccess.bind(this);
  }


    componentDidMount() {
      window.addEventListener("popstate", this.popStateHandler);
      let coords = JSON.parse(localStorage.getItem('coords'));

      api.postCabinet({}).then(resp => {

      let unseen = this.countUnseen(resp.data.unseenMsg);
      this.setState({userID : resp.data.authData.id, unseen, }, ()=> {
          api.checkAccess().then(resp => {

              if (resp.data[0].has_access === 1) {
                  this.setState({ has_access : resp.data[0].has_access, mark:1});
              }
              else {
                  this.setState({ mark: 1}, () => {
                      api.hasToAccess().then(resp => {

                          if (resp.data[0].url !== null && resp.data[0].sex !== null && resp.data[0].orientation !== null && resp.data[0].bday !== null && resp.data[0].tags !== "" && resp.data[0].tags !== null) {
                              api.updateAccess().then(resp => {
                                  this.setState({ has_access : 1});
                              });
                          }

                      });
                  });
              }
          });
          const coords = JSON.parse(localStorage.getItem('coords'));
          storeChatTab.setUnseenMsgArr(resp.data.unseenMsg);
          userStore.setNotificationsArr(resp.data.notifications);
          setCoords(this.state.userID, coords).then(resp => {
              userStore.setUserID(this.state.userID);
              userStore.setUserLogin(localStorage.getItem('login'));
              //localStorage.removeItem('login');
              socketStore.connection(storeChatTab, userStore);
              storeChatTab.setUnseenMsg(unseen);
              socketStore.on('afterUpdateSeenMsg', (data) => {
                  let newMsgs = this.setUnseen(storeChatTab.chatData);
                  storeChatTab.setChatData(newMsgs);
              });
          }).catch(error => console.error(error));
      });
    }).catch((reason) => {
      localStorage.removeItem('userToken');
      this.setState({redirect: true});
    });


  }
  popStateHandler = (e) => {
      if (e.state){
          this.setState({choice : e.state.choice});
      }
  };
  setMySeen = (chat_id) =>{
    let myUnseenArr = storeChatTab.unseenMsgArr;
    myUnseenArr.forEach((item, myUnseenArr) => {
       if (item.chat_id === chat_id)
           item.num = 0;
    });

    const uns = this.countUnseen(myUnseenArr);
    storeChatTab.setUnseenMsg(uns);
    storeChatTab.setUnseenMsgArr(myUnseenArr);
    this.setState({unseen: uns})
  };

  setUnseen = (unseenArr) => {
      if (unseenArr){
          unseenArr.forEach((item, unseenArr)=> {
              item.is_seen = 1;
          });
      }
      return unseenArr;
  };

  countUnseen = (unseenArr)=> {
      let unseen = 0;
      if (unseenArr){
          unseenArr.forEach((item, unseenArr)=> {
              unseen += item.num;
          });
      }
      return unseen;
  };

  emit = (eventName, data) => {
    socketStore.socket.emit(eventName, data);
  };

  on = (event, callback) => {
    socketStore.socket.on(event, callback);
  };
  chatClick = (e) => {
    e.preventDefault();
     // window.location.assign('/cabinet/chat');
      this.setState({choice:1});
   //   storeChatTab.setActiveChatID(null);
      window.history.pushState({choice:1}, "", '/cabinet/chat');
  };
  profileClick = (e) => {
    e.preventDefault();
      //window.location.assign('/cabinet/profile');
        this.setState({choice:0});
      storeChatTab.setActiveChatID(null);
      window.history.pushState({choice:0}, "", '/cabinet/profile');
  };
  searchClick = (e) => {
      e.preventDefault();
      this.setState({choice: 3});
      storeChatTab.setActiveChatID(null);
      window.history.pushState({choice:3}, "", '/cabinet/search');
      //window.location.assign('/cabinet/search');
  };
  settingsClick = (e) => {
      e.preventDefault();
      //window.location.assign('/cabinet/settings');
      this.setState({choice:5});
      storeChatTab.setActiveChatID(null);
      window.history.pushState({choice:5}, "", '/cabinet/settings');
  };
  notifClick = (e) => {
         e.preventDefault();
         //window.location.assign('/cabinet/settings');
         this.setState({choice:2});
         storeChatTab.setActiveChatID(null);
         window.history.pushState({choice:2}, "", '/cabinet/notifications');
     };

  displayChoice = () => {
          if (this.state.mark === null)
              return <div></div>;
          if (this.state.choice === 0) {
              userStore.setActiveTab(this.state.choice);
              return <ProfileTab grantAccess={this.grantAccess} hasAccess={this.state.has_access}/>;
          }
          else if (this.state.choice === 1 && this.state.has_access === 1) {
              userStore.setActiveTab(this.state.choice);
              return <ChatTab socketStore={socketStore} emit={this.emit} on={this.on} userID={userStore.userID} login={userStore.login}
                              chatStore={storeChatTab} unseenMsg={storeChatTab.unseenMsgArr} setMySeen={this.setMySeen}/>;
          }
          else if (this.state.choice === 2){
              userStore.setActiveTab(this.state.choice);
              return <NotificationTab notifications={userStore.notificationsArr} userId={this.state.userID} setSeen={userStore.setUnseenNotifications}/>
          }
          else if (this.state.choice === 3 && this.state.has_access === 1) {
              userStore.setActiveTab(this.state.choice);
              return <SearchTab userStore={userStore}/>
          }
          else if (this.state.choice === 5) {
              userStore.setActiveTab(this.state.choice);
              return <SettingsTab socketStore={socketStore}/>
          }else if (this.state.choice === 6){
              userStore.setActiveTab(this.state.choice);
              return <AnotherUserProfile  profileId={this.props.match.params.id} userID={this.state.userID} chatStore={storeChatTab} sendNotif={socketStore.alertCustom}/>
          }
          else  if ((this.state.choice === 1 || this.state.choice === 3) && this.state.has_access === 0 ){
              userStore.setActiveTab(0);
              return <ProfileTab grantAccess={this.grantAccess} hasAccess={this.state.has_access}/>;
          }

  };
  logout = ()=> {
    localStorage.removeItem('userToken');
	    socketStore.socket.on('disconnect', this.disconnect);
    this.setState({redirect: true});
  };
  connect = () =>{
    this.setState({status:'connected'});
  };
  disconnect = () => {
    this.setState({status:'disconnected'});
  };

  renderUnreadMsgNumber = () => {
      if (storeChatTab.unseenMsg > 99)
          return "[99+]";
      else if (storeChatTab.unseenMsg === 0)
          return null;
      else
          return "[" + storeChatTab.unseenMsg + "]";
  };

     renderUnreadNotifNumber = () => {
         if (userStore.unseenNotifications > 99)
             return "[99+]";
         else if (userStore.unseenNotifications === 0)
             return null;
         else
             return "[" + userStore.unseenNotifications + "]";
     };

  renderChatTab = () => {
      if (this.state.has_access === 0) {
        return (
          <div className="not-active-tab">
              <span className="fas fa-comments"/>
              <span className="lh-40">Chat</span>
          </div>
        );
      }
      else {
          return (
              <a href="/cabinet/chat" className={this.state.choice === 1 ? "profile-menu-active fc-white fx-16" : "fc-white fx-16"} onClick={this.chatClick}>
                  <span className="fas fa-comments"/>
                  <span className="lh-40">Chat {this.renderUnreadMsgNumber()}</span>
              </a>
          )
      }
  };

  renderSearchTab = () => {
      if (this.state.has_access === 0) {
        return (
            <div className="not-active-tab">
                <span className="fas fa-search"/>
                <span className="lh-40">Search</span>
            </div>
        );
      }
      else {
          return (
              <a href="/cabinet/search" className={ (this.state.choice === 3 ? 'profile-menu-active fc-white fx-16' : "fc-white fx-16")} onClick={this.searchClick}>
                  <span className="fas fa-search"/>
                  <span className="lh-40">Search</span>
              </a>
          )
      }
  };

  grantAccess = (value) => {
    this.setState({has_access: value});
  };

  render() {
    if (this.state.redirect)
        {
      window.location.assign('/');
      return <Redirect to="/"/>;
    }
    return (
            <section className="profile">
                <div className="row nopadding h-100">
                    <div className="sidebar-panel col-12 col-lg-auto nopadding">
                        <div className="profile-header text-center"><a href="/cabinet/profile"><p className="fc-white fx-18">Matcha v.1.0</p></a></div>
                        <div className="profile-menu">
                            <a href="/cabinet/profile" className={(this.state.choice === 0 ? 'profile-menu-active' : "") + ' fc-white fx-16'} onClick={this.profileClick}><span className="far fa-address-card fc-white"></span><span className="lh-40">Profile</span></a>
                            {this.renderChatTab()}
                            <a href="/cabinet/notifications" className={ (this.state.choice === 2 ? 'profile-menu-active' : "") + ' fc-white fx-16'} onClick={this.notifClick}><span className="fas fa-bell fc-white"></span><span className="lh-40">Registry {this.renderUnreadNotifNumber()}</span></a>
                            {this.renderSearchTab()}
                            <a href="/cabinet/settings" className={ (this.state.choice === 5 ? 'profile-menu-active' : "") + ' fc-white fx-16'} onClick={this.settingsClick}><span className="fas fa-cogs fc-white"></span><span className="lh-40">Settings</span></a>
                        </div>
                        <div className="logout-area text-center">
                            <a className="logout-button" onClick={this.logout}>
                                <p className="fas fa-sign-out-alt fx-16"></p>
                                <p className="fx-16">Logout</p>
                            </a>
                        </div>
                    </div>
                    <div className="profile-content col-12 col-lg nopadding">
                        {this.state.userID !== null? this.displayChoice() : null}
                    </div>
                </div>
            </section>
    );
  }
}

Cabinet.propTypes = {};

export default Cabinet;
