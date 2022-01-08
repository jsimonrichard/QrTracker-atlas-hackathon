exports = async function(emails, tracker_id) {
  let db = context.service("mongodb-atlas").db("QrTrackerDB");
  let tracker_collection = db.collection("tracker");
  let tracker = tracker_collection.findOne({_id: tracker_id});

  if(context.user.id != tracker.ownerId) {
    throw Error("Only owners can invite new collaborators");
  }

  // Get the collection once
  let invite_collection = db.collection("invite");
  
  // Get the courier client once
  var { CourierClient } = require("@trycourier/courier");
  const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

  // Loop through each email address
  emails.forEach(email => {
    // Create invite
    let invite_id = invite_collection.insertOne({
      email: email,
      tracker: tracker_id,
      senderId: context.user.id
    });

    var inviteLink = `https://${context.values.get("domainName")}/acceptInvitation?invite=${encodeURIComponent(invite_id)}`;

    // Send message
    courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "RY3D9578YE4122MVDT6R5R7STG4B",
      recipientId: email,
      profile: {
        email: email,
      },
      data: {
        trackerName: tracker.title,
        inviteLink: inviteLink
      },
      override: {},
    }).then(({messageId})=>{
      // Log confirmation
      console.log("Message "+messageId+" sent");
    })
  });
}