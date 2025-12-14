import axios from "axios";
import * as bcrypt from "bcryptjs";

export default async function handler(req: any, res: any) {
  try {
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Missing NAVER env variables" });
    }

    // ✅ 서버 outbound IP 확인 (중요)
    const ipCheck = await axios.get("https://api.ipify.org?format=json");
    console.log("🚨 서버 outbound IP:", ipCheck.data.ip);

    const timestamp = Date.now().toString();
    const password = `${clientId}_${timestamp}`;

    const hash = bcrypt.hashSync(password, clientSecret);
    const clientSecretSign = Buffer.from(hash).toString("base64");

    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      timestamp,
      client_secret_sign: clientSecretSign,
      type: "SELF",
    });

    const response = await axios.post(
      "https://api.commerce.naver.com/external/v1/oauth2/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.status(200).json(response.data);
  } catch (err: any) {
    return res.status(500).json({
      error: "네이버 토큰 발급 실패",
      detail: err.response?.data || err.message,
    });
  }
}
