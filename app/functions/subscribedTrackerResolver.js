exports = async (userId) => {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  let subscribed_trackers = await tracker_collection.find({
    subscriberIds: userId
  }).toArray();

  return subscribed_trackers;
}