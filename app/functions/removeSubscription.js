exports = async function(trackerId) {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");

  let { matchedCount } = await tracker_collection.updateOne(
    { _id: BSON.ObjectId(trackerId) },
    {$pull: {
      subscriberIds: context.user.id
    }}
  );

  if(matchedCount) {
    console.log("Successfully unsubscribed");
  } else {
    throw Error("No matching tracker");
  }
}