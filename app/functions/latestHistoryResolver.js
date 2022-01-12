exports = async (source) => {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  let historyItem = await tracker_collection.aggregate([
    { $project: { id: 1, history: { $arrayElemAt: [ "$history", -1 ] } } },
    { $match: { _id: BSON.ObjectId("61de4643a60a6add90a32140") } }
  ]).next().history; // Return the first item

  return historyItem;
};
