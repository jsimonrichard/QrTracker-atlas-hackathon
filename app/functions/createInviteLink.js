exports = async function(trackerId, type) {
  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  let inviteLinkCollection = db.collection("inviteLink");
  let trackerCollection = db.collection("tracker");

  let tracker = await trackerCollection.findOne({
    _id: BSON.ObjectId(trackerId)
  });

  // VALIDATION (do not remove)
  if(tracker.ownerId !== context.user.id) {
    throw Error("Insufficiant permissions");
  }
  
  var srs = require('secure-random-string');
  let key = srs({
    alphanumeric: true,
    length: 12
  });

  await inviteLinkCollection.insertOne({
    creatorId: context.user.id,
    tracker: BSON.ObjectId(trackerId),
    key,
    type
  });
}