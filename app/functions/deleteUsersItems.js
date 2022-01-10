exports = function(authEvent) {
  var db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  db.collection("tracker").deleteMany({ ownerId: context.user.id });
  db.collection("subscription").deleteMany({ subscriberId: context.user.id });
};
