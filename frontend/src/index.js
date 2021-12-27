import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as Realm from 'realm-web';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink
} from "@apollo/client";


// Get Realm app
const app = new Realm.App({ id: "qrtracker-yibtf" });
export const AppContext = React.createContext(app);


// Set up Apollo client with authorization
async function getValidAccessToken() {
  if(app.currentUser) {
    // Refresh token
    await app.currentUser.refreshCustomData();

    // Return token
    return app.currentUser.accessToken;

  } else {
    throw "Cannot get an auth token since no user is logged in";
  }
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/qrtracker-yibtf/graphql`,
    
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <AppContext.Provider value={app}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </AppContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
