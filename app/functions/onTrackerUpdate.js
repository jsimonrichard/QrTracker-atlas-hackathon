exports = async function(changeEvent) {
  // Prevent trigger cascade
  if( Object.keys(changeEvent.updateDescription.updatedFields)
      .every(value => ["updatedAt", "history"].includes(value)) ) {

    console.log("Echo event");
    return 0
  }


  // Generate update var with updatedAt
  let update = {
    $set: {
      updatedAt: new Date(Date.now())
    }
  };


  // If status has been updated, send email and copy to history
  if(changeEvent.updateDescription.updatedFields.hasOwnProperty("status") &&
      !Object.keys(changeEvent.updateDescription.updatedFields)
        .every(value => ["timestamp"].includes(value))) {

    // Add timestamp and push status to history
    update.$set["status.timestamp"] = new Date(Date.now());

    update.$push = {
      history: {
        ...changeEvent.updateDescription.updatedFields.status,
        timestamp: update.$set["status.timestamp"] // timestamp hasn't been added yet
      }
    };

    // Format data
    let data = {
      trackerName: changeEvent.fullDocument.title,
      trackerAtAGlance: changeEvent.updateDescription.updatedFields.status.message,
      trackerLink: `https://${context.values.get("domainName")}/t/${changeEvent.documentKey._id}`
    }

    // Send email
    sendUpdateTrackerEmails(changeEvent.fullDocument.subscriberIds, data);
  }

  // Update tracker
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  await tracker_collection.updateOne(
    {_id: changeEvent.documentKey._id},
    update
  );

};


async function sendUpdateTrackerEmails(subscriberIds, data) {
  // Get users
  let customUserDataCollection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("customUserData");
  let users = await customUserDataCollection.aggregate([
    {$match: {
      userId: {
        $in: subscriberIds
      }
    }},
    {$project: 
      {email: 1, _id: 0}
    }
  ]).toArray();

  var { CourierClient } = require("@trycourier/courier");
  const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

  // Send emails individually
  users.forEach(async user => {
    var { messageId } = await courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "CETYT7FKB0M2SMM1X40TWD1SZDM8",
      recipientId: user.email,
      profile: {
        email: user.email,
      },
      data,
      override: {}
    });

    // Log confirmation
    console.log("Message "+messageId+" sent");
  });
}