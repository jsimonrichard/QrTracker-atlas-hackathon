import { Icon, NonIdealState, Spinner } from "@blueprintjs/core";
import { useLazyQuery } from "@apollo/client";
import { Link } from 'wouter';
import { loader } from 'graphql.macro';
import { useContext, useEffect } from "react";
import { AppContext } from "../..";

function TrackerItem({ tracker }) {
  let datetime = new Date(tracker.updatedAt);
  let now = new Date(Date.now())
  let diff = now.getTime() - datetime.getTime();

  let dateString = "";
  if(diff < (1000 * 3600 * 24) && now.getDay() === datetime.getDay()) {
    let hours = datetime.getHours();
    let noonSide = hours <= 12 ? "am" : "pm";
    hours = (hours-1)%12 + 1;
    let minutes = String(datetime.getMinutes()).padStart(2, "0");

    dateString = `${hours}:${minutes} ${noonSide}`;
  } else {
    let month = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ][datetime.getMonth()]
    let day = datetime.getDate();

    dateString = `${month} ${day}`;
  }

  return (
    <Link href={`/t/${tracker._id}`}>
      <div className="tracker-list-item">
        <h4>{tracker.title}</h4>
        <div>
          {dateString} - {tracker.status.message}
        </div>
      </div>
    </Link>
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

export default function Dashboard({ user }) {
  const app = useContext(AppContext);
  const [loadData, { called, loading, error, data }] = useLazyQuery(loader('../../graphql/dashboardQuery.graphql'), {
    variables: {
      userId: app.currentUser.id
    }
  });

  // Load data on mount
  useEffect(loadData, []);


  if(!called || loading) {
    return (
      <div className="content">
        <Spinner className="tall-spinner"/>
      </div>
    );
  } else if(error) {
    console.log(error);
    return (
      <div className="content">
        <NonIdealState
          className="tall-spinner"
          icon="error"
          title="An error occured"
          description={error.error}/>
      </div>
    )
  } else {
    return (
      <div className="content">
        <h1 style={{textAlign: 'center'}}>Dashboard</h1>

        <h2>Your Subscriptions</h2>
        <div className="tracker-list">

          {data.subscriptions.map(subscription => 
            <TrackerItem tracker={subscription.tracker}/>
          )}

          <AddTrackerLink href="/browse"/>
        </div>

        <h2>Your Trackers</h2>
        <div className="tracker-list">

          {data.trackers.map(tracker => 
            <TrackerItem tracker={tracker} />
          )}

          <AddTrackerLink href="/create" />
        </div>

        <h2>Shared with you</h2>
        <div className="tracker-list">

          {data.shared.length ? data.shared.map(tracker => 
            <TrackerItem tracker={tracker} />
          ) :
            <div className="tracker-list-item tracker-list-add-item disabled">
              None
            </div>
          }
        </div>
      </div>
    )
  }
}