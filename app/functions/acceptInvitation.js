exports = async function(inviteId) {
  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  let invite = db.collection("invite").findOne({_id: inviteId});

  if(context.user.data.email != invite.email) {
    throw Error("This invite is not associated with the user that is currently logged in");
  }

  // Add user id to collaborators in tracker
  db.collection("tracker").updateOne(
    {_id: invite.tracker},
    {"$addToSet": {
      "collaborators": context.user.id
    }}
  );

  // Remove invite
  db.collection("invite").deleteOne({_id: inviteId});
}