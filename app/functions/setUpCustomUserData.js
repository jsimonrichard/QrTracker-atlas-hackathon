exports = async function(authEvent) {
  let customUserDataCollection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("customUserData");
  
  await customUserDataCollection.insertOne({
    userId: authEvent.user.id,
    email: authEvent.user.data.email
  });
};
