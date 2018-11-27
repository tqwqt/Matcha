import React, {Component} from 'react';
import RegisterErrors from './RegisterErrors'
import * as api from '../api'
import PropTypes from 'prop-types';
import {restorePassword} from "../api";
import SignUpBlock from "./SignUpBlock";

class SignInBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cabinetClick: this.props.cabinetClick,
            loginVal: '',
            passwordVal: '',
            errors: false,
            restoreClick: false,
            emailVal: '',
            emptyFields: false,
            success: false,
            errorsOnSend: false,
        }
    }
    updateInput = (e) =>{

        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    };
    showErrors = () => {
        if (this.state.errors !== false)
        {
            return (<RegisterErrors errors={this.state.errors}/>)
        }
    };

    getPositionSuccess = (position) => {
    };
    getPositionError = (error) => {
    };
    signIn = (e) => {
        if (this.state.loginVal.length !== 0 && this.state.passwordVal.length !== 0) {
            this.setState({errors: false}, () => {

                const data = {
                    login : this.state.loginVal,
                    password : this.state.passwordVal
                };

                api.sendSignInData(data).then(respData => {
                    if (respData.data.token !== undefined)
                    {
                        localStorage.setItem('userToken', respData.data.token);
                        localStorage.setItem('login', respData.data.login);
                        this.setState({errors: false});

                        window.location.assign('/cabinet/profile');

                    }
                    else if (respData.data.token === undefined) {
                        this.setState({errors: respData.data});
                    } else {
                        this.setState({errors: false});
                    }
                });
            });
        }
        else {
            this.setState({ emptyFields: true});
        }
    };

    forgotPasswordClick = (e)=> {
        e.preventDefault();
        this.setState({restoreClick: true});
    };

    sendRestore = (e) => {

        e.preventDefault();
        restorePassword({email:this.state.emailVal}).then(resp => {
            if (resp.data === true)
                this.setState({success:true});
            else
                this.setState({errorsOnSend: resp.data});
        });
    };

    emptyFields = () => {
        if (this.state.emptyFields === true) {
            return (
                <div className="logreg-form-errors-container mt-2 mb-3">
                    <span>There are empty fields</span>
                </div>
            )
        }
    };

    renderFormBlock = () => {
      if (this.state.cabinetClick === true) {
          return (
              <div>
                  <p className="fx-18 fw-bold text-center">Login form</p>
                  {this.showErrors()}
                  <input className="logreg-input mt-2" type="text" placeholder="Login" autoComplete="off" value={this.state.loginVal} onChange={this.updateInput} name={"loginVal"}/>
                  <input className="logreg-input mt-1" type="password" placeholder="Password" autoComplete="off" value={this.state.passwordVal} onChange={this.updateInput} name={"passwordVal"}/>
                  {this.emptyFields()}
                  <div className="text-center">
                      <div className="logreg-button-register-me-yellow" onClick={() => this.setState({cabinetClick : false})}>
                          <p className="far fa-address-card"/>
                          <p className="fx-16 pl-2">Register</p>
                      </div>
                      <label htmlFor="signin-submit" className="logreg-button-signin-blue">
                          <p className="fas fa-sign-in-alt"/>
                          <p className="fx-16 pl-2">Sign in</p>
                          <input id="signin-submit" className="pt-1 pb-1 mt-3" type="submit" value="Find your love" onClick={this.signIn}/>
                      </label>
                  </div>
                  <div className="row justify-content-center">
                      <div className="logreg-button-forgot" onClick={this.forgotPasswordClick}>
                          <p className="fas fa-angry"/>
                          <p className="fx-16 pl-2">I forgot password</p>
                      </div>
                  </div>
              </div>
          );
      }
      else {
          return <SignUpBlock cabinetClick={this.state.cabinetClick}/>
      }
    };
    successSent = () => {
        if (this.state.success === true)
        {return (
            <div className="logreg-form-success mb-3">
                <span>Success.</span>
                <span>Now check your email for restore process</span>
            </div>
        )
        }else if (this.state.errorsOnSend !== false)
        {
            return ( <div className="logreg-form-errors-container mb-3">
                <span>{this.state.errorsOnSend}</span>
            </div>);
        }
    };
    display = () => {
        if (this.state.restoreClick === false) {
            return this.renderFormBlock();
        }
        else {

            return (
                <div>
                    <p className="fx-18 fw-bold text-center">Restore</p>
                    {this.showErrors()}
                    {this.successSent()}
                    <input className="logreg-input" type="email" placeholder="Email" autoComplete="off" value={this.state.emailVal} onChange={this.updateInput} name={"emailVal"}/>
                    <label htmlFor="restore-submit" className="logreg-button-recovery">
                        <p className="fas fa-key"/>
                        <p className="fx-16 pl-2">Send</p>
                        <input id="restore-submit" type={"submit"} onClick={this.sendRestore} value={"Send"}/>
                    </label>
                    <div className="logreg-button-return" onClick={() => this.setState({restoreClick : false})}>
                        <p className="fas fa-undo-alt"/>
                        <p className="fx-16 pl-2">Return</p>
                    </div>
                </div>
            );
        }
    };
    render() {
        return (
            <div>
                {this.display()}
            </div>
        )
    }
}

SignInBlock.propTypes = {};

export default SignInBlock;
