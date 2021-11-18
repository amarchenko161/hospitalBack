const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: String,
  password: String,
});

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://todoDB:restart987@cluster0.lnnws.mongodb.net/hospitalDB?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const User = mongoose.model("hospitalUser", userSchema);

app.post("/createUser", (req, res) => {
  if (req.body.hasOwnProperty("login") && req.body.hasOwnProperty("password")) {
    User.findOne({ login: req.body.login }).then((result) => {
      if (result) {
        res.status(404).send("err");
      } else {
        const user = new User(req.body);
        user.save().then((result) => {
          res.send({ data: result });
        });
      }
    });
  } else {
    res.status(404).send("Error");
  }
});

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
