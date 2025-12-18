import { Request, Response } from "express";
import axios from "axios";
import { getNaverAccessToken } from "../lib/naverAuth.js";

export default async function originProductsHandler(
  req: Request,
  res: Response
) {
  try {
    const token = await getNaverAccessToken();

    const body = req.body ?? {
      page: 1,
      size: 50,
    };

    const response = await axios.post(
      "https://api.commerce.naver.com/external/v1/products/search",
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
