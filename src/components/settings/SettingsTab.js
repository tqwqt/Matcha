import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {setLogin, setPassword} from "../../api";
import {setEmail} from "../../api";

class SettingsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldpassword: '',
            password: '',
            repassword: '',
            email: '',
            login: '',
            errLogin: null,
            errEmail: null,
            errPassword: null,
            errCurrent: null,

        }
    }
    updateInput = (e) =>{

        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    };
    changeLogin = ()=> {

          setLogin({login:this.state.login, password: this.state.oldpassword}).then(resp => {
              if (resp.data.code !== 0 && resp.data.code !== 2){
                  this.setState({errLogin:resp.data.err});
              }else if (resp.data.code === 2){
                  this.setState({errCurrent: resp.data.err})
              }else if (resp.data.code === 0) {
                    this.props.socketStore.alertCustom('Changed', 'Success!');
                    localStorage.setItem('login', resp.data.login);
                    this.setState({errLogin: null, errCurrent:null});
              }
          }).catch(reason => {
          });
    };
    changeEmail = () => {
        setEmail({email:this.state.email, password: this.state.oldpassword}).then(resp => {
            if (resp.data.code !== 0 && resp.data.code !== 2){
                this.setState({errEmail:resp.data.err});
            }else if (resp.data.code === 2){
                this.setState({errCurrent: resp.data.err})
            }else if (resp.data.code === 0) {
                this.props.socketStore.alertCustom('Changed', 'Success!');
                this.setState({errEmail: null, errCurrent: null});
            }
        }).catch(reason => {
        });
    };
    changePassword = () => {
        setPassword({newPass: this.state.password, rep:this.state.repassword, old: this.state.oldpassword}).then(resp => {
            if (resp.data.code !== 0 && resp.data.code !== 2){
                this.setState({errPassword:resp.data.err});
            }else if (resp.data.code === 2){
                this.setState({errCurrent: resp.data.err})
            }else if (resp.data.code === 0) {
                this.props.socketStore.alertCustom('Changed', 'Success!');
                this.setState({errPassword: null, errCurrent: null});
            }
        }).catch(reason => {
        });
    };
    render() {
        return (
            <div className="row h-100 nopadding">
                <div className="settings-tab col-12 col-lg">
                    <div className="input-group input-password">
                        <div className="settings-title-attention row nopadding">
                            <div className="col-auto nopadding">
                                <i className="fx-30 fas fa-exclamation-circle"></i>
                            </div>
                            <div className="col nopadding">
                                <p className="fx-16">To change any information you must enter the current password</p>
                            </div>
                        </div>
                        {/*<p className="fx-18">To change any information you must enter current password!</p>*/}
                        <input className="input-current-password" type="password" placeholder="Enter current password" name="oldpassword" value={this.state.oldpassword} onChange={this.updateInput} />
                        <span className="input-error mb-3">{this.state.errCurrent}</span>
                        <p className="fx-18">Password</p>
                        <input type="password" placeholder="Enter new password" value={this.state.password} onChange={this.updateInput} name="password"/>
                        <input type="password" placeholder="Re-enter new password" value={this.state.repassword} onChange={this.updateInput} name="repassword"/>
                        <span className="input-error mb-3">{this.state.errPassword}</span>
                        <button className="settings-save-button" onClick={this.changePassword}>Change</button>
                    </div>
                    <div className="input-group">
                        <p className="fx-18">Email</p>
                        <input placeholder="Enter new email" value={this.state.email} onChange={this.updateInput} name="email"/>
                        <span className="input-error mb-3">{this.state.errEmail}</span>
                        <button className="settings-save-button" onClick={this.changeEmail}>Change</button>
                    </div>
                    <div className="input-group">
                        <p className="fx-18">Login</p>
                        <input placeholder="Enter new login" value={this.state.login} onChange={this.updateInput} name="login"/>
                        <span className="input-error mb-3">{this.state.errLogin}</span>
                        <button className="settings-save-button" onClick={this.changeLogin}>Change</button>
                    </div>
                </div>
            </div>
        );
    }
}

SettingsTab.propTypes = {};

export default SettingsTab;
