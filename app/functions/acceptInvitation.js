/*
This function must be executed with "System" privileges, and an authorization expression
does not have the features nessicary to validate it correctly. For that reason a simple
if statement within the function must be used.
*/

exports = async function(inviteId, key) {
  let db = context.services.get("mongodb-atlas").db("QrTrackerDB");

  let invite;
  console.log(intiveId);
  if(key) {
    invite = await db.collection("inviteLink").findOne({
      _id: BSON.ObjectId(inviteId),
      key
    });
  } else {
    invite = await db.collection("invite").findOne({_id: BSON.ObjectId(inviteId)});
  }

  if(!invite) {
    throw Error("No invite with the given ID exists");
  }

  // VALIDATION (DO NOT REMOVE)
  if(!key && context.user.data.email != invite.email) {
    throw Error("This invite is not associated with the user that is currently logged in");
  }

  // Add user id to collaborators/subscribers in tracker
  let idField;
  if(invite.type === "collaborate") {
    idField = "collaboratorIds";
  } else if(invite.type === "subscribe") {
    idField = "subscriberIds"
  } else {
    throw Error("Unrecognized invite type");
  }

  let data = {};
  data[idField] = context.user.id;

  let { matchedCount } = await db.collection("tracker").updateOne(
    {_id: BSON.ObjectId(invite.tracker)},
    {$addToSet: data}
  );

  // Check result
  if(matchedCount) {
    console.log("Successfully added collaborator/subscriber");
  } else {
    throw Error("No matching tracker found");
  }

  // Remove invite
  let { deletedCount } = await db.collection("invite").deleteOne({_id: BSON.ObjectId(inviteId)});
  if(deletedCount) {
    console.log("Deleted invite after use");
  } else {
    throw Error("No invite found");
  }

  return invite.tracker;
}