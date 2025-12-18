import { Request, Response } from "express";
import axios from "axios";
import { getNaverAccessToken } from "../lib/naverAuth.js";

export default async function originProductsHandler(
  req: Request,
  res: Response
) {
  try {
    const token = await getNaverAccessToken();
    const allProducts: any[] = [];
    const pageSize = 50;
    let currentPage = 1;

    const firstResponse = await axios.post(
      "https://api.commerce.naver.com/external/v1/products/search",
      {
        page: currentPage,
        size: pageSize,
        ...req.body,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { totalElements = 0, contents = [] } = firstResponse.data;
    allProducts.push(...contents);

    const MAX_PAGES = 100;
    const totalPages = Math.min(
      Math.ceil(totalElements / pageSize),
      MAX_PAGES
    );

    for (currentPage = 2; currentPage <= totalPages; currentPage++) {
      const nextResponse = await axios.post(
        "https://api.commerce.naver.com/external/v1/products/search",
        {
          page: currentPage,
          size: pageSize,
          ...req.body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (nextResponse.data.contents) {
        allProducts.push(...nextResponse.data.contents);
      }

      await new Promise(r => setTimeout(r, 120)); // Rate limit 보호
    }

    return res.status(200).json({
      totalElements: allProducts.length,
      contents: allProducts,
    });
  } catch (error: any) {
    console.error("❌ origin-products error:", error?.response?.data || error);

    return res.status(error?.response?.status || 500).json({
      message: "Failed to fetch all origin products",
      error: error?.response?.data || error.message,
    });
  }
}
