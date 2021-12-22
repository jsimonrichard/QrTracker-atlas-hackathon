import logoPng from '../logo.png';
import { ButtonLink } from '../components/basic';

export function Welcome() {
    return (
      <div className="Welcome">
        <div className="hero">
          <div className="hero-header">
            <img className="logo" src={logoPng} alt="QrTracker"/>
          </div>
        
          <div className="content">
            <h1>Welcome</h1>
            
            <p>
              Welcome to QrTracker, my submission for the Atlas Hackathon put on by MongoDB
              and <a href="https://dev.to">dev.to</a>! QrTracker is a multi-purpose tracking<sup>1</sup> alternative
              that gives small business owners (or anyone else, really) the ability to create,
              as well as consume, tracking information.
            </p>
    
            <p>
              It's similar to the software that companies like FedEx and UPS use to give their
              customers tracking information, but it's open source. In fact, if you'd like to
              check out the source code, you can do that on
              the <a href="https://github.com/jsimonrichard/QrTracker-atlas-hackathon">QrTracker GitHub Page</a>.
            </p>
    
            <p>
              QrTracker also allows for more freedom in how it's used. It's not limited to
              geographical data or packages. If you'd like to track the progress of a custom
              product order, you can use QrTracker. If you'd like to track visits to a geocache,
              you could use QrTracker to generate a QR code and then put that code into the geocache.
              The possibilities are endless<sup>2</sup>. If any of this sounds interesting, click
              one of the buttons below.
            </p>
    
            <div class="button-row">
              <ButtonLink path="/sign-up" color="brand3">Sign Up</ButtonLink>
              <ButtonLink path="/log-in" color="brand1">Log In</ButtonLink>
              <ButtonLink path="/browse" color="brand2">Browse Public Trackers</ButtonLink>
            </div>
    
            <ol class="footnotes">
              <li>A loose definition of tracking</li>
              <li>Well, no, there not. I'd like to be optimistic, though</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }