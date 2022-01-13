exports = async () => {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  let trackers = await tracker_collection.aggregate([
    {$sample: {
      size: 12
    }}
  ]).toArray();
  
  return trackers;
};
