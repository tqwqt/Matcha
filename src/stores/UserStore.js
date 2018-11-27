import {observable, action} from 'mobx'

class UserStore {
	@observable userID = null;
	@observable login = null;
	@observable age = 0;
	@observable rate = 0;
	@observable location = {};
	@observable sex = '';
	@observable orientation = '';
	@observable notificationsArr = null;
	@observable unseenNotifications = 0;
	@observable activeTab = null;

	@action setUserID = (id) => {
		this.userID = id;
	};
	@action setNotificationsArr = (arr) => {
	    this.notificationsArr = arr;
	    let unseen = 0;
	    arr.forEach((item, arr) => {
	        if (item.is_seen === 0)
	            unseen++;
        });
	    this.unseenNotifications = unseen;
    };
	@action setActiveTab = (value) => {
		this.activeTab = value;
	};
	@action setUnseenNotifications = (unseen) => {
	   this.unseenNotifications = unseen;
    };
    @action setUserLogin = (login)=>{
		this.login = login;
	};
    @action setUserAge = (age)=>{
        this.age = age;
    };
    @action setUserRate = (rate)=>{
        this.rate = rate;
    };
    @action
    setUserLocation = (loc)=>{
        this.location = loc;
    };
    @action
    setUserSex = (value) => {
    	this.sex = value;
	};
    @action
    setUserOrientation = (value) => {
        this.orientation = value;
    };

}

export default UserStore;