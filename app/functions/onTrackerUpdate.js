async function sendUpdateTrackerEmails(subscriptions, data) {
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
      data,
      override: {},
    });

    // Log confirmation
    console.log("Message "+messageId+" sent");
  }
}



exports = async function(changeEvent) {
  // Prevent trigger cascade
  if( changeEvent.updateDescription.updatedFields.keys()
      .every(value => ["updatedAt", "history"].includes(value)) ) {

    console.log("Echo event");
    return 0
  }


  // Generate update var with updatedAt
  let update = {
    $set: {
      updatedAt: Date.now()
    }
  };


  // Get db
  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");


  // If status has been updated, send email and copy to history
  if(changeEvent.updateDescription.updateFields.hasOwnProperty("status")) {

    // Push status to history
    update.$push = {
      "history": changeEvent.updateDescription.updateFields.status
    }


    // Get supscribers
    var subscription_collection = db.collection("subscription");
    var subscriptions = await subscription_collection.find({ tracker: context.documentKey._id });

    // Format data
    let data = {
      trackerName: changeEvent.fullDocument.title,
      trackerAtAGlance: changeEvent.updateDescription.updateFields.status[
        changeEvent.fullDocument.atAGlanceField
      ],
      trackerLink: `https://${context.values.get("domainName")}/tracker/${changeEvent.documentKey._id}`
    }

    // Send email
    sendUpdateTrackerEmails(subscriptions, data);
  }

  // Update tracker
  var tracker_collection = db.collection("tracker");
  await tracker_collection.updateOne(
    {_id: changeEvent.documentKey._id},
    update
  );

};
