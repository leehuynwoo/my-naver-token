import axios from "axios";
import { getNaverAccessToken } from "../lib/naverAuth.js";

export default async function categoriesHandler(req, res) {
  try {
    const token = await getNaverAccessToken();
    const { last } = req.query;

    const response = await axios.get(
      "https://api.commerce.naver.com/external/v1/categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json;charset=UTF-8",
        },
        params: last ? { last: last === "true" } : {},
      }
    );

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({
      error: "카테고리 조회 실패",
      detail: err.response?.data || err.message,
    });
  }
}
