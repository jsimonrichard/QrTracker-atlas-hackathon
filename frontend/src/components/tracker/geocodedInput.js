import Geocode from "react-geocode";
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../..';
import { Button } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';


export default function GeocodedInput({ defaultValue="", value, setValue, large }) {
  const app = useContext(AppContext);
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);

  const [textValue, setTextValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // Load in the API key on mount
  useEffect(() => {
    app.currentUser.functions.getGoogleAPIKey().then(apiKey => {
      Geocode.setApiKey(apiKey);
      setApiKeyLoaded(true);
    });
  }, []);

  // Get suggestions from google
  const getSuggestions = () => {
    if(textValue) {
      setLoading(true);
      Geocode.fromAddress(textValue).then(response => {
        setSuggestions(response.results);
        setLoading(false);

      }).catch(error => {
        setErrorMessage(error.error);
        console.log(error);
        setLoading(false);
      });
    }
  }

  // Call get suggestions after user has finished typing
  let typingTimeout;
  const TYPING_DELAY = 2; // seconds
  useEffect(() => {
    if(apiKeyLoaded) {
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(getSuggestions, TYPING_DELAY);
    }
  }, [textValue, apiKeyLoaded]);

  return (
    <Suggest
      fill={true}
      inputProps={{large: large}}
      query={textValue}
      onQueryChange={setTextValue}
      items={loading || errorMessage ? [{}] : suggestions}
      inputValueRenderer={value => value.formatted_address}
      itemRenderer={(item, {handleClick}) => (
        <Button
          onClick={event => {
            setValue(item);
            handleClick(event);
          }}
          className="popover-select-button"
          minimal={true}
          loading={loading}
          intent={errorMessage ? "danger" : ""}>
            {errorMessage ? errorMessage : (loading ? "" : item.formatted_address)}
        </Button>
      )}/>
  );
}