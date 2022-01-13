exports = async function(trackerId) {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  let { matchedCount } = await tracker_collection.updateOne({ _id: BSON.ObjectId(trackerId) });
}