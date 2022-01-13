import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import { useContext, useEffect } from "react";
import { Link, useLocation } from "wouter";

import Share from "../../components/tracker/share";
import { AppContext } from "../..";
import UpdateStatus from "../../components/tracker/updateStatus";
import SubscribeButton from "../../components/tracker/subscribeButton";

export default function ViewTracker({trackerId}) {
  const app = useContext(AppContext);

  const { called, loading, error, data } = useQuery(loader("../../graphql/viewTracker.graphql"), {
    variables: {
      id: trackerId
    }
  });

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
          <div className="title-group">
            <h1>{data.tracker.title}</h1>

            <p>
              {data.tracker.description}
            </p>
          </div>


          <div className="button-group">
            {["collaborator", "owner"].includes(data.tracker.role) &&
              <>
                <UpdateStatus
                  trackerId={trackerId}
                  statusTemplateIncludes={data.tracker.statusTemplateIncludes}/>

                <Link href={`/t/${trackerId}/edit`}>
                  <Button
                    outlined={true}
                    icon="edit"
                    intent="primary">
                      Edit
                  </Button>
                </Link>
              </>
            }

            {(data.tracker.role === "owner") && <Share trackerId={trackerId} data={data}/>}

            <SubscribeButton
              isSubscribed={data.tracker.isSubscribed}
              trackerName={data.tracker.title}
              trackerId={trackerId}/>
          </div>
        </div>


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