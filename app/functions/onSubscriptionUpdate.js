exports = async function(changeEvent) {
  // Check if the email field exists
  if(context.user.data.hasOwnProperty("email")) {
    // Get associated tracker
    var trackers = context.service.get("mongodb-atlas").db("QrTrackerDB").collection("tracker");
    var tracker = await trackers.findOne({ _id: changeEvent.fullDocument.trackerId });


    // Generate message
    var message = "";
    if(changeEvent.operationType == "insert") {
      message = `You have been subcribed to ${tracker.title}. See it's current status <a href="${context.values.get("domainName")}/${tracker._id}">here</a>.`;

    } else if(changeEvent.operationType == "delete") {
      message = `Your subscription to ${tracker.title} has been removed.`;

    } else {
      message = `Your subscription to ${tracker.title} has been updated. See it's current status <a href="${context.values.get("domainName")}/${tracker._id}">here</a>.`;
    }



    // Setup courier
    var { CourierClient } = require("@trycourier/courier");
    const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

    // Send message
    var { messageId } = await courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "RV6FCVCJWZM885GZ72GYDW48RDC6",
      profile: {
        email: context.user.data.email,
      },
      data: {
        message: message
      },
      override: {},
    });

    // Log confirmation
    console.log("Message "+messageId+" sent");

  } else {

    console.log("No email associated with user: " +context.user.id);
  }
};
