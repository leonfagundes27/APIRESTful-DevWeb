import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose";
import methodOverride from "method-override"

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017/joaozao'

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect(url)
.then(() => console.log("Connected MongoDB 🚀"))
.catch((e) => console.log(e));

const User = mongoose.model("Usuario", new mongoose.Schema({
    name: String

}))

app.get("/", (req, res) => {
    res.status(200).send({status: "ok"});
});

app.post("/add", async (req, res) => {
    const username = req.body.name;
    const response = await new User({name: username});
    response.save();

    res.status(201).json('User created succeessful!')
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} ✅`);
});