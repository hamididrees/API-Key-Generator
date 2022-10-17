const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 8000;
require("./db/conn");
const Register = require("./models/register.js");
const staticPath = path.join(__dirname, "../public");
const partialPath = path.join(__dirname, "../templates/partials");
const templatePath = path.join(__dirname, "../templates/views");
const fs = require("fs");
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    // function for creating api key
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
    function generateString(length) {
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.random() * charactersLength);
      }

      return result;
    }

    const apiKey = generateString(25);
    console.log(apiKey);

    //userRegister is the instance of Register
    const userRegister = new Register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      apikey: apiKey,
    });

    await userRegister.save();
    res.render("login");
  } catch (err) {
    res.status(400).send(err);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  //res.render("login");
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);

    //if (userEmail.password === password)
    if (isMatch) {
      res.status(201).render("home", {
        userData: `http://localhost:8000/students/${userEmail.apikey}`,
        key: userEmail.apikey,
        userName: userEmail.name,
      });
    } else {
      res.send("Invalid Login Details !!");
    }
  } catch (err) {
    res.send("Invalid Login Details !!");
  }
});

////////API DATA////////////////////

app.get("/students", async (req, res) => {
  try {
    //const studentsData = await Register.find();
    res.send(
      "<h3>SORRY! You Have Not Access. Register Yourself and Access API Key to Get API Data!</h3>"
    );
  } catch (err) {
    res.send(err);
  }
});

app.get("/studentsdata", async (req, res) => {
  try {
    fs.readFile("../dummyData.json", "utf-8", (err, data) => {
      res.send(data);
    });
    // const studentsData = await Register.find();
    // res.send(studentsData);
  } catch (err) {
    res.send(err);
  }
});

app.get("/students/:_apikey", async (req, res) => {
  try {
    fs.readFile("../dummyData.json", "utf-8", (err, data) => {
      res.send(data);
    });
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`server successfully created on port ${port}`);
});
