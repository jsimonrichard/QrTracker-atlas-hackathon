import './App.scss';
import React, { useState } from "react";
import { Route, Switch, Redirect, Router } from "wouter";
import * as Realm from 'realm-web';


import Welcome from './pages/welcome';
import Dashboard from './pages/dashboard';
import Page404 from './pages/page404';
import LogIn from './pages/login';
import SignUp from './pages/signup';
import ConfirmEmail from './pages/confirmEmail';
import { Header, Footer } from './components/pageTemplate';



function App() {
  const app = new Realm.App({ id: "qrtracker-yibtf" });

  return (
      <div className="App">
        <Switch>
          <Route path="/">
            {app.currentUser ? <Dashboard user={app.currentUser} /> : <Welcome />}
          </Route>

          <Route>
            <Header user={app.currentUser}/>

            <Switch>
              <Route path="/login">
                {app.currentUser ? <Redirect to="/home" /> : <LogIn app={app}/>}
              </Route>

              <Route path="/signup">
                {app.currentUser ? <Redirect to="/home" /> : <SignUp app={app} />}
              </Route>

              <Route path="/confirmEmail">
                <ConfirmEmail app={app}/>
              </Route>

              <Route path="/browse">

              </Route>

              <Router base="/home">
                <Switch>
                  <Route path="/">
                    
                  </Route>
                </Switch>
              </Router>

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
