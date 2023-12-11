const generateRandomCode = () => {
  const characters = "0123456789";
  let code = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return +code;
};

module.exports = generateRandomCode;
