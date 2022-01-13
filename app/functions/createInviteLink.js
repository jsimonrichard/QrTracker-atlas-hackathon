exports = async function(trackerId, type) {
  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  let inviteLinkCollection = db.collection("inviteLink");
  let trackerCollection = db.collection("tracker");

  let tracker = trackerCollection.findOne({
    _id: trackerId
  });

  console.log(JSON.stringify(tracker));

  // VALIDATION (do not remove)
  if(tracker.ownerId !== context.user.id) {
    throw Error("Insufficiant permissions");
  }
  
  var srs = require('secure-random-string');
  let key = srs({length: 12});

  await inviteLinkCollection.insertOne({
    creatorId: context.user.id,
    tracker: trackerId,
    key,
    type,
    linkPrefix: `https://${context.values.get("domainName")}/acceptInvite`
  });
}