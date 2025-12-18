
import { Request, Response } from "express";
import axios from "axios";
import { getNaverAccessToken } from "../lib/naverAuth.js";

export default async function originProductsHandler(
  req: Request,
  res: Response
) {
  try {
    const token = await getNaverAccessToken();

    /**
     * 클라이언트에서 그대로 body를 넘김
     * 예:
     * {
     *   "page": 1,
     *   "size": 500,
     *   "productStatusTypes": ["SALE"]
     * }
     */
    const body = req.body || {};

    const response = await axios.post(
      "https://api.commerce.naver.com/external/v2/products/origin-products",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json;charset=UTF-8",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("❌ origin-products error:", error?.response?.data || error);

    return res.status(error?.response?.status || 500).json({
      message: "Failed to fetch origin products",
      error: error?.response?.data || error.message,
    });
  }
}
