const bcrypt = require("bcryptjs");

const USERS = [
  {
    id: 1,
    email: "test@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

module.exports = USERS;
