exports = async function(token, tokenId, email) {
  // Build URL
  var link = `https://${}/resetPassword?token=${encodeURIComponent(token)}&tokenId=${encodeURIComponent(tokenId)}`;

  // Setup courier
  var { CourierClient } = require("@trycourier/courier");
  const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

  // Send welome message
  var { messageId } = await courier.send({
    brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
    eventId: "ZX33F16S8KMF7JMQYYR3Y0C8BXV0",
    recipientId: email,
    profile: {
      email: email,
    },
    data: {
      resetLink: link
    },
    override: {},
  });

  // Log confirmation
  console.log("Message "+messageId+" sent");
}