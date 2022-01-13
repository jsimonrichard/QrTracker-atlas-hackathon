import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Spinner, Button, Classes, NonIdealState, ControlGroup } from "@blueprintjs/core";
import TrackerItem from "../components/tracker/trackerItem";
import { useState } from "react";

export default function Search() {
  const urlParams = new URLSearchParams(window.location.search);

  const { loading, error, data } = useQuery(loader('../graphql/search.graphql'), {
    variables: {
      query: urlParams.get("query")
    }
  });

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
          <h1>Search</h1>
          <form method="GET" action="/search">
            <ControlGroup>
              <input className={[Classes.INPUT, Classes.LARGE].join(" ")}
                placeholder="Search" name="query"/>
              <Button type="submit" icon="search" large={true} outline={true}/>
            </ControlGroup>
          </form>
        </div>
      
        <div className="tracker-list">
          {data.searchTrackers ?
            data.searchTrackers.map(tracker => <TrackerItem tracker={tracker} key={tracker._id} />)
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