exports = async function(userId, email) {
  let custom_data_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("customUserData");
  
  await custom_data_collection.insertOne({
    userId: userId,
    email: email
  })
}