import React, {Component} from 'react';
import Router from 'react-router-dom'
class Whooops404 extends Component {
	render() {
		return (
			<div id="not-found">
				<h1>Whooops...</h1>
				<p>We cannot find the page that you have requested.</p>
				{/*<Link to="/">Sign in</Link>*/}
				{/*<Link to="/cabinet">Profile</Link>*/}
			</div>
		);
	}
}

Whooops404.propTypes = {};

export default Whooops404;
