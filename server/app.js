import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import methodOverride from "method-override";

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017/joaozao';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB 🚀"))
  .catch((e) => console.log(e));

const User = mongoose.model("Usuario", new mongoose.Schema({
  name: String,
  age: Number,
  color: String
}));

app.get("/", async (req, res) => {
    const users = await User.find();
    console.log("Users found:", users);
    res.status(200).json(users);
  });
  

app.post("/add", async (req, res) => {
  const { name, age, color } = req.body;

  if (!name || !age || !color) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  const newUser = new User({ name, age, color });
  await newUser.save();

  res.status(201).json({ msg: "User created successfully!" });
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await User.findByIdAndUpdate(id, data);
  res.status(200).send({ msg: "User updated successfully!" });
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await User.findByIdAndDelete(id);
  res.send({ msg: "User deleted!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} ✅`);
});
