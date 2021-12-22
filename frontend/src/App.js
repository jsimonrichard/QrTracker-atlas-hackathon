import './App.scss';
import React, { useState } from "react";
import { Route, Switch, Link } from "wouter";
import * as Realm from 'realm-web';

import smallLogoPng from './logo-small.png';

import { Welcome } from './pages/welcome';
import { Dashboard } from './pages/dashboard';
import { Page404 } from './pages/page404';
import { ButtonLink } from './components/basic';


function Header({ user }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <header className={expanded ? "nav-expanded" : ""}>
      <div className='mobile-header-wrapper'>
        <Link href="/">
          <div className='logo-wrapper'>
            <img className='logo-small' src={smallLogoPng} alt="QrTracker"/>
          </div>
        </Link>

        <div className='mobile-header-spacer' />

        <div class="mobile-btn" onClick={()=>setExpanded(!expanded)}>
          Menu
        </div>
      </div>

      <div className='desktop-header-spacer' />

      {user ? <UserNav user={user} /> : <PubNav />}

    </header>
  );
}

function UserNav({ user }) {
  return (
    <div className='nav-links'>
      <div className='nav-link'>
        <ButtonLink path="/create" color="brand1" slim={true}>Create a Tracker</ButtonLink>
      </div>

      <div className='nav-link'>
        <Link href=''>Browse</Link>
      </div>

      <div className='nav-link'>
        <Link>Log Out</Link>
      </div>
    </div>
  );
}

function PubNav() {
  return (
    <div className="nav-links">
      <Link href='/log-in'>
        <div className='nav-link'>
          Log In
        </div>
      </Link>
    </div>
  );
}

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
              <Route>

                <Page404 />
              </Route>
            </Switch>
          </Route>
        </Switch>
      </div>
  );
}

export default App;
