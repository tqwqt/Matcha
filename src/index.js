import React from 'react'
import ReactDOM from 'react-dom'
// import Router from 'react-router-dom'
// const Route = Router.Route;
// const DefaultRoute = Router.DefaultRoute;
import App from './components/App'
import MainSection from "./components/MainSection";
// import data from './testData'
//
// let routes =(
// 	<Route handler={App}>
// 		<DefaultRoute handler={MainSection}/>
// 	</Route>
// );
     ReactDOM.render(
         <App name={"Vlad"}/>, document.getElementById('root')
     );