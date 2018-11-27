import React, {Component} from 'react';
import PropTypes from 'prop-types';

class HeadRegistration extends Component {
    render() {
        return (
        <head>
            <meta charset="UTF-8"/>
                <title>Matcha Project</title>
                <!--<link rel="stylesheet" href="css/bootstrap.min.css">-->
                <link rel="stylesheet" href="/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="/css/custom.css"/>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous"/>
        </head>
        );
    }
}

HeadRegistration.propTypes = {};

export default HeadRegistration;
