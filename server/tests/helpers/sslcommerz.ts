import { createHash } from "node:crypto";

export const signSslcommerzPayload = (payload: Record<string, string>) => {
  const params: Record<string, string> = { ...payload };
  delete params["store_id"];
  delete params["store_passwd"];
  delete params["verify_sign"];

  const hashString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("md5").update(hashString).digest("hex");
};
