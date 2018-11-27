import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm'

class MainSection extends Component {
    constructor(props) {
        super(props);

    }

    getCoordsByIp = () => {
        let coords = null;
        let xhttp = new XMLHttpRequest();

        xhttp.open("GET", 'https://ipapi.co/json', true);
        xhttp.setRequestHeader("Content-type", "application/json");

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {

                let response = JSON.parse(this.responseText);

                coords = { 'latitude' : response.latitude, 'longitude' : response.longitude};
                localStorage.setItem('coords', JSON.stringify(coords));
            }
            else
                coords = {'latitude' : 50.46843159, 'longitude' : 30.4518626};
        };
        xhttp.send();
    };

    componentDidMount()
    {
        let coords = null;
        // Навигатор поддерживается браузером?
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition((position) => {

                coords = {'latitude': position.coords.latitude, 'longitude' : position.coords.longitude};

                localStorage.setItem('coords', JSON.stringify(coords));

            }, (error) => {
                this.getCoordsByIp();
            });
        }
        else
            this.getCoordsByIp();
    }

    render() {
        return (
            <div className="logreg-form">
                <p className="fx-24 fw-bold pt-3 text-center">Matcha v.1.0</p>
                <LoginForm cabinetClick={this.props.cabinetClick}/>
            </div>
        );
    }
}

MainSection.propTypes = {};

export default MainSection;
