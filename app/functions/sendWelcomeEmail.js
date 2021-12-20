exports = async function(authEvent) {
  // Check if the email field exists
  if(authEvent.user.data.hasOwnProperty("email")) {
    // Setup courier
    var { CourierClient } = require("@trycourier/courier");
    const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

    // Send welome message
    var { messageId } = await courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "Y5FFEN3CXVM0AHKN2WHMQ2A7TGMY",
      recipientId: "d2951d4e-0a24-4091-8965-9870c1ff6ab8",
      profile: {
        email: authEvent.user.data.email,
      },
      data: {},
      override: {},
    });

    // Log confirmation
    console.log("Message "+messageId+" sent");

  } else {

    console.log("No email associated with user: " +authEvent.user.id);
  }
};
