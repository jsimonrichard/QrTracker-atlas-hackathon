exports = async (query) => {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  let trackers = await tracker_collection.aggregate([
    {$search: {
      index: 'default',
      text: {
        query: query,
        path: {
          wildcard: '*'
        }
      }
    }}
  ]).toArray();
  
  return trackers;
};
