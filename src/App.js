import React, { useState } from 'react';
import './App.css';
import AuthContext from './AuthContext';
import QueueContainer from './components/Queue/QueueContainer';
import UploadContainer from './components/Upload/UploadContainer';
import LoginManager from './components/Login/LoginManager';
import CreateAccountManager from './components/CreateAccount/CreateAccountManager';
import SidebarNavigation from './SidebarNavigation';
import PrivateRoute from './components/Routing/PrivateRoute';

import { HashRouter, Switch, Route } from 'react-router-dom';


function App() {
  const activeUser = 'admin';
  const sidebar = activeUser ? <SidebarNavigation /> : null;
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  return (
    <div className="App grid-container">
      <AuthContext.Provider value={{ authenticated: authenticated, token: null, setAuthenticated: setAuthenticated, setToken: setToken }}>
        <HashRouter>
          {sidebar}
          <Switch>
            <PrivateRoute exact path="/queue" component={QueueContainer} />
            <PrivateRoute exact path="/manageaccounts" component={CreateAccountManager} />
            <PrivateRoute exact path="/upload" component={UploadContainer} />
            <Route path="/login" component={LoginManager} />
            <PrivateRoute path='/account' component={CreateAccountManager} />
            <PrivateRoute path="/*" component={UploadContainer} />
          </Switch>
        </HashRouter>
      </AuthContext.Provider>

    </div>
  );
}

export default App;
