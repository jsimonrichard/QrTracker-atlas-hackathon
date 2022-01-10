exports = async function(inviteId) {
  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");
  let invite = await db.collection("invite").findOne({_id: inviteId});

  if(context.user.data.email != invite.email) {
    throw Error("This invite is not associated with the user that is currently logged in");
  }

  // Add user id to collaborators in tracker
  await db.collection("tracker").updateOne(
    {_id: invite.tracker},
    {"$addToSet": {
      "collaborators": context.user.id
    }}
  );

  // Remove invite
  await db.collection("invite").deleteOne({_id: inviteId});
}