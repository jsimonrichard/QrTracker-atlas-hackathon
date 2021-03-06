import { ControlGroup, InputGroup, NonIdealState, Spinner, Button, Classes } from "@blueprintjs/core";
import TrackerItem from "../components/tracker/trackerItem";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";


export default function Browse() {
  const { loading, error, data } = useQuery(loader('../graphql/browse.graphql'));

  if(loading) {
    return (
      <div className="content">
        <Spinner className="tall-spinner" />
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
    );

  } else {
    return (
      <div className="content">
        <div className="browse-header">
          <h1>Public Trackers</h1>
          <form method="GET" action="/search">
            <ControlGroup>
              <input className={[Classes.INPUT, Classes.LARGE].join(" ")}
                placeholder="Search" name="query"/>
              <Button type="submit" icon="search" large={true} outline={true}/>
            </ControlGroup>
          </form>
        </div>
      
        <div className="tracker-list">
          {data.trackerSample ?
              data.trackerSample.map(tracker => <TrackerItem tracker={tracker} key={tracker._id} />)
          :
            (<div className="tracker-list-item tracker-list-add-item disabled">
              None
            </div>)
          }
        </div>
      </div>
    );
  }
}