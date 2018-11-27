import React, {Component} from 'react';
import RegisterErrors from '../RegisterErrors'
import {restoreChange} from "../../api";


class RestorePass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pass: '',
            repass: '',
            success: false,
            errors: null
        }
    }

    updateInput = (e) =>{
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    };
    change = (e) => {
        e.preventDefault();
        restoreChange({pass: this.state.pass, repass: this.state.repass, params: this.props.match.params})
            .then( resp => {
                if (resp.status === 200 && !resp.data)
                {
                    this.setState({errors: null}, () => {
                        this.setState({success: true});
                    });
                    setTimeout(() =>{
                        window.location.assign('/');
                    }, 1000);
                } else if (resp.data) {
                    if (!Array.isArray(resp.data)) {
                        let errors = resp.data;
                        this.setState({errors: [resp.data]});
                    }

                }

            }).catch(reason => {
        });
    };

    successOnRestore = () => {

        if (this.state.success === true)
        {
            return (
                <div className="logreg-form-success mb-3">
                    <span>You successfully changed your password</span>
                </div>
            )
        }

    };

    failOnRestore = () => {

        if (this.state.errors !== null)
        {
            return (
                <RegisterErrors errors={this.state.errors}/>
            )
        }
    };

    render() {
        return (
            <div className="logreg-form">
                <p className="fx-24 fw-bold pt-3 text-center">Matcha v.1.0</p>
                { this.successOnRestore() }
                { this.failOnRestore() }
                <input className="logreg-input mt-2" type="password" placeholder="New password" autoComplete="off" value={this.state.pass} onChange={this.updateInput} name={"pass"}/>
                <input className="logreg-input mt-2" type="password" placeholder="Repeat password" autoComplete="off" value={this.state.repass} onChange={this.updateInput} name={"repass"}/>

                <label htmlFor="restore-password" className="logreg-button-restore-password">
                    <p className="fas fa-check"/>
                    <p className="fx-16 pl-2">Change password</p>
                    <input id="restore-password" type="submit" value="Change password" onClick={this.change}/>
                </label>
            </div>
        );
    }

}

export default RestorePass;
