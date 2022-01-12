import { loader } from "graphql.macro";
import { useLazyQuery } from "@apollo/client";
import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import { useContext, useEffect } from "react";
import { Link } from "wouter";

import Share from "../../components/tracker/share";
import { AppContext } from "../..";
import UpdateStatus from "../../components/tracker/updateStatus";

export default function ViewTracker({trackerId}) {
  const app = useContext(AppContext);

  const [loadData, { called, loading, error, data }] = useLazyQuery(loader("../../graphql/viewTracker.graphql"), {
    variables: {
      id: trackerId
    }
  });

  // Load data on mount
  useEffect(loadData, []);

  // Render
  if(!called || loading) {
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

        <div className="tracker-header">
          <h1>{data.tracker.title}</h1>

          <div className="updated-at-info">
            {"Last updated at " + (new Date(data.tracker.updatedAt)).toLocaleString()}
          </div>

          <div className="button-group">

            <UpdateStatus
              trackerId={trackerId}
              statusTemplateIncludes={data.tracker.statusTemplateIncludes}
              loadData={loadData}/>

            <Link href={`/t/${trackerId}/edit`}>
              <Button
                large={true}
                outlined={true}
                icon="edit"
                intent="primary">
                  Edit
              </Button>
            </Link>

            {(app.currentUser.id === data.tracker.ownerId) && <Share trackerId={trackerId} />}
          </div>
        </div>

        <p>
          {data.tracker.description}
        </p>


        <div className="center-content-wide">
          <h2>Status History</h2>

          <div className="tracker-history-table">
            <table>
              <tbody>
                {data.tracker.history.slice(0).reverse().map(historyItem => {
                  return (
                    <tr key={historyItem.timestamp}>
                      <td className="time-column">
                        {(new Date(historyItem.timestamp)).toLocaleString()}
                      </td>

                      <td>
                        <strong>{historyItem.message}</strong>
                        {data.tracker.statusTemplateIncludes.details &&
                          <p>
                            {historyItem.details}
                          </p>
                        }
                      </td>

                      {data.tracker.statusTemplateIncludes.location &&
                        <td>
                          {historyItem.location && historyItem.location.formatted_address}
                        </td>
                      }
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    )
  }
}