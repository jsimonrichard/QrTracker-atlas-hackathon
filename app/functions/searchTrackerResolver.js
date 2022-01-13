exports = async (query) => {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  let trackers = await tracker_collection.aggregate([
    {$search: query}
  ]).toArray();
  
  return trackers;
};
