const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/apiKey")
.then(() => {console.log("DB Connect Successfully")})
.catch((err) => {console.log(err)});