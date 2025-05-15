"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store";
import { Calendar, Clock, Users, InfoIcon, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CreateGame() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [entryLimit, setEntryLimit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [roundDuration, setRoundDuration] = useState(60); // in seconds
  const [totalRounds, setTotalRounds] = useState(3);

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate start time from date and time inputs
      const startDateTime = new Date(`${startDate}T${startTime}`);

      // In a real app, this would be an API call to create a game
      // For now, we'll just simulate a success response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockGameId = `game_${Math.random().toString(36).substring(2, 9)}`;

      // Redirect to the game page
      router.push(`/games/${mockGameId}`);
    } catch (error) {
      console.error("Error creating game:", error);
      setIsSubmitting(false);
    }
  };

  const getStartTimeDisplay = () => {
    if (!startDate || !startTime) return "Not scheduled";

    try {
      const date = new Date(`${startDate}T${startTime}`);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/games"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Create a Memecoin Battle
          </h1>
          <p className="text-gray-400 mt-2">
            Set up your game and invite meme communities to participate
          </p>
        </div>

        {/* Create Game Form */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Game Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Game Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Epic Meme Showdown"
                  className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
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
                  placeholder="Describe your game and any special rules..."
                  rows={4}
                  className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              {/* Entry Limit */}
              <div>
                <label
                  htmlFor="entryLimit"
                  className="block text-sm font-medium mb-1"
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Entry Limit</span>
                    <div className="relative group ml-2">
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                      <div className="absolute left-0 -top-2 transform -translate-y-full w-64 bg-gray-900 p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Maximum number of memes that can be submitted to your
                        game
                      </div>
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  id="entryLimit"
                  min="2"
                  max="100"
                  value={entryLimit}
                  onChange={(e) => setEntryLimit(parseInt(e.target.value))}
                  className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              {/* Game Timing */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium mb-1"
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Start Date</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium mb-1"
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Start Time</span>
                    </div>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Round Settings */}
              <div className="grid md:grid-cols-2 gap-4 pb-2">
                <div>
                  <label
                    htmlFor="roundDuration"
                    className="block text-sm font-medium mb-1"
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Round Duration (seconds)</span>
                    </div>
                  </label>
                  <select
                    id="roundDuration"
                    value={roundDuration}
                    onChange={(e) => setRoundDuration(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                    <option value="90">90 seconds</option>
                    <option value="120">120 seconds</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="totalRounds"
                    className="block text-sm font-medium mb-1"
                  >
                    <div className="flex items-center">
                      <span>Total Rounds</span>
                      <div className="relative group ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                        <div className="absolute left-0 -top-2 transform -translate-y-full w-64 bg-gray-900 p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Total number of elimination rounds before a winner is
                          declared
                        </div>
                      </div>
                    </div>
                  </label>
                  <select
                    id="totalRounds"
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="2">2 rounds</option>
                    <option value="3">3 rounds</option>
                    <option value="4">4 rounds</option>
                    <option value="5">5 rounds</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-700 rounded-lg p-4 mt-6">
                <h3 className="font-medium mb-2">Game Summary</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>
                    Entry Limit:{" "}
                    <span className="text-white">{entryLimit} memes</span>
                  </li>
                  <li>
                    Starts:{" "}
                    <span className="text-white">{getStartTimeDisplay()}</span>
                  </li>
                  <li>
                    Format:{" "}
                    <span className="text-white">
                      {totalRounds} rounds, {roundDuration} seconds each
                    </span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !title ||
                    !description ||
                    !startDate ||
                    !startTime
                  }
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:from-purple-700 hover:to-orange-600"
                >
                  {isSubmitting ? "Creating Game..." : "Create Game"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
