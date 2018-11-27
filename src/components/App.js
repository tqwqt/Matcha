import React from 'react';
import HeaderBar from './HeaderBar'
import {BrowserRouter as Router}  from 'react-router-dom';
import { Route , Switch} from "react-router-dom";
import MainSection from './MainSection'
import ConfirmRegister from './ConfirmRegister'
import RestorePass from './settings/RestorePass'
import Cabinet from './Cabinet'
import AnotherUser from './profile/AnotherUserProfile'
import Chat from './chat/ChatTab'
import NotFoundPage from './Whooops404'
import FooterSection from './FooterSection'
// import './profile/react-tag-input.css';
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cabinetClick: false,
        }

    }
    updateCabinetClick = (value) =>{
        this.setState({
            cabinetClick: value
        })
    };
    logout = ()=>{
      localStorage.removeItem("userToken");
    };

    render() {
        return (
            <div className="App">
                <Router>
                    <React.Fragment>
                        <Switch>
                            <Route exact path="/"
                                   render={(props) => <MainSection {...props} cabinetClick={this.state.cabinetClick}/>} />
                            <Route path="/confirm/:login/:token" component={ConfirmRegister}/>
                            <Route path="/restoreData/:email/:token" component={RestorePass}/>
                            <Route path="/cabinet/profile"
                                   render={(props) => <Cabinet {...props} choice={0}/>} />
                            <Route path="/cabinet/chat"
                                   render={(props) => <Cabinet {...props} choice={1}/>} />
                            <Route path="/cabinet/notifications"
                                   render={(props) => <Cabinet {...props} choice={2}/>} />
                            <Route path="/cabinet/search"
                                   render={(props) => <Cabinet {...props} choice={3}/>} />
                            <Route path="/cabinet/settings"
                                   render={(props) => <Cabinet {...props} choice={5}/>} />
                            <Route path="/cabinet/user/:id"
                                   render={(props) => <Cabinet {...props} choice={6}/>} />
                            {/*<Route path="*" component={NotFoundPage}/>*/}
                        </Switch>
                    </React.Fragment>
                </Router>
                <Router>
                    <React.Fragment>
                        <Route exact path="/" render={() => {
                            return (
                                <div id="particles-js"></div>
                            )
                        }}/>
                    </React.Fragment>
                </Router>
            </div>
        );
    }
}

export default App;