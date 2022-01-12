exports = async function(changeEvent) {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  let { matchedCount } = await tracker_collection.updateOne(
    {_id: changeEvent.documentKey._id},
    {"$set": {
      "collaboratorIds": [],
      "history": [],
      "createdAt": Date.now(),
      "status": {
        "message": "Tracker Created"
      }
    }}
  );

  if(matchedCount) {
    console.log("Successfully updated tracker");
  } else {
    console.log("No matching document");
  }
};
