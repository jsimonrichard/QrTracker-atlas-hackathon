import React, { useState } from 'react';
import { ButtonLink } from './basic';
import { Link } from 'wouter';

import smallLogoPng from './logo-small.png';


export function Header({ user }) {
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

      {user ? <UserNav user={user} /> : <PubNav />}

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
    </footer>
  )
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