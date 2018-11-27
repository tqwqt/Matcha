import React, {Component} from 'react';


class ProfileMin extends Component {

    displayNoAvatar = () => {
        return (
            <i className="search-noavatar fas fa-user"/>
        )
    };

    displayAvatar = (source) => {
        return (
            <img className="search-avatar" src={source}/>
        )
    };
    profileClick = () => {
        window.location.assign(`/cabinet/user/${this.props.data.id}`);
    };


    displayRateBar = (rate) => {
        return (
            <div className="rate-bar">
                <p>rate</p>
                <p>{rate + "%"}</p>
            </div>
        )
    };

    render() {
        const {data} = this.props;
        const status = data.is_online ? 'online' : data.last_seen;
        return (
            <div className="search-person-item row nopadding">
                <div className="col-12 col-xl-3 text-center">
                    { data.url === null ? this.displayNoAvatar() : this.displayAvatar(data.url)}
                </div>
                <div className="col-xl-auto col-12 search-person-info">
                    <p className="search-list-name fx-14 fc-darkgray">{data.login} {status}</p>
                    <p className="search-list-age fx-14 fc-darkgray">{data.age} years</p>
                    {this.displayRateBar(data.rate)}
                    <div className="search-item-button text-center" onClick={this.profileClick}>
                        <a href={"/cabinet/user/"+this.props.data.id}>
                            <p className="fas fa-address-card fx-16"></p>
                            <p className="profile-min-buttons-name fx-14" >Profile</p>
                        </a>
                    </div>
                </div>
                <div className="col-xl col-12 text-right">
                    <p className="search-list-distance fx-14 fc-darkgray">{data.DISTANCE.toFixed(1)} km away</p>
                </div>
            </div>
        );
    }
}

ProfileMin.propTypes = {};

export default ProfileMin;
