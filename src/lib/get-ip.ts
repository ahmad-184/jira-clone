import { headers } from "next/headers";

export async function getIp() {
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const realIp = (await headers()).get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
}
