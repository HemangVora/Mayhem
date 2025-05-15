"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Timer,
  Trophy,
  Plus,
  Minus,
  RefreshCw,
  Users,
  Award,
  Rocket,
  AlertTriangle,
} from "lucide-react";
import { useUserStore, useGameStore } from "../../../store";
import { Game, Meme } from "../../../types";

// Mock active game
const MOCK_GAME: Game = {
  id: "game_3",
  creatorId: "user_3",
  title: "Currently Active Game",
  description: "This game is in progress - join now and vote!",
  entryLimit: 30,
  startTime: new Date(Date.now() - 1800000), // 30 mins ago
  status: "active",
  roundDuration: 60,
  currentRound: 1,
  totalRounds: 3,
  createdAt: new Date(Date.now() - 172800000), // 2 days ago
  participantCount: 25,
  memeCount: 18,
};

// Mock memes for the current round
const MOCK_ROUND_MEMES: Meme[] = [
  {
    id: "meme_3",
    gameId: "game_3",
    creatorId: "user_5",
    name: "Base Ape",
    ticker: "BAPE",
    description: "When you see your portfolio soar on Base chain!",
    imageUrl: "https://placehold.co/400x400/456123/ffffff?text=BAPE",
    votes: 250,
    disqualified: false,
    createdAt: new Date(Date.now() - 86400000),
    launchedOnChain: false,
  },
  {
    id: "meme_4",
    gameId: "game_3",
    creatorId: "user_6",
    name: "Rekt Bulls",
    ticker: "REKT",
    description: "For all those who bought the top and never sold!",
    imageUrl: "https://placehold.co/400x400/883322/ffffff?text=REKT",
    votes: 185,
    disqualified: false,
    createdAt: new Date(Date.now() - 86400000),
    launchedOnChain: false,
  },
  {
    id: "meme_5",
    gameId: "game_3",
    creatorId: "user_7",
    name: "Gas Fee Crier",
    ticker: "GAS",
    description: "When you spend more on gas than your actual transaction!",
    imageUrl: "https://placehold.co/400x400/337744/ffffff?text=GAS",
    votes: 120,
    disqualified: false,
    createdAt: new Date(Date.now() - 86400000),
    launchedOnChain: false,
  },
  {
    id: "meme_6",
    gameId: "game_3",
    creatorId: "user_8",
    name: "Diamond Hands",
    ticker: "DIAMD",
    description: "HODL through the dumps, through the pumps, through it all!",
    imageUrl: "https://placehold.co/400x400/1122aa/ffffff?text=DIAMD",
    votes: 310,
    disqualified: false,
    createdAt: new Date(Date.now() - 86400000),
    launchedOnChain: false,
  },
];

export default function GamePlayPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserStore();
  const {
    activeGame,
    currentRoundMemes,
    remainingCredits,
    userVotes,
    setActiveGame,
    setCurrentRoundMemes,
    setRemainingCredits,
    addVote,
    resetVotes,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [roundEnded, setRoundEnded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [winners, setWinners] = useState<Meme[]>([]);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  const [finalWinner, setFinalWinner] = useState<Meme | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Initialize game state
  useEffect(() => {
    // In a real app, this would be fetched from the API
    setActiveGame(MOCK_GAME);
    setCurrentRoundMemes(MOCK_ROUND_MEMES);
    resetVotes();

    // Start the round timer
    const initialTime = MOCK_GAME.roundDuration;
    setTimeLeft(initialTime);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Timer effect
  useEffect(() => {
    if (!timeLeft) {
      // When timer reaches zero
      setRoundEnded(true);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Handle voting for a meme
  const handleVote = useCallback(
    (memeId: string, amount: number) => {
      if (roundEnded) return;

      // Only allow voting if user has enough credits
      if (remainingCredits >= amount) {
        addVote(memeId, amount);
      }
    },
    [remainingCredits, addVote, roundEnded]
  );

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate vote percentage for a meme
  const calculateVotePercentage = (memeId: string) => {
    const totalVotes = Object.values(userVotes).reduce(
      (sum, votes) => sum + votes,
      0
    );
    if (totalVotes === 0) return 0;

    const memeVotes = userVotes[memeId] || 0;
    return Math.round((memeVotes / totalVotes) * 100);
  };

  // End current round and show results
  const endRound = useCallback(() => {
    setRoundEnded(true);
    setShowResults(true);

    // Determine winners (in a real app this would come from the server)
    // For demo, we'll use the top 2 memes with the most user votes
    const sortedMemes = [...currentRoundMemes].sort((a, b) => {
      const aVotes = userVotes[a.id] || 0;
      const bVotes = userVotes[b.id] || 0;
      return bVotes - aVotes;
    });

    const roundWinners = sortedMemes.slice(0, 2);
    setWinners(roundWinners);

    // If this is the final round, show the final winner
    if (activeGame?.currentRound === activeGame?.totalRounds) {
      setFinalWinner(roundWinners[0]);

      // Show the winner screen after a delay
      setTimeout(() => {
        setShowWinnerScreen(true);
      }, 3000);
    }
  }, [activeGame, currentRoundMemes, userVotes]);

  // Auto-end round when timer expires
  useEffect(() => {
    if (timeLeft === 0 && !roundEnded) {
      endRound();
    }
  }, [timeLeft, roundEnded, endRound]);

  // For the next round (in a real app this would fetch new memes)
  const startNextRound = () => {
    if (!activeGame) return;

    // Update game state
    setActiveGame({
      ...activeGame,
      currentRound: activeGame.currentRound + 1,
    });

    // Reset state for the next round
    setShowResults(false);
    setRoundEnded(false);
    resetVotes();
    setTimeLeft(activeGame.roundDuration);

    // In a real app, we would fetch new memes for the next round
    // For demo, we'll just use the winners as the next round memes
    setCurrentRoundMemes(winners);
  };

  // If game is not loaded yet
  if (!activeGame) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  // Show the final winner screen
  if (showWinnerScreen && finalWinner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-orange-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="mb-6">
            <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">We Have a Winner!</h1>
            <p className="text-xl text-gray-300">The community has spoken!</p>
          </div>

          <div className="bg-gray-800 rounded-xl overflow-hidden mb-8">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src={finalWinner.imageUrl}
                alt={finalWinner.name}
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{finalWinner.name}</h2>
                <span className="bg-gray-700 px-2 py-0.5 rounded text-sm">
                  ${finalWinner.ticker}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{finalWinner.description}</p>

              <div className="flex justify-center items-center text-yellow-400 font-bold">
                <Award className="mr-2 h-5 w-5" />
                <span>Game Champion</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg">
              {finalWinner.name} will now be launched as a token on Base Chain!
            </p>
            <div className="bg-orange-800 rounded-lg p-4 text-sm">
              <p className="mb-2 font-medium">What happens next:</p>
              <ul className="space-y-2 text-left list-disc list-inside text-gray-300">
                <li>Token contract is being deployed on Base Chain</li>
                <li>Liquidity pool will be created</li>
                <li>
                  Participants will receive tokens based on their participation
                </li>
                <li>
                  A chat room will be opened for ${finalWinner.ticker} holders
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/games"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              href={`/games/${activeGame.id}`}
              className="inline-flex items-center text-gray-400 hover:text-white mb-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Game
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">
              {activeGame.title}
            </h1>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">
              Round {activeGame.currentRound} of {activeGame.totalRounds}
            </div>
            <div
              className={`font-mono text-xl font-bold ${
                timeLeft < 10 ? "text-red-500 animate-pulse" : "text-white"
              }`}
            >
              <Timer className="inline-block mr-1 h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Credits Counter */}
        <div className="bg-gray-800 rounded-lg p-3 flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-400" />
            <span className="text-gray-300">Your voting credits:</span>
          </div>
          <div className="font-bold text-xl">{remainingCredits}</div>
        </div>

        {/* Round Results Banner */}
        {showResults && (
          <div className="bg-gradient-to-r from-purple-900 to-orange-900 rounded-lg p-4 mb-6 text-center">
            <h2 className="text-xl font-bold mb-2">
              Round {activeGame.currentRound} Results
            </h2>
            <p className="text-gray-300 mb-4">
              {winners.length > 0
                ? `${winners.length} memes are advancing to the next round!`
                : "No memes received enough votes to advance."}
            </p>

            {activeGame.currentRound < activeGame.totalRounds ? (
              <button
                onClick={startNextRound}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Round {activeGame.currentRound + 1}
              </button>
            ) : (
              <div className="text-center text-yellow-400 animate-pulse">
                <Trophy className="inline-block mr-2 h-5 w-5" />
                Determining the final winner...
              </div>
            )}
          </div>
        )}

        {/* Warning Banner if round ended but not showing results */}
        {roundEnded && !showResults && (
          <div className="bg-orange-900 rounded-lg p-4 mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 text-orange-300" />
            <div>
              <p className="font-medium">
                Round {activeGame.currentRound} has ended!
              </p>
              <p className="text-sm text-gray-300">
                The results are being calculated...
              </p>
            </div>
          </div>
        )}

        {/* Memes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {currentRoundMemes.map((meme) => (
            <div
              key={meme.id}
              className={`bg-gray-800 rounded-xl overflow-hidden ${
                showResults && winners.some((w) => w.id === meme.id)
                  ? "ring-2 ring-yellow-400"
                  : ""
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={meme.imageUrl}
                  alt={meme.name}
                  layout="fill"
                  objectFit="cover"
                />

                {/* Winner Badge */}
                {showResults && winners.some((w) => w.id === meme.id) && (
                  <div className="absolute top-0 right-0 m-2 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                    <Trophy className="h-3 w-3 mr-1" />
                    Advancing
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
                <p className="text-gray-300 text-sm mb-4">{meme.description}</p>

                {/* Voting Controls */}
                <div className="flex flex-col space-y-3">
                  {!roundEnded ? (
                    <>
                      {/* Vote Amount Controls */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleVote(meme.id, 10)}
                            disabled={remainingCredits < 10}
                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleVote(meme.id, 50)}
                            disabled={remainingCredits < 50}
                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleVote(meme.id, 100)}
                            disabled={remainingCredits < 100}
                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                          >
                            +100
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold">
                            {userVotes[meme.id] || 0}
                          </span>
                          <span className="text-gray-400 text-sm ml-1">
                            credits
                          </span>
                        </div>
                      </div>

                      {/* Vote Button */}
                      <button
                        onClick={() => handleVote(meme.id, 1)}
                        disabled={remainingCredits < 1}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add 1 Vote
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Results Display */}
                      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-orange-500 transition-all duration-500 ease-out"
                          style={{
                            width: `${calculateVotePercentage(meme.id)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{userVotes[meme.id] || 0} credits</span>
                        <span>
                          {calculateVotePercentage(meme.id)}% of your votes
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Round Controls */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {!roundEnded
              ? `Vote for your favorite memes! You have ${remainingCredits} credits left.`
              : "Round completed! Wait for the next round to start."}
          </div>

          {!roundEnded && timeLeft > 0 && (
            <button
              onClick={endRound}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              End Round Early
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
