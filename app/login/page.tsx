"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { useUserStore } from "../store";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<
    "options" | "farcaster" | "connecting" | "success"
  >("options");
  const { setCurrentUser, setIsAuthenticated } = useUserStore();

  const handleFarcasterLogin = async () => {
    setLoginStep("connecting");
    setIsLoading(true);

    try {
      // Use NextAuth.js signIn method
      const result = await signIn("farcaster", {
        username: "demo_user",
        address: "0x1234567890123456789012345678901234567890",
        redirect: false,
      });

      if (result?.ok) {
        // Set local user state for immediate UI updates
        setCurrentUser({
          id: "farcaster:123456",
          farcasterUserId: "123456",
          username: "demo_user",
          address: "0x1234567890123456789012345678901234567890",
          avatar: `https://warpcast.com/~/avatar/demo_user`,
          credits: 1000,
          tokensEarned: 0,
          gamesPlayed: 0,
          gamesWon: 0,
          createdAt: new Date(),
        });
        setIsAuthenticated(true);
        setLoginStep("success");

        // Redirect after a short delay to show success state
        setTimeout(() => {
          router.push("/games");
        }, 1500);
      } else {
        // Handle error
        setLoginStep("farcaster");
        console.error("Login failed:", result?.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStep("farcaster");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect to Mayhem</h1>
          <p className="text-gray-400">
            Connect your account to start battling
          </p>
        </div>

        {/* Login Options */}
        {loginStep === "options" && (
          <div className="space-y-4">
            <button
              onClick={() => setLoginStep("farcaster")}
              className="w-full py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <span>Connect with Farcaster</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>

            <div className="w-full">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  return (
                    <div
                      className="w-full"
                      {...(!mounted && {
                        "aria-hidden": true,
                      })}
                    >
                      {(() => {
                        if (!mounted || !account || !chain) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="w-full py-3 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center"
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={openAccountModal}
                            className="w-full py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center"
                          >
                            {account.displayName}
                          </button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        )}

        {/* Farcaster Login */}
        {loginStep === "farcaster" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-lg mb-4">
                Connect with your Farcaster account
              </p>
              <p className="text-sm text-gray-400 mb-6">
                This is a demo version with a simulated login
              </p>

              <button
                onClick={handleFarcasterLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>Continue with Farcaster</>
                )}
              </button>
            </div>

            <button
              onClick={() => setLoginStep("options")}
              className="w-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to options
            </button>
          </div>
        )}

        {/* Connecting Status */}
        {loginStep === "connecting" && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-lg">Connecting to Farcaster...</p>
            <p className="text-sm text-gray-400 mt-2">
              Please wait while we establish connection
            </p>
          </div>
        )}

        {/* Success */}
        {loginStep === "success" && (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold">Successfully connected!</p>
            <p className="text-sm text-gray-400 mt-2">
              Redirecting you to the app...
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link
              href="https://www.farcaster.xyz/"
              className="text-purple-400 hover:underline"
              target="_blank"
            >
              Create one on Farcaster
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
