exports = function(changeEvent) {
  // Check if the email field exists
  if(authEvent.user.data.hasOwnProperty("email")) {
    // Get associated tracker
    var trackers = context.service.get("mongodb-atlas").db("QrTrackerDB").collection("tracker");
    var tracker = trackers.findOne({ _id: changeEvent.fullDocument.trackerId });


    // Generate message
    var message = "";
    if(changeEvent.operationType == "insert") {
      message = `You have been subcribed to ${tracker.title}. See it's current status <link href="${context.values.get("domainName")}/${tracker._id}">here</link>.`;

    } else if(changeEvent.operationType == "delete") {
      message = `Your subscription to ${tracker.title} has been removed.`;

    } else {
      message = `Your subscription to ${tracker.title} has been updated. See it's current status <link href="${context.values.get("domainName")}/${tracker._id}">here</link>.`;
    }



    // Setup courier
    var { CourierClient } = require("@trycourier/courier");
    const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

    // Send message
    courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "RV6FCVCJWZM885GZ72GYDW48RDC6",
      recipientId: "1827d074-ff99-4f56-aae5-e95e2ce87eee",
      profile: {
        email: authEvent.user.data.email,
      },
      data: {
        message: ""
      },
      override: {},
    }).then(function({messageId}) {
      // Log confirmation
      console.log("Message "+messageId+" sent");
    });

  } else {

    console.log("No email associated with user: " +authEvent.user.id);
  }
};
