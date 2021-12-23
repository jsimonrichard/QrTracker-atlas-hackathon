exports = async function(token, tokenId, email) {
  // construct confirm link
  var link = `https://${context.values.get("domainName")}/confirmEmail?token=${encodeURIComponent(token)}&tokenId=${encodeURIComponent(tokenId)}`
  
  // Setup courier
  var { CourierClient } = require("@trycourier/courier");
  const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

  // Send message
  console.log(email);
  var { messageId } = await courier.send({
    brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
    eventId: "C2JMC6WNHD4TC3MQA46XSQENCFJQ",
    recipientId: email,
    profile: {
      email: email,
    },
    data: {
      confirmLink: ""
    },
    override: {},
  });

  // Log confirmation
  console.log("Message "+messageId+" sent");

  // Return status
  return { status: 'pending' };
};
