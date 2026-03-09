import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Blog Post";
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "My Blog";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 16, color: "#888" }}>{appName}</div>
        <div style={{ fontSize: 48, fontWeight: 700, textAlign: "center", maxWidth: 900 }}>
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
