import { getNaverAccessToken } from "../lib/naverAuth.js";

export default async function handler(req: any, res: any) {
  try {
    const token = await getNaverAccessToken();
    return res.status(200).json({ access_token: token });
  } catch (err: any) {
    return res.status(500).json({
      error: "네이버 토큰 발급 실패",
      detail: err.message,
    });
  }
}
