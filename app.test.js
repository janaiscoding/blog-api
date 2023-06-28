// SUPERTEST MODULE FOR BACKEND TESTING
const request = require("supertest");
const express = require("express");
const app = express();

const authRouter = require("./routes/authRouter");
const postsRouter = require("./routes/postsRouter");

app.use(express.urlencoded({ extended: false }));
app.use("/", authRouter);
app.use("/posts", postsRouter);

describe("Authentication router", () => {
  test("Testing works as intended", (done) => {
    request(app).get("/").expect("Content-Type", /json/).expect(200, done);
  });
  test("Login responds with 401 when data isn't sent", (done) => {
    request(app).post("/login")
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(401, done)
  });
});
