// REQUIRE ALL NEEDED PACKAGES
const express = require("express"); // SERVER
const hbs = require("hbs"); // TEMPLATING
const mongoose = require("mongoose"); // MONGODB
const bodyParser = require("body-parser"); // FORM INPUT ENCODER
const session = require("express-session"); // SESSIONS
const multer = require("multer"); // FILE UPLOADS
const UserModel = require("./models/user"); // SELF-MADE USER SCHEMA/MODEL

// FOR EVERYTHING THAT HAD TO DO WITH MONGOOSE/SCHEMA'S/MODELS ETC. I USED THE OFFICIAL MONGOOSE DOCUMENTATION: https://mongoosejs.com/docs/guide.html

require("dotenv").config(); // CONFIGURATING ENV FILE TO BLOCK OUT SENSITIVE INFORMATION FOR WHEN I COMMIT MY PROJECT TO GITHUB
// SOURCE: https://www.npmjs.com/package/dotenv

// THE URL TO MY DATABASE
const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/test?retryWrites=true&w=majority`;
// SOURCE: THE MONGODB DOCUMENTATION/GETTING STARTED GUIDE

// WRITING ALL OTHER VARIABLES
const app = express();

// USING MULTER: UPLOADING IMAGES TO PROFILES
// SOURCE: https://www.npmjs.com/package/multer
const upload = multer({
  dest: "public/uploads/", // THE DESTINATION FOLDER FOR UPLOADED IMAGES
  limits: { fileSize: 5000000 }, // PUTTING A LIMIT ON FILE SIZE
  fileFilter: function fileFilter(req, file, cb) {
    // CREATING A FUNCTION TO FILTER OUT ALLOWED FILES WITH A CALLBACK
    if (file.mimetype === "image/png") {
      // MIMETYPE HAS TO BE IMAGE/PNG, IMAGE/JPEG (OR IMAGE/JPG) FOR THE CALLBACK TO RETURN TRUE
      cb(null, true);
    } else if (file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      // IF THE MIMETYPE IS ANYTHING ELSE, CALLBACK WILL RETURN FALSE
      cb(null, false);
    }
  },
});

// CREATING SETTINGS

// THE VIEW ENGINE IS HBS (HANDLEBARS FOR EXPRESS)
app.set("view engine", "hbs"); // IT GIVES A res.render TO RENDER A FILE AND SEND IT TO THE BROWSER

// CREATNG PARTIALS
hbs.registerPartials(__dirname + "/views/partials", (error) => {
  // USING _dirname TO CREATE ABSOLUTE PATHS
  console.error(error);
});

// USING AND CALLING MIDDLEWARES

app.use(express.static("public")); // SERVING STATIC FILES IN THE PUBLIC MAP (IMAGES, STYLESHEET, ETC.)

app.use(bodyParser.urlencoded({ extended: false })); // bodyParser IS USED FO PARSE FORM DATA

app.use(
  // THIS MIDDLEWARE FUNCTION MAKES IT POSSIBLE TO SAVE DATA (SESSION DATA LIKE A userId) INBETWEEN REQUESTS
  session({
    secret: "uir3948uri934i9320oi",
    resave: false,
    saveUninitialized: true,
  })
);

// APPLYING SESSION MIDDLEWARE IN AN ASYNCHRONOUS FUNCTION
// SOURCE: https://github.com/expressjs/session
app.use(async (req, res, next) => {
  if (req.session.userId) {
    const user = await UserModel.findById(req.session.userId) // ALL INFORMATION ABOUT THE LOGGED IN USER WILL BE AVAILABLE UNDER REQ.USER
      .populate("matches") // POPULATE (MONGOOSE SYNTAX) QUERIES ALL MATCHES FROM THE USER COLLECTION
      .exec(); // THIS IS USED TO EXECUTE THE QUERY
    if (user) {
      req.user = user;
    }
  }
  next(); // USING next(); TO PASS TO THE NEXT MIDDLEWARE FUNCTION
});

// ROUTE TO THE HOMEPASE
app.get("/", async (req, res) => {
  const users = await UserModel.find({}).exec(); // LOOKING FOR ALL USERS IN UserModel TO MAKE THEM AVAILABLE IN A DROP DOWN IN THE HEADER TO SWITCH USERS/ACCOUNTS
  res.render("index", {
    // RENDERING THE INDEX PAGE
    title: "Chat Overview Page", // GIVING IT A SPECIFIC TITLE FOR INSIDE THE HEAD (USED TEMPLATE FOR THIS IN .hbs FILE)
    users, // THE USERS AVAILABLE IN THE DROP DOWN MENU
    matches: req.user ? req.user.matches : null, // CHECKING IF A USER IS LOGGED IN TO SHOW ITS MATCHES. IF THE USER IS NOT LOGGED IN, null WILL BE RETURNED TO MAKE SURE NO MATCHES ARE VISIBLE
  });
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const user = await UserModel.findById(req.body.userId).exec(); // CHECKING IF THE PROVIDED USER EXISTS IN THE DATABASE
  if (user) {
    // AND IF THE USER EXISTS IN THE DATABASE, THE userId WILL BE SET AND THE SESSION VARIABLE WILL BE RETURNED TO THE USER
    req.session.userId = user._id; // USING user._id BECAUSE THE user._id IN MY DATABASE IS MORE RELIABLE THAN THE req.body.userId IN THE BODY BECAUSE THAT ONE COMES FROM THE USER.
  }
  res.redirect("/"); // AFTER SELECTING A USER, YOU GET REDIRECTED TO THE HOMEPAGE
});

// EDIT PROFILE ROUTE
app.get("/edit-profile", async (req, res) => {
  if (!req.user) {
    // IF A USER IS NOT LOGGED IN, YOU WILL BE REDIRECTED TO THE HOMEPAGE AGAIN
    res.redirect("/");
    return;
  }
  res.render("edit-profile", {
    // RENDERING EDIT-PROFILE PAGE
    title: "Edit Profile Page", // GIVING THE PAGE ITS OWN HEAD TITLE
    // making sure it contains the req.user properties (name and age) in the input fields
    user: req.user, // MAKING SURE IT CONTAINS THE req.user PROPERTIES LIKE NAME AND AGE IN THE INPUT FIELD
  });
});

// POST METHOD ROUTE ON EDIT-PROFILE
app.post("/edit-profile", upload.single("profilepicture"), async (req, res) => {
  console.log(req.body);
  // USED FOR MULTIPLE THINGS, ONE OF THEM MAKING UPLOADING PICTURES POSSIBLE
  if (!req.user) {
    // IF THE USER IS NOT LOGGED IN, THE USER WILL BE REDIRECTED TO THE HOMEPAGE
    res.redirect("/");
    return;
  }

  // MAKING A DELETE ACCOUNT BUTTON AVAILABLE
  if (req.body.deleteAccount === "on") {
    // IF THE CHECKBOX IS CHECKED ON
    await UserModel.deleteOne({ _id: req.user._id }), req.session.destroy(); // DELETING THE USER CONNECTED TO THE ID AND DESTROYING THE SESSION
    res.redirect("/"); // AFTERWARDS, THE USER WILL BE REDIRECTED TO THE HOMEPAGE
    return;
  }
  // SOURCE ABOUT DELETE WITH MONGOOSE: https://mongoosejs.com/docs/models.html#deleting

  // ALL INFORMATION THAT IS RECEIVED THROUGH req.body USING body-parser WILL BE STORED INSIDE req.user AND PLACES INSIDE THE DATABASE
  if (req.file) {
    req.user.profilepicture = req.file.filename; // PROFILE PICTURE
  }
  req.user.name = req.body.name; // NAME
  req.user.age = req.body.age; // AGE
  req.user.favoriteBooks = req.body.books; // ARRAY OF TOP 3 BOOKS
  req.user.currentBook = req.body.currentBook; // CURRENT BOOK
  await req.user.save(); // SAVE BUTTON
  res.render("edit-profile", {
    // RENDERING THE UPDATED EDIT-PROFILE PAGE
    title: "Edit Profile Page",
    user: req.user,
  });
});

// RUNNING THE APPLICATION
async function run() {
  // WAITING FOR MONGOOSE BEFORE ACTUALLY STARTING THE SERVER
  await mongoose.connect(MONGO_URL, {
    // AVOIDING DEPRECATION WARNINGS
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // THE EXPRESS SERVER WILL RUN ON PORT 8000
  app.listen(process.env.PORT || 8000, () => {
    // THIS IMMEDIATELY GIVES YOU THE URL TO CLICK OPEN THROUGH THE TERMINAL
    console.log("Your app is now running on http://localhost:8000");
  });
}

// DO NOT FORGET TO RUN THE FUNCTION
// THIS IS NEEDED BECAUSE mongoose.connect USES AWAIT AND THEREFORE IT CAN NOT BE AT THE TOP-LEVEL SCOPE AND SHOULD BE INSIDE AN ASYNC FUNCTION
run();
