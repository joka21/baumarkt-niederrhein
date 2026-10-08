import { iconBild } from "@/lib/icon-bild";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Ohne Rundung: iOS schneidet die Ecken selbst ab.
export default function AppleIcon() {
  return iconBild(180, 0);
}
