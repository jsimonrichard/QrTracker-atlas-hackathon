import { Icon } from "@blueprintjs/core";
import { useEffect } from "react";
import { Link } from 'wouter';

function TrackerItem({ title, status, updatedAt}) {
  return (
    <div className="tracker-list-item">
      <h4>{title}</h4>
      <div>
        {updatedAt} - {status.title}
      </div>
    </div>
  )
}

function AddTrackerLink({ href }) {
  return (
    <Link href={href}>
      <div className="tracker-list-item tracker-list-add-item">
        <Icon icon="plus" size={20}/>
      </div>
    </Link>
  )
}

export default function Dashboard({ app, user }) {
  
  // Run on mount
  useEffect({
    // Get subscriptions
    
  }, []);

  return (
    <div className="content">
      <h1>Your Subscriptions</h1>
      <div className="tracker-list">
        <TrackerItem title="My Tracker" updatedAt={"Jan 16th"} status={{title: "Moved to chicago"}} />
        <AddTrackerLink href="/browse"/>
      </div>

      <h1>Your Trackers</h1>
      <div className="tracker-list">
        <AddTrackerLink href="/create" />
      </div>
    </div>
  );
}