import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import {observer} from 'mobx-react';

@observer
class Message extends Component {

    render() {
        const {isSelfMsg} = this.props;
        const currentDate = dateFormat(Date.now(), 'mediumDate');
        const msgDate = dateFormat(new Date(this.props.msg.time), 'mediumDate');
        let seen = null;
        if (isSelfMsg)
            seen = this.props.msg.is_seen === 1? 'Seen' : 'Unseen';
        // return (
        //     <div className={isSelfMsg ? "row nopadding message-block message-elem-self" : "row nopadding message-block message-elem"}>
        //         <div className="col-12 nopadding">
        //             <span>{this.props.msg.text}</span>
        //         </div>
        //         <div className="col-6 text-left nopadding">
        //             <span className="fx-12">{dateFormat(new Date(this.props.msg.time), 'HH:MM')}</span>
        //         </div>
        //         <div className="col-6 text-right nopadding">
        //             <span className="fx-12">{currentDate === msgDate ? "Today" : msgDate}</span>
        //         </div>
        //     </div>
        // );

        return (
            <div className="message">
                <div className={isSelfMsg ? "message-block message-elem-self" : "message-block message-elem"}>
                    <p>{this.props.msg.text}</p>
                    <div className="display-inline-block">
                        <span className="fx-12">{dateFormat(new Date(this.props.msg.time), 'HH:MM')}</span>
                        <span className="fx-12 pl-5">{currentDate === msgDate ? "Today" : msgDate}</span>
                        <span className="fx-12 pl-5">{seen}</span>
                    </div>
                </div>
            </div>
        );
    }
}

Message.propTypes = {};

export default Message;
