import express from "express";
import bodyParser from "body-parser";
import naverTokenHandler from "./api/naver-token.js";
import categoriesHandler from "./api/categories.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/naver-token", naverTokenHandler);
app.post("/api/naver-token", naverTokenHandler);

app.get("/api/categories", categoriesHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Naver API server running on http://0.0.0.0:${PORT}`);
});
