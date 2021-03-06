const express = require("express");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./modules/user/User.Route");

const db = require("./middleware/key").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const store = new MongoDBSession({
  uri: db,
  collection: "mySesions",
});

app.use(
  session({
    secret: "ssshhhhh",
    store: store,
    saveUninitialized: false,
    resave: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    //origin: "https://react-login-ui.herokuapp.com",
    origin: "http://localhost:3000",
    credentials: "include",
  })
);

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.render("landing");
});

app.use("/", router);

app.use((req, res, next) => {
  const error = new Error("Not found s");
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`App Started on PORT ${process.env.PORT || 8000}`);
});
