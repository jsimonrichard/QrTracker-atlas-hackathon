exports = function(authEvent) {
  // Check if the email field exists
  if(authEvent.user.data.hasOwnProperty("email")) {
    // Setup courier
    var { CourierClient } = require("@trycourier/courier");
    const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

    // Send message
    courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "38P45E3F3MMC0XG3GQWR22SW68XM",
      recipientId: "cfa09c6d-39ef-451e-91ed-457795d03c70",
      profile: {
        email: authEvent.user.data.email,
      },
      data: {},
      override: {},
    }).then(function({messageId}) {
      // Log confirmation
      console.log("Message "+messageId+" sent");
    });

  } else {

    console.log("No email associated with user: " +authEvent.user.id);
  }
};
