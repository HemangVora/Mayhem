"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Filter,
  Calendar,
  Users,
  ChevronRight,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Game } from "../types";

// Mock data for the games list
const MOCK_GAMES: Game[] = [
  {
    id: "game_1",
    creatorId: "user_1",
    title: "Meme Royale: Crypto Edition",
    description:
      "The ultimate showdown of crypto memes. Submit your best crypto-related humor!",
    entryLimit: 20,
    startTime: new Date(Date.now() + 86400000), // tomorrow
    status: "scheduled",
    roundDuration: 60,
    currentRound: 0,
    totalRounds: 3,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    participantCount: 7,
    memeCount: 12,
  },
  {
    id: "game_2",
    creatorId: "user_2",
    title: "Base Chain Battles",
    description: "Only the most hilarious Base chain memes will survive!",
    entryLimit: 15,
    startTime: new Date(Date.now() + 172800000), // 2 days from now
    status: "scheduled",
    roundDuration: 90,
    currentRound: 0,
    totalRounds: 4,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    participantCount: 3,
    memeCount: 5,
  },
  {
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
  },
  {
    id: "game_4",
    creatorId: "user_1",
    title: "Completed Demo Game",
    description: "This game has already finished - check out the winning meme!",
    entryLimit: 10,
    startTime: new Date(Date.now() - 604800000), // 1 week ago
    endTime: new Date(Date.now() - 600000000), // A bit less than a week ago
    status: "completed",
    roundDuration: 60,
    currentRound: 3,
    totalRounds: 3,
    createdAt: new Date(Date.now() - 864000000), // 10 days ago
    participantCount: 10,
    memeCount: 10,
    winner: "meme_12",
  },
];

export default function GamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "active" | "completed"
  >("all");

  // Fetch games data when component mounts
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    setGames(MOCK_GAMES);
  }, []);

  // Filter games based on selected filter
  const filteredGames = games.filter((game) => {
    if (filter === "all") return true;
    return game.status === filter;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header with create button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Memecoin Battles</h1>
            <p className="text-gray-400 mt-1">
              Join a battle or create your own
            </p>
          </div>

          <Link
            href="/create"
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Game
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center">
          <Filter className="mr-2 h-4 w-4 text-gray-400" />
          <span className="mr-3 text-sm text-gray-400">Filter:</span>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "all"
                  ? "bg-gray-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("scheduled")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "scheduled"
                  ? "bg-blue-900"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "active"
                  ? "bg-green-900"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "completed"
                  ? "bg-orange-900"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Games List */}
        <div className="space-y-4">
          {filteredGames.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400">
                No games found matching your filter
              </p>
            </div>
          ) : (
            filteredGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="block bg-gray-800 hover:bg-gray-750 rounded-xl p-4 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h2 className="font-bold text-xl">{game.title}</h2>
                      {game.status === "active" && (
                        <span className="ml-2 px-2 py-0.5 bg-green-900 text-green-100 text-xs rounded-full animate-pulse">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mt-1 mb-3 line-clamp-2">
                      {game.description}
                    </p>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {game.status === "scheduled" && (
                          <span>
                            Starts{" "}
                            {formatDistanceToNow(game.startTime, {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                        {game.status === "active" && (
                          <span>
                            Started{" "}
                            {formatDistanceToNow(game.startTime, {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                        {game.status === "completed" && game.endTime && (
                          <span>
                            Ended{" "}
                            {formatDistanceToNow(game.endTime, {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-gray-400" />
                        <span>
                          {game.memeCount}/{game.entryLimit} memes
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-gray-400" />
                        <span>
                          {game.totalRounds} rounds, {game.roundDuration}s each
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-4 flex items-center self-end">
                    <div className="mr-2 text-right">
                      <div className="text-sm font-medium">
                        {game.status === "scheduled" && "Join Game"}
                        {game.status === "active" && "Play Now"}
                        {game.status === "completed" && "View Results"}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
