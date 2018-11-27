import React, {Component} from 'react';
import {observer} from 'mobx-react';
import ChatList from "./ChatList";
import Chat from './Chat';

@observer
class ChatTab extends Component {

    constructor(props) {
        super(props);
		this.state = {
			activeChatData: null
		}
    }

    componentDidMount() {
	}


	displayChat = () => {
		if (this.props.chatStore.activeChatID)
		{

			return <Chat  chat={this.state.activeChatData}
						  login={this.props.login} userID={this.props.userID}
						  chatID={this.props.chatStore.activeChatID} data={this.props.chatStore.chatData}
						  emit={this.props.emit} on={this.props.on} store={this.props.chatStore}
						  socketStore={this.props.socketStore}
            />;
		}
		return (
            <div className="col-12 col-lg nopadding">
				<div className="no-chat-chosen text-center">
					<span>No chat chosen</span>
				</div>
			</div>
		)
	};
	getChatData = (id) => {
		this.props.emit('getChatMsg', id);
		this.props.on('receiveChatMsg', (messages) => {
			this.props.chatStore.setChatData(messages);
			this.props.chatStore.setActiveChatID(id);
		});
	};
	setActiveChat = (id, chat) => {
		this.setState({activeChatData:chat}, () => {
            this.getChatData(id);
		});
	};
    render() {
    	let {chatStore} = this.props;
        return (
            <section className="chat row nopadding">

                <ChatList chatStore={chatStore} lastMsg={chatStore.lastMsg} ID={this.props.userID} chats={chatStore.chats} activeID={chatStore.activeChatID}
						  setActiveChat={this.setActiveChat} emit={this.props.emit} unseenMsg={this.props.unseenMsg} setMySeen={this.props.setMySeen}/>
	            {this.displayChat()}

            </section>
        );
    }
}

export default ChatTab;