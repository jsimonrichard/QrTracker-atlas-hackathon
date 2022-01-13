import { Icon, NonIdealState, Spinner } from "@blueprintjs/core";
import { useQuery } from "@apollo/client";
import { Link } from 'wouter';
import { loader } from 'graphql.macro';
import { useContext } from "react";
import { AppContext } from "../..";

import TrackerItem from "../../components/tracker/trackerItem";

function AddTrackerLink({ href }) {
  return (
    <Link href={href}>
      <div className="tracker-list-item tracker-list-add-item">
        <Icon icon="plus" size={20}/>
      </div>
    </Link>
  )
}

export default function Dashboard() {
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

          {data.subscribed.map(tracker => 
            <TrackerItem tracker={tracker} key={tracker._id}/>
          )}

          <AddTrackerLink href="/browse"/>
        </div>

        <h2>Your Trackers</h2>
        <div className="tracker-list">

          {data.trackers.map(tracker => 
            <TrackerItem tracker={tracker} key={tracker._id}/>
          )}

          <AddTrackerLink href="/create" />
        </div>

        <h2>Shared with you</h2>
        <div className="tracker-list">

          {data.shared.length ? data.shared.map(tracker => 
            <TrackerItem tracker={tracker} key={tracker._id}/>
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