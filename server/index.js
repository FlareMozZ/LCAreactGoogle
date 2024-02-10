const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('149909023249-chnggqc1ekl5829ebnlsqorma48p8l9f.apps.googleusercontent.com');
const cookieSession = require('cookie-session');

// import the environment variables
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const MONGO_URL = process.env.MONGO;

mongoose.connect('mongodb+srv://ankitpratap04:ankitpapa@cluster0.pkvjlgv.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(()=>{
  console.log("connected to the database succeessfully")
});

// Use this after the variable declaration
// allow cookies to be passed from frontend url
const corsOptions = {
  origin: 'http://localhost:3000',
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

//middleware
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

//to inform passport to use cookie based auth
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //token expires after 30 days
    keys: [process.env.SECRET],
  })
);

// import the routes
require("./routes/users")(app);
require("./routes/questions")(app);

app.post('/api/verify', async (req, res) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: '517490944415-f16rpv2jsslkqeu4bubfc88bppii32gm.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  console.log(payload);

  // You can now use the user's Google ID in your app
});

app.listen(5000, () => {
  console.log("The server is active on :", PORT);
});