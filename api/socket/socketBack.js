
import {getChatList} from "../chat/dbGetChatList";
import {getChatMsgs} from "../chat/getChatMsgs";
import {insertMessage} from "../chat/iinsertMessages";
import {getLastMsg} from "../chat/getLastMsg";
import {getChatAvatars} from "../chat/getChatAvatarts";
import {updateSeenMsg} from "../chat/updateSeenMsg";
import {updateOnline} from "../editProfile/updateOnline";
import {selectNotifications} from "../set/selectNotifications";
import {getUnseenMsgCount} from "../user_actions/getUnseenCount";

let io = null;
let connections = [];

exports.connect = http => {

	io = require('socket.io')(http, {
		pingInterval: 10000,
		pingTimeout: 5000,
	});

	io.sockets.on('connection', function (socket) {
		const id = socket.handshake.query.id;
		socket.user_id = id;
		socket.join(id);
		updateOnline(true, id);
		socket.emit('connect');
		socket.once('disconnect', () => {
			connections.splice(connections.indexOf(socket),1);
			socket.disconnect();
			updateOnline(false, id);
		});

		socket.on('setChats', (id) => {
			getChatList(id).then((result) => {
                getLastMsg(id).then((lastMsg) => {
                    socket.emit('showChats', {result, lastMsg});
                }).catch((error) => {
                });
			}).catch((error) => {
			});

		});

		socket.on("initiateAvatarEvent", (ids) => {
				getChatAvatars(ids).then((result) => {
                    socket.emit("chatAvatar",result);
				}).catch((error) => {
				});
		});

		socket.on('getChatMsg', (chatID)=>{
			getChatMsgs(chatID).then((result) => {
					socket.emit('receiveChatMsg', result);
				}).catch((error) => {
			});

		});

		socket.on('updateUnseenMsg',(data) => {
			updateSeenMsg(data.chat_id, data.user_id).then((seenMsgs)=>{
				socket.to(data.user_id).emit('afterUpdateSeenMsg',{seenMsgs, chat_id:data.chat_id} );
			}).catch( reason => console.log(reason));
		});

		socket.on('sendMessage', (msgData) => {
                insertMessage(msgData).then((res) => {
					getUnseenMsgCount(msgData.receiver_id).then(result => {
                        socket.to('room' + msgData.chat_id).emit('getNewMsg', {msgData, unseenMsgArr: result});
					}).catch( reason => null);
                }).catch(reason => console.error(reason));
		});

		socket.on('join', (chat_ids)=> {
			chat_ids.forEach((item)=> {
				socket.join('room'+item.id);
			});
		});
		connections.push(socket);
	});
};

exports.notify = (user, event, data) => {
	selectNotifications(user).then((notifications)=>{
		data.notifications = notifications;
        io.to(user).emit(event, data);
	});
};