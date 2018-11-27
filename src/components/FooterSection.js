import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FooterSection extends Component {
    render() {
        return (
            <section className="footer">
                <div className="row">
                    <div className="technologies text-center col-4 pt-4 fc-white">
                        <div>
                            <a href="https://nodejs.org/uk/">
                                <i className="technology-icon pr-4 fab fa-node"></i>
                            </a>
                        </div>
                        <div>
                            <a href="https://reactjs.org/">
                                <i className="technology-icon fab fa-react"></i>
                            </a>
                        </div>

                    </div>
                    <div className="copyright text-center col-4 pt-4 fc-white">UNIT Factory &copy; 2018</div>
                    <div className="social-media text-center col-4 pt-4 fc-white">
                        <div className="pr-4">
                            <a href="https://www.instagram.com/unit_factory/">
                                <i className="social-media-icon fab fa-instagram"></i>
                            </a>
                        </div>
                        <div>
                            <a href="https://www.facebook.com/unit.factory/">
                                <i className="social-media-icon fab fa-facebook-square"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

FooterSection.propTypes = {};

export default FooterSection;
