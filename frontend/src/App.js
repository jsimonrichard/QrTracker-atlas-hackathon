import './App.scss';
import React, { useContext, useState } from "react";
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
import { AppContext } from '.';
import ViewTracker from './pages/tracker/viewTracker';
import EditTracker from './pages/tracker/editTracker';
import AcceptInvitation from './pages/user/acceptInvitation';
import Search from './pages/search';

export default function App() {
  const app = useContext(AppContext);
  // For updating on log in/out
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
              {user ? <Redirect to="/dashboard" /> : <LogIn setUser={setUser}/>}
            </Route>

            <Route path="/signup">
              {user ? <Redirect to="/dashboard" /> : <SignUp />}
            </Route>

            <Route path="/confirmEmail">
              <ConfirmEmail />
            </Route>

            <Route path="/resetPassword">
              <ResetPassword />
            </Route>

            <Route path="/handlePasswordReset">
              <HandlePasswordReset />
            </Route>

            <Route path="/browse">
              <Browse />
            </Route>

            <Route path="/search">
              <Search />
            </Route>

            <Route path="/dashboard">
              {user ? <Dashboard user={user} /> : <Redirect to="/login" />}
            </Route>

            <Route path="/create">
              {user ? <CreateTracker user={user} /> : <Redirect to="/login" />}
            </Route>

            <Route path="/acceptInvitation">
              <AcceptInvitation user={user}/>
            </Route>

            <Route path="/t/:trackerId/edit">
              {params => <EditTracker trackerId={params.trackerId}/>}
            </Route>

            <Route path="/t/:trackerId">
              {params => <ViewTracker trackerId={params.trackerId} />}
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