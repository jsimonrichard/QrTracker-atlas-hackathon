exports = async function(authEvent) {
  await context.functions.execute(
    "registerCustomUserData",
    authEvent.user.id,
    authEvent.user.data.email
  );
  await context.functions.execute(
    "sendWelcomeEmail",
    authEvent.user.data.email
  );
}