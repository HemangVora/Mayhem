import Link from "next/link";
import { ArrowRight, Rocket, Trophy, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-orange-500">
            Mayhem: Memecoin Battles
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            Create or participate in memecoin battles on Base chain. The best
            memes get launched as tokens with real utility.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/games"
              className="px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all"
            >
              Find Games
            </Link>
            <Link
              href="/create"
              className="px-8 py-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all"
            >
              Create Game
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="mb-4 bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Create a Game</h3>
            <p className="text-gray-300">
              Creators set up memecoin battles with custom entry limits,
              scheduling, and competition rules.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="mb-4 bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Participate</h3>
            <p className="text-gray-300">
              Players join games, submit memes, and vote with credits. The best
              memes advance through rounds.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="mb-4 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Win Rewards</h3>
            <p className="text-gray-300">
              Winning memes get launched on Base chain as tokens. Players earn
              based on participation and performance.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-900 to-orange-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Jump In?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with your Farcaster account and start creating or
            participating in memecoin battles today.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-purple-900 hover:bg-gray-100 font-bold transition-all"
          >
            Get Started <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
