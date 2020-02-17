const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.set("views", path.join(__dirname, "./app/views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: "app/views/layouts",
    partialsDir: "app/views/partials"
  })
);

app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.render("index", {
    title: "Financial Data",
    utilsScript: "/js/utils.js",
    autocompleteScript: "/js/autocomplete.js",
    mainScript: "/js/script.js",
  });
});

app.set("port", process.env.PORT || 5000);
const server = app.listen(port, function() {
  console.log("Express server listening on port " + server.address().port);
});
