import React, {Component} from 'react';
import RegisterErrors from './RegisterErrors'
import SignInBlock from './SignInBlock';
import * as api from '../api'
import PropTypes from 'prop-types';

class SignUpBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cabinetClick: this.props.cabinetClick,
            loginVal:'',
            emailVal:'',
            passwordVal:'',
            passwordRepeatVal:'',
            nameVal:'',
            lastNameVal:'',
            errors: false,
            success: false,
            emptyFields: false,

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
        if (this.state.success === true)
        {
            return (
                <div className="logreg-form-success mb-3">
                    <span>Registration success.</span>
                    <span>Now check your email for verification process</span>
                </div>
            )
        }
    };
    register = () => {

        this.setState({emptyFields: false}, () => {
            this.setState({errors: false}, () => {
                if (this.state.nameVal.length !== 0 && this.state.lastNameVal.length !== 0 && this.state.loginVal.length !== 0 && this.state.passwordVal.length !== 0 && this.state.passwordRepeatVal.length !== 0 && this.state.emailVal.length !== 0) {

                    this.setState({errors: false, success: false}, () => {

                        const data = {
                            password:this.state.passwordVal,
                            passwordRepeat: this.state.passwordRepeatVal,
                            login: this.state.loginVal,
                            email: this.state.emailVal,
                            name: this.state.nameVal,
                            lastName: this.state.lastNameVal
                        };
                        api.sendRegisterData(data).then(respData => {
                            if (respData !== true) {
                                this.setState({errors: respData});
                            } else {
                                this.setState({errors: false, success: true});
                            }
                        });
                    });
                }
                else {
                    this.setState({ emptyFields: true });
                }
            })
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

    renderFormContent = () => {
      if (this.state.cabinetClick === false) {
          return (
              <div>
                  <p className="fx-18 fw-bold text-center">Registration form</p>
                  {this.showErrors()}
                  <input className="logreg-input" type="text" placeholder="Firstname" autoComplete="off" maxLength="30" value={this.state.nameVal} onChange={this.updateInput} name={"nameVal"}/>
                  <input className="logreg-input mt-1" type="text" placeholder="Surname" autoComplete="off" maxLength="30" value={this.state.lastNameVal} onChange={this.updateInput} name={"lastNameVal"}/>
                  <input className="logreg-input mt-4" type="text" placeholder="Login" autoComplete="off" value={this.state.loginVal} onChange={this.updateInput} name={"loginVal"}/>
                  <input className="logreg-input mt-1" type="password" placeholder="Password" autoComplete="off" value={this.state.passwordVal} onChange={this.updateInput} name={"passwordVal"}/>
                  <input className="logreg-input mt-1" type="password" placeholder="Confirm password" autoComplete="off" value={this.state.passwordRepeatVal} onChange={this.updateInput} name={"passwordRepeatVal"}/>
                  <input className="logreg-input mt-1" type="text" placeholder="Email address" autoComplete="off" maxLength="40" value={this.state.emailVal} onChange={this.updateInput} name={"emailVal"}/>
                  {this.emptyFields()}
                  <div className="text-center">
                      <div className="logreg-button-signin-yellow" onClick={() => this.setState({cabinetClick : true})}>
                          <p className="fas fa-user"/>
                          <p className="fx-16 pl-2">Sign in</p>
                      </div>
                      <label htmlFor="register-submit" className="logreg-button-register-me-blue">
                          <p className="fas fa-chevron-circle-right"/>
                          <p className="fx-16 pl-2">Register</p>
                          <input id="register-submit" className="pt-1 pb-1 mt-3" type="submit" value="Find your love" onClick={this.register}/>
                      </label>
                  </div>
              </div>
          );
      }
      else {
            return (
                <SignInBlock cabinetClick={this.state.cabinetClick}/>
            );
      }
    };

    render() {
        return this.renderFormContent();
    }
}

SignUpBlock.propTypes = {};

export default SignUpBlock;
