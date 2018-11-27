import React, {Component} from 'react';
import dateFormat from 'dateformat';
import PropTypes from 'prop-types';
import {updateNotificationsSeen} from "../../api";

class NotificationTab extends Component {
    constructor(props) {
        super(props);

    }


    componentDidMount() {
        updateNotificationsSeen(this.props.userId).then(resp => {
            this.props.setSeen(0);
        }).catch(reason => console.error(reason));
    }

    componentDidUpdate(prevProps, prevState) {

    }

    displayEventName = (type) => {

        switch (type) {
            case "visited":
                return (
                    <p className="notification-text">Your profile has been visited</p>
                );
            case "like":
                return (
                    <p className="notification-text">You have been liked!</p>
                );
            case "matched":
                return (
                    <p className="notification-text">New match!</p>
                );
            case "unlike":
                return (
                    <p className="notification-text">You have been disliked</p>
                );
            default:
                return (
                    <p className="notification-text">{type}</p>
                );
        }
    };

    displayNotifications = () => {
        if (this.props.notifications) {
            const {notifications} = this.props;
            let list = notifications.map((item, index) => {
                const date = dateFormat(new Date(item.time), 'ddd mmm dd yyyy HH:MM');
               return (<div key={index} className="notification-item row nopadding text-center">
                           <div className="col-4 pt-2 pb-2">
                               {this.displayEventName(item.type)}
                           </div>
                           <div className="col-4 pt-2 pb-2">
                               <a href={"/cabinet/user/"+item.who_id} className="notification-text">{item.login}</a>
                           </div>
                           <div className="col-4 pt-2 pb-2">
                               <p className="notification-text">{date}</p>
                           </div>
                        </div>)
            });
            return list;
        } else {
            return <div>No notifications yet!</div>;
        }
    };
    render() {
        return (
            <div className="Notification-List">
                <div className="Notification-List-Column-Name row nopadding text-center">
                    <div className="col-4 pt-3">
                        <p className="notif-column-name-capital">event</p>
                    </div>
                    <div className="col-4 pt-3">
                        <p className="notif-column-name-capital">by whom</p>
                    </div>
                    <div className="col-4 pt-3">
                        <p className="notif-column-name-capital">time</p>
                    </div>
                </div>
                {this.displayNotifications()}

            </div>
        );
    }
}

export default NotificationTab;