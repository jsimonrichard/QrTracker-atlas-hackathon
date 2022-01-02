import { Icon, NonIdealState, Spinner } from "@blueprintjs/core";
import { useQuery } from "@apollo/client";
import { Link } from 'wouter';
import { loader } from 'graphql.macro';
import { useContext } from "react";
import { AppContext } from "../..";

function TrackerItem({ tracker }) {
  return (
    <div className="tracker-list-item">
      <h4>{tracker.title}</h4>
      <div>
        {tracker.updatedAt} - {tracker.status.title}
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

export default function Dashboard({ user }) {
  const app = useContext(AppContext);
  const { loading, error, data } = useQuery(loader('../../graphql/dashboardQuery.graphql'), {
    variables: {
      userId: app.currentUser.id
    }
  });

  if(loading) {
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
          icon="error"
          title="An error occured"
          description={error.error}/>
      </div>
    )
  } else {
    return (
      <div className="content">
        <h1>Your Subscriptions</h1>
        <div className="tracker-list">

          {data.subscriptions.forEach(subscription => 
            <TrackerItem tracker={subscription.tracker}/>
          )}

          <AddTrackerLink href="/browse"/>
        </div>

        <h1>Your Trackers</h1>
        <div className="tracker-list">

          {data.trackers.forEach(tracker => 
            <TrackerItem tracker={tracker} />
          )}

          <AddTrackerLink href="/create" />
        </div>
      </div>
    )
  }
}