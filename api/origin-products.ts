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
    let currentPage = 1;
    const pageSize = 50; // 한 번에 가져올 최대량 (네이버 제한: 50)

    // 1. 첫 번째 요청을 보내서 전체 개수(totalElements) 파악
    const firstResponse = await axios.post(
      "https://api.commerce.naver.com/external/v1/products/search",
      {
        page: currentPage,
        size: pageSize,
        ...req.body // 필터링 조건이 있다면 포함
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = firstResponse.data;
    const totalElements = data.totalElements || 0;
    
    // 첫 페이지 데이터 추가
    if (data.contents) {
      allProducts.push(...data.contents);
    }

    // 2. 전체 페이지 수 계산 후 반복 루프 실행
    const totalPages = Math.ceil(totalElements / pageSize);

    for (currentPage = 2; currentPage <= totalPages; currentPage++) {
      const nextResponse = await axios.post(
        "https://api.commerce.naver.com/external/v1/products/search",
        {
          page: currentPage,
          size: pageSize,
          ...req.body
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
      
      // (선택 사항) API 과부하 방지를 위한 짧은 대기 (Rate Limit 대응)
      // await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 3. 최종 결과 반환
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