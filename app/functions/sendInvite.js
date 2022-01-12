exports = async function(emails, tracker_id, inviteType) {

  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  let tracker_collection = db.collection("tracker");
  let tracker = await tracker_collection.findOne({_id: BSON.ObjectId(tracker_id)});

  if(context.user.id != tracker.ownerId) {
    console.log(context.user.id, tracker.ownerId);
    throw Error("Only owners can create invites");
  }

  // Get the collection once
  let invite_collection = db.collection("invite");
  
  // Get the courier client once
  var { CourierClient } = require("@trycourier/courier");
  const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

  // Loop through each email address
  emails.forEach(async email => {

    // Build data
    let insert_data = {
      email: email,
      tracker: tracker_id,
      senderId: context.user.id,
      type: inviteType
    };
    console.log("Insert request data:", JSON.stringify(insert_data));
    
    // Create invite
    let {insertedId: inviteId} = await invite_collection.insertOne(insert_data);

    // Build data for email
    var inviteLink = `https://${context.values.get("domainName")}/acceptInvitation?invite=${encodeURIComponent(inviteId)}`;
    let inviteTypePhrase;
    if(inviteType === "collaborate") {
      inviteTypePhrase = "collaborate on";
    } else if(inviteType === "subscribe") {
      inviteTypePhrase = "subscribe to";
    } else {
      throw Error("Unrecognized invite type");
    }

    // Send message
    let messageId = await courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "RY3D9578YE4122MVDT6R5R7STG4B",
      recipientId: email,
      profile: {
        email: email,
      },
      data: {
        trackerName: tracker.title,
        inviteLink,
        inviteTypePhrase
      },
      override: {},
    });
    
    console.log("Message", messageId, "sent");
  });
}