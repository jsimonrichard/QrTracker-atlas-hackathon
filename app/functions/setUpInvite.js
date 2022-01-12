exports = async function(changeEvent) {
  let invite_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("invite");
  
  let { matchedCount } = await invite_collection.updateOne(
    {_id: changeEvent.documentKey._id},
    {$set: {
      createdAt: new Date(Date.now())
    }}
  );

  if(matchedCount) {
    console.log("Successfully updated tracker");
  } else {
    console.log("No matching document");
  }
};
