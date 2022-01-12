exports = async (userId) => {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB").collection("tracker")
  let trackers = await tracker_collection.find({
    "collaboratorIds": userId
  });
  console.log(JSON.stringify(trackers));
  return trackers;
};
