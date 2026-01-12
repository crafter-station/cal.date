import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

const size = { width: 1200, height: 630 };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return Response.redirect(new URL("/og.png", request.url), 302);
  }

  const displayName = user.displayName || user.username || "User";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafaf9",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              padding: "60px",
              borderRight: "1px solid #e7e5e4",
            }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                width={180}
                height={180}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  backgroundColor: "#e7e5e4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 72,
                  fontWeight: 300,
                  color: "#a8a29e",
                }}
              >
                {(user.displayName?.[0] || user.username?.[0] || "?").toUpperCase()}
              </div>
            )}

            <div
              style={{
                marginTop: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  color: "#1c1917",
                  letterSpacing: "-0.02em",
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "#78716c",
                  marginTop: 8,
                }}
              >
                @{user.username}
              </div>
            </div>

            {user.bio && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 32,
                  maxWidth: 360,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      backgroundColor: "#d6d3d1",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#a8a29e",
                    }}
                  >
                    About
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      backgroundColor: "#d6d3d1",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#57534e",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  {user.bio.length > 120 ? `${user.bio.slice(0, 120)}...` : user.bio}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              padding: "60px",
              backgroundColor: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#78716c",
                  marginBottom: 24,
                }}
              >
                Book a Date
              </div>

              <div
                style={{
                  width: 200,
                  height: 1,
                  backgroundColor: "#e7e5e4",
                  marginBottom: 40,
                }}
              />

              <div
                style={{
                  fontSize: 64,
                  fontWeight: 600,
                  color: "#1c1917",
                  letterSpacing: "-0.04em",
                }}
              >
                cal.date
              </div>

              <div
                style={{
                  fontSize: 16,
                  color: "#78716c",
                  marginTop: 16,
                }}
              >
                @{user.username}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px",
            borderTop: "1px solid #e7e5e4",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#78716c",
            }}
          >
            Create your profile at cal.date
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 1,
                height: 12,
                backgroundColor: "#d6d3d1",
              }}
            />
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#a8a29e",
              }}
            >
              cal.date
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
