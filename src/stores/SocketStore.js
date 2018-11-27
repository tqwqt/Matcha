import {observable} from 'mobx';
import io from 'socket.io-client';
import iziToast from 'izitoast';

iziToast.settings({
    theme: 'dark',
	color: 'pink',
    position: 'topRight',
    progressBarColor: 'white',
    transitionIn: 'fadeInDown',
    transitionInMobile: 'fadeInDown',
    animateInside: false,
    drag: false
});

class SocketStore {

	@observable	socket = null;

	connection = (storeChatTab, userStore) => {
		const id = userStore.userID;
		this.socket = io('http://localhost:8088', {query: {id}});
		this.socket.on('getNewMsg', (data) => {

		    if (data.msgData.chat_id === storeChatTab.activeChatID)
				storeChatTab.updateChatData(data.msgData);
			if (storeChatTab.activeChatID !== data.msgData.chat_id)
			{
				this.alertNewMsg(data.msgData.text, data.msgData.sender_login);
                storeChatTab.setUnseenMsg(storeChatTab.unseenMsg + 1);
                storeChatTab.setUnseenMsgArr(data.unseenMsgArr);
            } else {
                this.socket.emit('updateUnseenMsg',{chat_id: storeChatTab.activeChatID, user_id: data.sender_id} );
			}

            this.socket.emit('setChats', userStore.userID);
		});

		this.socket.emit("setChats", userStore.userID);

		this.socket.on("chatAvatar", (data) => {
			storeChatTab.setAvatars(data);
		});

		this.socket.on('showChats', (chats) => {
            
			storeChatTab.setChats(chats.result);
			storeChatTab.setLastMsg(chats.lastMsg);
			this.socket.emit('join', storeChatTab.chats);
            this.socket.emit('initiateAvatarEvent', storeChatTab.ids);

		});

		this.socket.on('notification', (data) => {
			console.log('notif data:', data);
			if (userStore.activeTab !== 2) {
				userStore.setNotificationsArr(data.notifications);
            }
			else {
				userStore.setNotificationsArr(data.notifications);
                userStore.setUnseenNotifications(0);
			}

			if (data.type === 1 && data.isAlreadyVisited === false)
				this.alertCustom('New visit', data.login + ' visited your profile!' );
			else if (data.type === 2) {

                this.alertCustom('Like', data.login + ' likes you!');
                this.socket.emit("setChats", userStore.userID);
			}
			else if (data.type === 3)
			{
				this.alertCustom('Unlike', data.login + ' unliked you =(');
				storeChatTab.removeChat(data.id);
                storeChatTab.setUnseenMsg(storeChatTab.unseenMsg - storeChatTab.getChatUnseen(data.id));
                if (storeChatTab.chatData.length !== 0 && storeChatTab.activeChatID === storeChatTab.chatData[0].chat_id) {
                    storeChatTab.setActiveChatID(null);
                }
            }
			else if (data.type === 4)
			{
				this.alertCustom('Matched', data.login + ' now matched with you!');
                this.socket.emit("setChats", id);
                storeChatTab.setUnseenMsgArr(data.unseenMsgArr);
                storeChatTab.setUnseenMsg(storeChatTab.unseenMsg + storeChatTab.getChatUnseen(data.id));
            }
		});
	};

	alertNewMsg = (text, login) => {
        const toast = {
            title: login,
            message: "New message: " + text
        };
        iziToast.show(toast);
	};

    alertCustom = (title, text) => {
        const toast = {
            title: title,
            message: text
        };
        iziToast.show(toast);
    };

    on = (event, callback) => {
    	this.socket.on(event, (data)=> {
    		callback(data);
		});
	}
}
export default SocketStore;
