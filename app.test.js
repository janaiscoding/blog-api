const request = require("supertest")
const express = require("express")
const app = express()
const mongoose = require("mongoose");
require("dotenv").config();

const authRouter = require('./routes/authRouter')
const postsRouter = require('./routes/postsRouter')
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

app.use(express.urlencoded({extended:false}))
app.use("/", authRouter)
app.use("/posts",postsRouter)

test("Auth works", done=>{
    request(app)
    .post('/login')
    .send({"email": "jana.istrate@gmail.com", "password":"parola12"})      
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200).end((err,res)=>{
        if (err) return done(err);
        return done();
    })
})