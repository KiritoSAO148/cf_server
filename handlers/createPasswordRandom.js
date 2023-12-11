const generateTemporaryPassword = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let temporaryPassword = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    temporaryPassword += characters[randomIndex];
  }

  return temporaryPassword;
};

module.exports = generateTemporaryPassword;
