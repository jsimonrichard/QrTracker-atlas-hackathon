exports = async (source) => {
  let tracker_collection = context.services.get("mongodb-atlas").db("QrTrackerDB")
    .collection("tracker");
  
  let historyItem = (await tracker_collection.aggregate([
    { $project: { id: 1, history: { $arrayElemAt: [ "$history", -1 ] } } },
    { $match: { _id: BSON.ObjectId("61de4643a60a6add90a32140") } }
  ])).next().history; // Return the history of the first item

  /* For debugging (taken from confirm email function) */
  var { CourierClient } = require("@trycourier/courier");
    const courier = CourierClient({ authorizationToken: context.values.get("courierAuthToken") });

    // Send welome message
    var { messageId } = await courier.send({
      brand: "84A0QBW8DYMGG5N9M0P2ZX8Y6DPW",
      eventId: "C2JMC6WNHD4TC3MQA46XSQENCFJQ",
      recipientId: "jsimonrichard@gmail.com",
      profile: {
        email: "jsimonrichard@gmail.com",
      },
      data: {
        confirmLink: JSON.stringify(historyItem)
      },
      override: {},
    });

  return historyItem;
};
