import React, {Component} from 'react';
import PropTypes from 'prop-types';

class RegisterErrors extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {errors} = this.props;
        return (
            <div className="logreg-form-errors-container mb-3">
                {
                    errors.map((error, index) =>

                        <span key={index}>
                            {error.toString()}
                        </span>
                    )
                }
            </div>
        );
    }
}

RegisterErrors.propTypes = {};

export default RegisterErrors;
