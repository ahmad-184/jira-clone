import chroma from "chroma-js";

export function getTextColor(hex: string) {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate perceived brightness (human eye sensitivity)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Threshold: Values above 150 are "light", use black text; else white
  return brightness > 150 ? "#000000" : "#FFFFFF";
}

export function nameToColor(tagName: string, baseHex: string = "#738291") {
  // 1. Hash the tag name to a number (DJB2 algorithm)
  let hash = 5381;
  for (let i = 0; i < tagName.length; i++) {
    hash = (hash * 33) ^ tagName.charCodeAt(i);
  }
  hash = Math.abs(hash);

  // 2. Convert hash to HSL values
  const hue = hash % 360; // 0-359° for full rainbow
  const saturation = 70; // High saturation for vibrancy
  // const lightness = hash % 2 === 0 ? 25 : 75; // 25% (dark) or 75% (light)
  const lightness = 25; // 25% (dark) or 75% (light)

  // 3. Convert HSL to hex
  const color = chroma.hsl(hue, saturation / 100, lightness / 100).hex();

  // 4. Ensure contrast with base color (optional adjustment)
  const baseLightness = chroma(baseHex).get("hsl.l");
  if (Math.abs(lightness / 100 - baseLightness) < 0.3) {
    // If too close to base, flip lightness
    return chroma
      .hsl(hue, saturation / 100, (lightness === 25 ? 75 : 25) / 100)
      .hex();
  }

  return color;
}
