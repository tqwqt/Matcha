import React, {Component} from 'react';
import dateFormat from 'dateformat'
import PropTypes from 'prop-types';
import {observer} from 'mobx-react'

@observer
class ChatList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chats: []
        }
    }

    chatClick = (id) => {
    	const {chats} = this.props;
    	const chat = chats.find((el) => {
    		return el.id === id;
		});
        this.props.setActiveChat(id, chat);
        this.props.setMySeen(id);
    };

	lastMsgDisplay = (chatId, lastArray) => {
		let last = {
			text: "No messages",
			time: ""
		};
		const element = lastArray.find((el) => {return chatId === el.id});
		if (element === undefined)
			return last;
		last.text = element.text;
		if (parseInt(element.text.length) > 9)
			last.text = last.text.substring(0, 10).trim() + "...";
		last.time = dateFormat(new Date(element.time), 'mediumDate');
       	return last;
	};

    displayNoAvatar = (id) => {
        return (
			<a href={"/cabinet/user/" + id}>
				<i className="noavatar fas fa-user"/>
			</a>
        )
    };

    displayAvatar = (source, id) => {
        return (
			<a href={"/cabinet/user/" + id}>
				<img className="chatavatar" src={source}/>
			</a>
        )
    };

	renderUnseenCount = (chat) => {
        const unseenMsg = this.props.chatStore.unseenMsgArr;
        const unseen = unseenMsg.find((el)=> {
            return el.chat_id === chat.id;
        });

        if (unseen !== undefined && (unseen.num > 0 && unseen.num <= 99)) {
            return (
				<div className="msg-notread-number">{ unseen.num }</div>
            );
        }
        else if (unseen !== undefined && (unseen.num > 99)) {
            return (
				<div className="msg-notread-number">99+</div>
            )
        }
        else {
            return null;
        }

	};
    displayList = () => {

        const {lastMsg} = this.props;
        const {chatStore} = this.props;
        const avatars = chatStore.chatAvatars;
        if (avatars) {
            const list = this.props.chats.map((chat) => {
                const last = this.lastMsgDisplay(chat.id, lastMsg);
                const ava = avatars.find((el) => {
                    return el.user_id === chat.user_id;
                });
                return (
					<div key={chat.id} className={chat.id === this.props.activeID ? "friends-item-active friends-item row" : "friends-item row"} onClick={() => {
                        this.chatClick(chat.id)
                    }}>
							<div className="col-4 friends-item-col text-center">
                                {  ava === undefined || ava.url === null ? this.displayNoAvatar(chat.user_id) : this.displayAvatar(ava.url, chat.user_id)}
							</div>
							<div className="col-4 friends-item-col">
								<p className="fx-16 nopadding">{chat.login}</p>
								<p className="fx-12 nopadding">{last.text}</p>
							</div>

							<div className="col-auto friends-item-col">
                                { this.renderUnseenCount(chat) }
							</div>
							<div className="col friends-item-col">
								<p className="fx-12 no-padding">{last.time}</p>
							</div>
					</div>
                )
            });
            return list;
        }
        return null;
    };

    render() {

        return (
			<div className="friends-bar col-12 col-lg-auto">
                {this.displayList()}
			</div>
        );
    }
}

ChatList.propTypes = {};

export default ChatList;
