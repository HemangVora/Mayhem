import { NextRequest, NextResponse } from "next/server";

// This is a simplified auth endpoint for development
// In production, this would be replaced with proper Farcaster authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, address } = body;

    if (!username || !address) {
      return NextResponse.json(
        { error: "Missing username or address" },
        { status: 400 }
      );
    }

    // Mock fid (Farcaster ID)
    const mockFid = Math.floor(Math.random() * 1000000);

    // Mock response for development
    return NextResponse.json({
      success: true,
      user: {
        id: `farcaster:${mockFid}`,
        farcasterUserId: mockFid.toString(),
        address,
        username,
        avatar: `https://warpcast.com/~/avatar/${username}`,
        credits: 1000,
        tokensEarned: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        createdAt: new Date(),
      },
      token: "mock-session-token",
    });
  } catch (error) {
    console.error("Error in Farcaster auth:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
