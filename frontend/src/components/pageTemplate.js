import React, { useState } from 'react';
import { ButtonLink } from './basic';
import { Link, useLocation } from 'wouter';

import smallLogoPng from './logo-small.png';


export function Header({ user, setUser }) {
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

        <div className="mobile-btn" onClick={()=>setExpanded(!expanded)}>
          Menu
        </div>
      </div>

      <div className='desktop-header-spacer' />

      {user ? <UserNav user={user} setUser={setUser}/> : <PubNav />}

    </header>
  );
}


export function Footer() {
  return (
    <footer>
      <Link href="/">
        <div className="unstyled-link">
          QrTracker
        </div>
      </Link>

      <a href="">GitHub Page</a>
    </footer>
  )
}

function UserNav({ user, setUser }) {
  const [location, setLocation] = useLocation();

  const logOut = () => {
    user.logOut();
    setUser(null);
    setLocation("/");
  }

  return (
    <div className='nav-links'>
      <Link href="/home/create">
        <div className='nav-link'>
          Create a Tracker
        </div>
      </Link>

      <Link href="/browse">
        <div className='nav-link'>
          Browse
        </div>
      </Link>

      <div className='nav-link' onClick={logOut}>
        Log Out
      </div>
    </div>
  );
}

function PubNav() {
  return (
    <div className="nav-links">
      <Link href='/signup'>
        <div className='nav-link'>
          Sign Up
        </div>
      </Link>
      <Link href='/login'>
        <div className='nav-link'>
          Log In
        </div>
      </Link>
    </div>
  );
}