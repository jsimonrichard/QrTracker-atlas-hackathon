import './App.scss';
import React, { useState } from "react";
import { Route, Switch, Redirect, Router } from "wouter";
import * as Realm from 'realm-web';


import { Header, Footer } from './components/pageTemplate';

import Welcome from './pages/welcome';
import Page404 from './pages/page404';
import LogIn from './pages/login';
import SignUp from './pages/signup';
import Browse from './pages/browse';
import ConfirmEmail from './pages/confirmEmail';
import ResetPassword from './pages/resetPassword';
import HandlePasswordReset from './pages/handlePasswordReset';

import Dashboard from './pages/user/dashboard';
import CreateTracker from './pages/user/create';


function App() {
  const app = new Realm.App({ id: "qrtracker-yibtf" });
  const [user, setUser] = useState(app.currentUser);

  return (
      <div className="App">
        <Switch>
          <Route path="/">
            {user ? <Redirect to="/dashboard"/> : <Welcome />}
          </Route>

          <Route>
            <Header user={user} setUser={setUser}/>

            <Switch>
              <Route path="/login">
                {user ? <Redirect to="/dashboard" /> : <LogIn app={app} setUser={setUser}/>}
              </Route>

              <Route path="/signup">
                {user ? <Redirect to="/dashboard" /> : <SignUp app={app} />}
              </Route>

              <Route path="/confirmEmail">
                <ConfirmEmail app={app}/>
              </Route>

              <Route path="/resetPassword">
                <ResetPassword app={app} />
              </Route>

              <Route path="/handlePasswordReset">
                <HandlePasswordReset app={app} />
              </Route>

              <Route path="/browse">
                <Browse app={app} />
              </Route>

              <Route path="/dashboard">
                {user ? <Dashboard app={app} user={user} /> : <Redirect to="/login" />}
              </Route>

              <Route path="/create">
                {user ? <CreateTracker app={app} user={user} /> : <Redirect to="/login" />}
              </Route>

              <Route>
                <Page404 />
              </Route>
            </Switch>

            <Footer />
          </Route>
        </Switch>
      </div>
  );
}

export default App;
