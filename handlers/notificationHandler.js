const admin = require("firebase-admin");

const notificationHandler = async (title, body, tokens) => {
  const message = {
    // data: {
    //   score: "850",
    //   time: "2:45",
    // },
    notification: {
      title: "FreshGreen",
      body,
    },
    tokens,
  };

  await admin.messaging().sendEachForMulticast(message);
};

module.export = notificationHandler;
