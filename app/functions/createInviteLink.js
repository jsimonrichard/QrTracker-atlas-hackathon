exports = async function(trackerId) {
  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  let inviteLinkCollection = db.collection("inviteLink");
  let trackerCollection = db.collection("tracker");

  let tracker = trackerCollection.findOne({
    _id: BSON.ObjectId(trackerId)
  });

  // VALIDATION (do not remove)
  if(tracker.ownerId !== context.user.id) {
    throw Error("Insufficiant permissions");
  }
  
  var srs = require('secure-random-string');

  await inviteLinkCollection.insertOne({
    creatorId: context.user.id,
    tracker: trackerId,
    key: srs({length: 12})
  });
}