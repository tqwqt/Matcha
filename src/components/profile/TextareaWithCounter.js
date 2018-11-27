import React, {Component} from 'react';

class TextareaWithCounter extends Component
{
    constructor(props) {

        // после вызова super можно получить все свойства
        // с помощью this.props.prop_name
        super(props);
        this.maxlength = this.props.maxlength;

        this.state = {
            available: this.maxlength - (this.props.text !== null ? (this.props.text).length : 0),
            text: this.props.text !== null ? this.props.text : ""
        };
    }
    checkRemained = (e) => {
        const textarea = e.target;

        this.setState({
            available : this.maxlength - textarea.value.length,
            text : textarea.value
        }, () => {
            this.props.updateBiography(this.state.text);
        });


    };

    render () {
        return (
            <div className="textarea-with-counter">
                <textarea className={this.props.CustomClass} maxLength={this.props.maxlength} placeholder={this.props.placeholder} onChange={this.checkRemained} value={this.state.text}/>
                <span className={this.props.CounterClass}>{"Available characters remained: " + this.state.available }</span>
            </div>
        )
    }
}

TextareaWithCounter.propTypes = {};

export default TextareaWithCounter;