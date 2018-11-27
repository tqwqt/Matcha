import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SignUpBlock from './SignUpBlock'
import SignInBlock from './SignInBlock'

class LoginForm extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     cabinetClick: this.props.cabinetClick
        // }
    }
    getContent = () => {
        if (!this.props.cabinetClick)
        {
            return <SignUpBlock cabinetClick={this.props.cabinetClick}/>
        }
        return <SignInBlock cabinetClick={this.props.cabinetClick} />
    };
    handleSubmit =  event => {
         event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {this.getContent()}
            </form>
        );
    }
}

LoginForm.propTypes = {};

export default LoginForm;
