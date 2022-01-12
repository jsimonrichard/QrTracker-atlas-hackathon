import GoogleMapReact from 'google-map-react';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../..';


export default function GoogleMapDisplay({ value }) {
    const app = useContext(AppContext);
    const [googleAPIKey, setGoogleAPIKey] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
  
    const Marker = () => <div></div>
  
    // Get API key on mount
    useEffect(() => {
      app.currentUser.functions.getGoogleAPIKey()
        .then(setGoogleAPIKey)
        .catch(error => {
          console.log(error);
          setErrorMessage(error);
        });
    }, []);
  
    return (
      <div style={{width: "100%", height: "50vh"}}>
        {errorMessage ?
          <div>{errorMessage}</div> :
          
          (googleAPIKey ?
            <GoogleMapReact
              bootstrapURLKeys={{ key: googleAPIKey }}
              defaultCenter={{
                lat: value.geometry.location.lat,
                long: value.geometry.location.long
              }}
              defaultZoom={11}>
                <Marker 
                    lat={value.geometry.location.lat}
                    lng={value.geometry.location.long}
                  />
            </GoogleMapReact>
          :
            <Spinner />
          )}
      </div>
    );
  }