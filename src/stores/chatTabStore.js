import {observable, action} from 'mobx'

class  ChatTabStore  {


	@observable activeChatID;
	@observable chats;
	@observable chatData;
	@observable toSend;
	@observable lastMsg;
	@observable chatAvatars;
	@observable ids;
	@observable unseenMsg;
    @observable unseenMsgArr;

	constructor() {
		this.activeChatID = null;
		this.unseenMsg = null;
		this.unseenMsgArr = null;
		this.chats = [];
		this.toSend = "";
		this.chatData = [];
		this.lastMsg = [];
		this.ids = [];
	}

	setChats = (chats) => {

        this.chats = chats;

		let newChats = [];
        chats.forEach((item, index) =>{
            newChats.push(item.user_id);
        });
		this.ids = newChats;
	};

	removeChat = (id) => {

	    let this_chats_id = null;
	    let this_ids_id = null;

	    for (let i = 0; i < this.chats.length; i++) {
            if (this.chats[i].user_id === id) {
                this_chats_id = i;
                break;
            }
        }

        for (let k = 0; k < this.ids.length; k++) {
            if (this.ids[k] === id) {
                this_ids_id = k;
                break;
            }
        }


        if (this_chats_id !== null) {
            this.chats.splice(this_chats_id, 1);
        }

        if (this_ids_id !== null) {
            this.ids.splice(this_ids_id, 1);
        }

		// const item = this.chats.find((el) => {
		// 	return el.user_id = id;
		// });

        // this.chats.splice(this.chats.indexOf(item), 1);
        // this.ids.splice(this.ids.indexOf(id), 1);
	};
	getChatUnseen = user_id => {
		let uns = 0;
		this.unseenMsgArr.forEach((item, index) => {
			if (item.sender_id === user_id)
				uns = item.num;
		});
		return uns;
	};
	setUnseenMsg = (unseen) => {
		this.unseenMsg = unseen;
	};

	setUnseenMsgArr = (arr) => {
		if (arr)
			this.unseenMsgArr = arr;
	};

	setAvatars = (avatars) => {
		this.chatAvatars = avatars;
	};

	setLastMsg = (last) => {
		this.lastMsg = last;
	};

	setActiveChatID = (id) => {
		this.activeChatID = id;
	};

	setChatData = (data) => {
		this.chatData = data;
	};

	updateChatData = (el) => {
		this.chatData.push(el);
	};

	getUsersId = () => {
		let ids = [];
		this.chats.forEach((item, chats) =>{
			ids.push(item.user_id);
		});
		return ids;
	};
}

export default ChatTabStore;