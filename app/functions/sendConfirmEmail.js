
  /*

    This function will be run AFTER a user registers their username and password and is called with an object parameter
    which contains three keys: 'token', 'tokenId', and 'username'.

    The return object must contain a 'status' key which can be empty or one of three string values:
      'success', 'pending', or 'fail'.

    'success': the user is confirmed and is able to log in.

    'pending': the user is not confirmed and the UserPasswordAuthProviderClient 'confirmUser' function would
      need to be called with the token and tokenId via an SDK. (see below)

      const Realm = require("realm");
      const appConfig = {
          id: "my-app-id",
          timeout: 1000,
          app: {
              name: "my-app-name",
              version: "1"
          }
        };
      let app = new Realm.App(appConfig);
      let client = app.auth.emailPassword;
      await client.confirmUser(token, tokenId);

    'fail': the user is not confirmed and will not be able to log in.

    If an error is thrown within the function the result is the same as 'fail'.

    Example below:

    exports = ({ token, tokenId, username }) => {
      // process the confirm token, tokenId and username
      if (context.functions.execute('isValidUser', username)) {
        // will confirm the user
        return { status: 'success' };
      } else {
        context.functions.execute('sendConfirmationEmail', username, token, tokenId);
        return { status: 'pending' };
      }

      return { status: 'fail' };
    };

    The uncommented function below is just a placeholder and will result in failure.
  */

exports = ({ token, tokenId, username }) => {
  // construct confirm link
  var buildUrl = require("build-url");
  var link = buildUrl("https://" + context.values.get("domainName"), {
    path: "confirmEmail",
    queryParams: { token, tokenId }
  });
  
  // Setup courier
  var { CourierClient } = require("@trycourier/courier");
  const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

  // Send message
  var { messageId } = await courier.send({
    brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
    eventId: "C2JMC6WNHD4TC3MQA46XSQENCFJQ",
    profile: {
      email: username,
    },
    data: {
      confirmLink: link
    },
    override: {},
  });

  // Log confirmation
  console.log("Message "+messageId+" sent");

  // Return status
  return { status: 'pending' };
};
