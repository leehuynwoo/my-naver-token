import * as dotenv from "dotenv";

dotenv.config({
  path: "/home/ssm-user/my-naver-token/.env",
});



import express from "express";
import bodyParser from "body-parser";
import naverTokenHandler from "./api/naver-token.js";
import categoriesHandler from "./api/categories.js";
import originProductsHandler from "./api/origin-products.ts";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/naver-token", naverTokenHandler);
app.post("/api/naver-token", naverTokenHandler);

app.get("/api/categories", categoriesHandler);
// ✅ 원상품 전체/검색 조회
app.post("/api/origin-products", originProductsHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Naver API server running on http://0.0.0.0:${PORT}`);
});
