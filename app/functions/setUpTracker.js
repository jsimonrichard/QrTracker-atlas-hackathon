exports = async function(changeEvent) {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  console.log(JSON.stringify(changeEvent.documentKey._id));
  
  await tracker_collection.updateOne(
    {_id: BSON.ObjectId(changeEvent.documentKey._id)},
    {"$set": {
      "collaboratorIds": [],
      "history": [],
      "createdAt": Date.now(),
      "updatedAt": Date.now()
    }}
  );
};
