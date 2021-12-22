import './App.scss';
import React, { useState } from "react";
import { Route, Switch, Redirect } from "wouter";
import * as Realm from 'realm-web';


import Welcome from './pages/welcome';
import Dashboard from './pages/dashboard';
import Page404 from './pages/page404';
import Login from './pages/login';
import SignUp from './pages/signup';
import { Header, Footer } from './components/pageTemplate';



function App() {
  const app = new Realm.App({ id: "qrtracker-yibtf" });

  const [user, setUser] = useState(app.currentUser);

  return (
      <div className="App">
        <Switch>
          <Route path="/">
            {user ? <Dashboard user={user} setUser={setUser}/> : <Welcome setUser={setUser}/>}
          </Route>

          <Route>
            <Header user={user}/>

            <Switch>
              <Route path="/login">
                {user ? <Redirect to="/" /> : <Login />}
              </Route>

              <Route path="/signup">
                {user ? <Redirect to="/" /> : <SignUp />}
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
