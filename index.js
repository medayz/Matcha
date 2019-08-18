const express = require("express");
const app = express();
const PORT = process.env.PORT || 1337;
const cors = require("cors");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const genuuid = require("uuid");
const FileStore = require("session-file-store")(session);

app.disable("x-powered-by");
app.use(cors());
// app.use(cookieParser());

app.use(
  session({
    genid: function(req) {
      return genuuid(); // use UUIDs for session IDs
    },
    resave: false,
    saveUninitialized: false,
    secret: "testets",
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 60000
    },
    store: new FileStore(),
    name: "matchaCookie"
  })
);
app.use("/api", require("./routes"));

app.get("/", (req, res) => {
  res.send("Hello World from 1337!");
});

app.use((req, response, next) => {
  response.status(404).json({
    status: 404,
    message: "Resources not found!"
  });
});

app.use((req, res, next) => {
  response.status(500).json({
    status: 500,
    message: "Resources not found!"
  });
});

app.listen(PORT, () => console.log(`running on port ${PORT}...`));
