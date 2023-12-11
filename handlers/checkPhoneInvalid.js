const checkPhone = (user) => {
  if (user.phone.includes("social")) return { ...user, phone: "" };
  return user;
};

module.exports = checkPhone;
