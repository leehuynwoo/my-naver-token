import express from "express";
import bodyParser from "body-parser";
import naverTokenHandler from "./api/naver-token.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/naver-token", naverTokenHandler);
app.get("/api/naver-token", naverTokenHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Naver API server running on http://0.0.0.0:${PORT}`);
});
