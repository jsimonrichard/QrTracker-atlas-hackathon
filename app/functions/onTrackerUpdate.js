exports = async function(changeEvent) {
  // Generate message
  var message = "";
  if(changeEvent.operationType == "update" && changeEvent.updateDescription.updateFields.hasOwnProperty("status")) {
    message = `The tracker ${changeEvent.fullDocument.title} has a new status: ${changeEvent.fullDocument.status.title}. Click <a href="${context.values.get("domainName")}/${changeEvent.documentKey._id}">here</a> for more details.`;

  } else if (changeEvent.operationType == "delete") {
    message = `The tracker ${changeEvent.fullDocument.title} has been deleted and your subscription to that tracker has been removed.`
  }


  // Get subscriptions
  var subscription_collection = context.service("mongodb-atlas").db("QrTRackerDB").collection("subscription");
  var subscriptions = await subscription_collection.find({ trackerId: context.documentKey._id });

  // Delete subscriptions if the tracker has been deleted
  if(changeEvent.operationType == "delete") {
    await subscription_collection.deleteMany({ trackerId: context.documentKey._id});
  }


  // Generate email list from subscriptions
  var email_list = "";
  subscriptions.forEach(subscription => {
    email_list += subscription.targets.email.join(",") + ",";
  });


  // Send the emails as long as email_list != ""
  if(email_list) {
    // Setup courier
    var { CourierClient } = require("@trycourier/courier");
    const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

    // Send message
    var { messageId } = await courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "CETYT7FKB0M2SMM1X40TWD1SZDM8",
      recipientId: email_list,
      profile: {
        email: email_list,
      },
      data: {
        message: ""
      },
      override: {},
    });

    // Log confirmation
    console.log("Message "+messageId+" sent");
  }
};
