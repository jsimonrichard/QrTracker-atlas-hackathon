exports = async function(authEvent) {
  var db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  await db.collection("tracker").deleteMany({ ownerId: context.user.id });
  await db.collection("subscription").deleteMany({ subscriberId: context.user.id });
};
