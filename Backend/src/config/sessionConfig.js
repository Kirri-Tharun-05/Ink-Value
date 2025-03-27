const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions",
  }),
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 Week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, // change in production
    sameSite: "Lax", // change to None in production
  },
};

module.exports= sessionConfig;
