import axios from "axios";
import * as bcrypt from "bcryptjs";

export async function getNaverAccessToken() {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing NAVER env variables");
  }

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
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}
