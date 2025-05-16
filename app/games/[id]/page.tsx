"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Upload,
  Timer,
  ThumbsUp,
  AlertCircle,
  Award,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Game, Meme } from "../../types";
import { useUserStore, useGameStore } from "../../store";

// Mock data for game details
const MOCK_GAME: Game = {
  id: "game_1",
  creatorId: "user_1",
  title: "Meme Royale: Crypto Edition",
  description:
    "The ultimate showdown of crypto memes. Submit your best crypto-related humor and compete for the chance to have your meme launched as a token on Base chain! The community will vote on their favorites in multiple rounds until only one meme remains supreme.",
  entryLimit: 20,
  startTime: new Date(Date.now() + 86400000), // tomorrow
  status: "scheduled",
  roundDuration: 60,
  currentRound: 0,
  totalRounds: 3,
  createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  participantCount: 7,
  memeCount: 2,
};

// Mock memes for this game
const MOCK_MEMES: Meme[] = [
  {
    id: "meme_1",
    gameId: "game_1",
    creatorId: "user_2",
    name: "Degen Moon Boy",
    ticker: "DEGEN",
    description: "For all those who believe any coin will go to the moon!",
    imageUrl: "https://placehold.co/400x400/3d4b94/ffffff?text=DEGEN",
    votes: 120,
    disqualified: false,
    createdAt: new Date(Date.now() - 1800000), // 30 mins ago
    launchedOnChain: false,
  },
  {
    id: "meme_2",
    gameId: "game_1",
    creatorId: "user_3",
    name: "FOMO Sapiens",
    ticker: "FOMO",
    description:
      "The evolved human species that buys high and sells low every time.",
    imageUrl: "https://placehold.co/400x400/94543d/ffffff?text=FOMO",
    votes: 85,
    disqualified: false,
    createdAt: new Date(Date.now() - 2700000), // 45 mins ago
    launchedOnChain: false,
  },
];

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserStore();

  const [game, setGame] = useState<Game | null>(null);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form states for meme submission
  const [memeName, setMemeName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Fetch game data when component mounts
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    setGame(MOCK_GAME);
    setMemes(MOCK_MEMES);
  }, [params.id]);

  const handleSubmitMeme = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a success response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create a new meme object
      const newMeme: Meme = {
        id: `meme_${Math.random().toString(36).substring(2, 9)}`,
        gameId: params.id as string,
        creatorId: currentUser?.id || "unknown",
        name: memeName,
        ticker: ticker.toUpperCase(),
        description,
        imageUrl:
          imageUrl ||
          `https://placehold.co/400x400/${Math.floor(
            Math.random() * 16777215
          ).toString(16)}/ffffff?text=${ticker.toUpperCase()}`,
        votes: 0,
        disqualified: false,
        createdAt: new Date(),
        launchedOnChain: false,
      };

      // Add the new meme to the list
      setMemes((prevMemes) => [...prevMemes, newMeme]);

      // Update the game's meme count
      setGame((prevGame) => {
        if (!prevGame) return null;
        return {
          ...prevGame,
          memeCount: (prevGame.memeCount || 0) + 1,
        };
      });

      // Reset form and close modal
      setMemeName("");
      setTicker("");
      setDescription("");
      setImageUrl("");
      setShowSubmitModal(false);
    } catch (error) {
      console.error("Error submitting meme:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If game not found or still loading
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading game details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/games"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl md:text-4xl font-bold">{game.title}</h1>
                {game.status === "active" && (
                  <span className="ml-3 px-2 py-0.5 bg-green-900 text-green-100 text-xs rounded-full animate-pulse">
                    Live
                  </span>
                )}
                {game.status === "scheduled" && (
                  <span className="ml-3 px-2 py-0.5 bg-blue-900 text-blue-100 text-xs rounded-full">
                    Upcoming
                  </span>
                )}
                {game.status === "completed" && (
                  <span className="ml-3 px-2 py-0.5 bg-orange-900 text-orange-100 text-xs rounded-full">
                    Completed
                  </span>
                )}
              </div>
            </div>

            {game.status === "scheduled" && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                disabled={game.memeCount >= game.entryLimit}
              >
                <Upload className="mr-2 h-4 w-4" />
                Submit Meme
              </button>
            )}

            {game.status === "active" && (
              <Link
                href={`/games/${game.id}/play`}
                className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Timer className="mr-2 h-4 w-4" />
                Join Battle
              </Link>
            )}
          </div>
        </div>

        {/* Game Details */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <p className="text-gray-300 mb-6">{game.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-300 mb-1">
                <Calendar className="mr-2 h-5 w-5" />
                <span className="font-medium">Game Timing</span>
              </div>
              <div className="ml-7">
                {game.status === "scheduled" && (
                  <div className="text-white text-lg font-semibold">
                    Starts{" "}
                    {formatDistanceToNow(game.startTime, { addSuffix: true })}
                  </div>
                )}
                {game.status === "active" && (
                  <div className="text-white text-lg font-semibold">
                    Started{" "}
                    {formatDistanceToNow(game.startTime, { addSuffix: true })}
                  </div>
                )}
                {game.status === "completed" && game.endTime && (
                  <div className="text-white text-lg font-semibold">
                    Ended{" "}
                    {formatDistanceToNow(game.endTime, { addSuffix: true })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-300 mb-1">
                <Users className="mr-2 h-5 w-5" />
                <span className="font-medium">Participation</span>
              </div>
              <div className="ml-7">
                <div className="text-white text-lg font-semibold">
                  {game.memeCount}/{game.entryLimit} memes submitted
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-300 mb-1">
                <Clock className="mr-2 h-5 w-5" />
                <span className="font-medium">Game Format</span>
              </div>
              <div className="ml-7">
                <div className="text-white text-lg font-semibold">
                  {game.totalRounds} rounds, {game.roundDuration}s each
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memes Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Submitted Memes</h2>

          {memes.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-4">
                No memes have been submitted yet
              </p>
              {game.status === "scheduled" && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Be the first to submit
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme) => (
                <div
                  key={meme.id}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors"
                >
                  <div className="relative aspect-square">
                    <img
                      src={meme.imageUrl}
                      alt={meme.name}
                      className="w-full"
                    />
                    {meme.disqualified && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
                          <p className="text-white font-bold">Disqualified</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{meme.name}</h3>
                      <span className="bg-gray-700 px-2 py-0.5 rounded text-sm">
                        ${meme.ticker}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {meme.description}
                    </p>

                    {game.status !== "scheduled" && (
                      <div className="flex items-center text-sm text-gray-300">
                        <ThumbsUp className="mr-1 h-4 w-4 text-purple-400" />
                        <span>{meme.votes} votes</span>

                        {game.winner === meme.id && (
                          <div className="ml-auto flex items-center text-yellow-400">
                            <Award className="mr-1 h-4 w-4" />
                            <span>Winner</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Meme Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Submit Your Meme</h2>

            <form onSubmit={handleSubmitMeme}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="memeName"
                    className="block text-sm font-medium mb-1"
                  >
                    Meme Name
                  </label>
                  <input
                    type="text"
                    id="memeName"
                    value={memeName}
                    onChange={(e) => setMemeName(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                    placeholder="e.g., Diamond Paws"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ticker"
                    className="block text-sm font-medium mb-1"
                  >
                    Ticker Symbol
                  </label>
                  <input
                    type="text"
                    id="ticker"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                    placeholder="e.g., PAWS"
                    maxLength={5}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 5 characters, will be displayed as $
                    {ticker.toUpperCase()}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                    placeholder="Describe your meme..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-medium mb-1"
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg (Optional)"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    If left blank, a placeholder will be generated
                  </p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !memeName || !ticker || !description
                    }
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Meme"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
