import React, {Component} from 'react';
import PropTypes from 'prop-types';

class HeaderBar extends Component {
    constructor(props) {
        super(props);
        // this.handleCabinetClick = this.handleCabinetClick.bind(this);
    }
    componentDidMount() {

    }

    handleCabinetClick = (e) => {
            e.preventDefault();
            this.props.updateCabinetClick(!this.props.buttonDesc);
    };

    renderButtonDesc = () => {
        if (this.props.buttonDesc === false) {
            return ('Log in');
        }
        else {
            return ('Register');
        }
    };

    render() {
        return (
            <section className="header">
                <div className="row pt-3 pb-2">
                    <i id="logotype-heart" className="fas fa-heart"></i>
                        <div className="logotype col-3">
                            <a href="/">
                                <h2 className="fw-bold">Matcha Project</h2>
                                <p>— It is like in real life, but better</p>
                            </a>
                        </div>
                    <div className="entrance col-9">
                        <button className="mt-3" onClick={this.handleCabinetClick}>{ this.renderButtonDesc() }</button>
                    </div>
                </div>
            </section>
        );
    }
}

HeaderBar.propTypes = {};

export default HeaderBar;
