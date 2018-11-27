import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import Message from './Message';
import TextareaAutosize from 'react-autosize-textarea';

@observer
class Chat extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            msg: "",
            spam: 0,
        }
    }

    componentDidMount() {
        // this.props.socket.emit('join', this.props.chatID);
        this.props.emit('updateUnseenMsg',{chat_id: this.props.chatID, user_id: this.props.chat.user_id} );
        this.scrollDown();
    }
    componentDidUpdate(prevProps, prevState) {
        this.scrollDown();
        this.props.emit('updateUnseenMsg',{chat_id: this.props.chatID, user_id: this.props.chat.user_id} );
    }
    updateInput = (e) => {

        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    };
    scrollDown = () => {
        const ref = this._divEl;
        ref.scrollTop = ref.scrollHeight;
    };
    getChatRef = (node) => {this._divEl = node};
    sendMessage = (e) => {
        if (e)
            e.preventDefault();
        if (this.state.msg) {

            const time = new Date(Date.now());
            const update = {
                chat_id: this.props.chatID,
                text : this.state.msg,
                sender_id: this.props.userID,
                time,
                sender_login: this.props.login,
                receiver_id: this.props.chat.user_id,
            };
            this.props.store.updateChatData(update);
            this.props.emit("sendMessage", update);
            this.props.emit('setChats', this.props.userID);
            this.setState({spam: this.state.spam + 1, msg: ""});
        }
    };
    displayMessages = () => {
        const messages = this.props.data.map((msg, index) => {
            let key = msg.id ? "msg" + msg.id : "msg"+index+"new";
            return <Message key={key.toString()} msg={msg} isSelfMsg={this.props.userID === msg.sender_id}/>
        });
        return messages;
    };
    onEnterPressed = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.sendMessage(null);
        }
    };
    render() {

        return (
            <div className="chat-box col-12 col-lg nopadding">
                <div className="textmessages-area" ref={this.getChatRef}>
                    {this.displayMessages()}
                </div>
                <div className="textarea-holder">
                    <TextareaAutosize className="chat-input"
                                      innerRef={ref => this.textarea = ref}
                                      onKeyDown={this.onEnterPressed}
                                      value={this.state.msg}
                                      onChange={this.updateInput}
                                      name={"msg"}
                                      rows={3}
                                      maxLength={9999}
                                      maxRows={3}
                                      type="text"
                                      placeholder="type something..."
                                      autoComplete="off"/>
                </div>
                <i className="input-icon-arrow fas fa-arrow-circle-right" onClick={this.sendMessage}></i>
            </div>
        );
    }
}

Chat.propTypes = {};

export default Chat;