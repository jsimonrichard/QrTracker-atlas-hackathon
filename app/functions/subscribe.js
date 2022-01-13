// Must run as system
exports = async function(trackerId) {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  let tracker = await tracker_collection.findOne({
    _id: BSON.ObjectId(trackerId)
  });

  if(!tracker) {
    throw Error("Tracker not found");
  }

  // VALIDATION (do not remove)
  if(tracker.subscriberIds.includes(context.user.id)) {
    throw Error("You're already subscribed");
  } else if(!tracker.public || !tracker.collaboratorIds.includes(context.user.id)) {
    throw Error("Insufficient permissions");
  }

  // Add id to subscriberIds
  let { matchedCount } = await tracker_collection.updateOne(
    {_id: BSON.ObjectId(trackerId)},
    {$push: {
      subscriberIds: context.user.id
    }}
  );

  if(matchedCount) {
    console.log("Successfully added subscription");
  } else {
    throw Error("Couldn't match tracker");
  }
}