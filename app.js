const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const checkAuthenticationCookie = require("./middleware/authetication");
require("dotenv").config()


//middelwares
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(checkAuthenticationCookie('token'))

const cors = require('cors');





// database
main()
  .then(() => console.log("connected database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}


// // CORS configuration
const corsOption = {
  origin: ['http://localhost:8080', 'https://life-style-blog-app.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOption));
// routes
app.use("/", require("./routes/user"));
app.use("/", require("./routes/blog"));

const PORT=process.env.PORT || 8080

app.listen(PORT, () => {
  console.log("server started");
});
