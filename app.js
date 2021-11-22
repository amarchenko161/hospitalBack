const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const { secret } = require("./config");


const userSchema = new Schema({
  login: { type: String },
  password: { type: String },
});

const appointmentSchema = new Schema({
  name: { type: String },
  doctor: { type: String },
  date: { type: String },
  complaint: { type: String }
});

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://todoDB:restart987@cluster0.lnnws.mongodb.net/hospitalDB?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model("hospitalUser", userSchema);
const Appointment = mongoose.model("hospitalAppointment", appointmentSchema);

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

app.post("/singin", (req, res) => {
  if (req.body.hasOwnProperty("login") && req.body.hasOwnProperty("password")) {
    User.findOne({ login: req.body.login }).then((result) => {
      if (result) {
        const checkPassword = bcrypt.compareSync(
          req.body.password,
          result.password
        );
        if (!checkPassword) {
          res.status(404).send("error password");
        } else {
          const token = generateAccessToken(result._id);
          res.send(token);
        }
      } else {
        res.status(404).send("error login");
      }
    });
  } else {
    res.status(404).send("Error");
  }
});

app.post("/createUser", (req, res) => {
  if (req.body.hasOwnProperty("login") && req.body.hasOwnProperty("password")) {
    const hashPassword = bcrypt.hashSync(req.body.password, 6);
    const user = new User({ login: req.body.login, password: hashPassword });
    User.findOne({ login: req.body.login }).then((result) => {
      if (result) {
        res.status(404).send("err");
      } else {
        user.save().then((result) => {
          res.send({ data: result });
        });
      }
    });
  } else {
    res.status(404).send("Error");
  }
});

app.post("/createAppointment", (req, res) => {
  if (
    req.body.hasOwnProperty("name") &&
    req.body.hasOwnProperty("doctor") &&
    req.body.hasOwnProperty("date") &&
    req.body.hasOwnProperty("complaint")
  ) {
    const appointment = new Appointment(req.body);
    appointment.save().then((result) => {
      res.send ({data:result});
    })
  } else {
    res.status(404).send("Error");
  }
});

app.get("/allAppointment", (req, res) => {
  Appointment.find().then((result) => {
    res.send({ data: result });
  });
});

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
