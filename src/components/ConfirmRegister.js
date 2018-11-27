import React, {Component} from 'react';
import axios from 'axios'
import {confirmUser} from '../api'

class ConfirmRegister extends Component {


    componentDidMount() {
        this.confirm();
        setTimeout(() =>{
            window.location.assign('/');
        }, 3000);

    }

    confirm = () => {
        confirmUser(this.props.match.params);
    };
    // render() {
    //     return (
    //         <section className={"main"}>
    //             <div className="row" style={{justifyContent : "center"}}>
    //                 <div className="registration-block" style={{marginTop : "5%"}}>
    //                     <h1>Confirmed</h1>
    //                     <h3>Now you can sign in!</h3>
    //                 </div>
    //             </div>
    //         </section>
    //     );
    // }

    render() {
        return (
            <div className="logreg-form">
                <p className="fx-24 fw-bold pt-3 text-center">Matcha v.1.0</p>
                <p className="fx-18 fw-bold text-center">Registration form</p>
                <div className="logreg-form-success mb-3">
                    <span>You are successfully registered.</span>
                    <span>Now you can sign in.</span>
                </div>
                <a href="/" className="logreg-button-return">
                    <p className="fas fa-undo-alt"/>
                    <p className="fx-16 pl-2">Return</p>
                </a>
            </div>
        );
    }
}


export default ConfirmRegister;
