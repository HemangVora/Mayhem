import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    farcasterUserId?: string;
    address?: string;
    credits?: number;
    tokensEarned?: number;
    gamesPlayed?: number;
    gamesWon?: number;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      farcasterUserId?: string;
      address?: string;
      credits?: number;
      tokensEarned?: number;
      gamesPlayed?: number;
      gamesWon?: number;
    };
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    farcasterUserId?: string;
    address?: string;
    credits?: number;
    tokensEarned?: number;
    gamesPlayed?: number;
    gamesWon?: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "farcaster",
      name: "Farcaster",
      credentials: {
        username: { label: "Username", type: "text" },
        address: { label: "Address", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.address) {
          return null;
        }

        try {
          // Call our Farcaster authentication API
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/farcaster`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.username,
                address: credentials.address,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            return {
              id: data.user.id,
              name: data.user.username,
              image: data.user.avatar,
              farcasterUserId: data.user.farcasterUserId,
              address: data.user.address,
              credits: data.user.credits,
              tokensEarned: data.user.tokensEarned,
              gamesPlayed: data.user.gamesPlayed,
              gamesWon: data.user.gamesWon,
            };
          }
          return null;
        } catch (error) {
          console.error("Error in Farcaster auth:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      // Send user properties to the client
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.farcasterUserId) {
        session.user.farcasterUserId = token.farcasterUserId;
      }
      if (token.address) {
        session.user.address = token.address;
      }
      if (token.credits) {
        session.user.credits = token.credits;
      }
      if (token.tokensEarned) {
        session.user.tokensEarned = token.tokensEarned;
      }
      if (token.gamesPlayed) {
        session.user.gamesPlayed = token.gamesPlayed;
      }
      if (token.gamesWon) {
        session.user.gamesWon = token.gamesWon;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user data to the token when signing in
      if (user) {
        token.farcasterUserId = user.farcasterUserId;
        token.address = user.address;
        token.credits = user.credits;
        token.tokensEarned = user.tokensEarned;
        token.gamesPlayed = user.gamesPlayed;
        token.gamesWon = user.gamesWon;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
