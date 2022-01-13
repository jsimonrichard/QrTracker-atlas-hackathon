exports = (source) => {
  if(source.collaboratorIds.includes(context.user.id)) {
    return "collaborator";
  } else if(source.subscriberIds.includes(context.user.id)) {
    return "subscriber";
  } else {
    throw Error("You have no role for this tracker");
  }
};
