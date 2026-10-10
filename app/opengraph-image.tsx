import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — wholesale coffee for cafés`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ESPRESSO = "#17120e";
const CREMA = "#f4ede4";
const GOLD = "#d4af37";

// The link preview shown when the site is shared on social and chat apps.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: ESPRESSO,
          color: CREMA,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="104" height="104" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="14" fill={ESPRESSO} />
            <rect
              x="1.5"
              y="1.5"
              width="61"
              height="61"
              rx="12.5"
              stroke={GOLD}
              strokeWidth="1.5"
            />
            <path
              d="M12 19v26M26 19 13.5 32 26 45"
              stroke={GOLD}
              strokeWidth="5.5"
              strokeLinejoin="bevel"
            />
            <path
              d="m32 19 9.5 26L51 19"
              stroke={CREMA}
              strokeWidth="5.5"
              strokeLinejoin="bevel"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Kavara</div>
            <div style={{ fontSize: 22, letterSpacing: 10, color: GOLD }}>
              ROASTERS
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            Small-lot coffee, roasted to order for your café.
          </div>
          <div style={{ fontSize: 30, color: GOLD }}>
            Wholesale tier pricing · Orders from 5kg
          </div>
        </div>
      </div>
    ),
    size
  );
}
