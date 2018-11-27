import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {postUpdateName} from "../../api";

class UserInfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameClick: false,
            nameVal: ""
        }
    }

    editNameClick = (e) =>{
        e.preventDefault();
        this.setState({nameClick: !this.state.nameClick});
    };
    setNewName = (e) => {
        e.preventDefault();
        postUpdateName(this.state.nameVal).then(resp => {

        }).catch(reason => {
        });
        this.setState({nameClick: false});
    };
    updateInput = (e) =>{

        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    };
    nameDisplay = () => {
        if (this.state.nameClick !== false)
        {
            return (
                <div>Name:
                    <input type="text" placeholder={this.props.data.name} value={this.state.nameVal} onChange={this.updateInput} name="nameVal"/>
                    <div onClick={this.setNewName}>OK</div>
                    <div onClick={this.editNameClick}>Cancel</div>
                </div>);
        }else {
            return <p onClick={this.editNameClick}>Name: {this.props.data.name}</p>
        }
    };
    render() {

        return (
            <div className="info">
                {this.nameDisplay()}
                <p>Last name: {this.props.data.lastName}</p>
                <p>Nickname: {this.props.data.nickname}</p>
                <p>Age: {this.props.data.age}</p>
                <p>Gender: {this.props.data.gender}</p>
                <p>Orientation: {this.props.data.orientation}</p>
            </div>
        );
    }
}

UserInfoEdit.propTypes = {};

export default UserInfoEdit;
