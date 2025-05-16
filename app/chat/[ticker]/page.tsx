"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send,
  ArrowLeft,
  MessageSquare,
  Trophy,
  BadgeCheck,
  Calendar,
  Users,
  Gift,
} from "lucide-react";
import { useUserStore } from "../../store";
import { ChatMessage, DailyTask } from "../../types";
import { formatDistanceToNow } from "date-fns";

// Mock data for chat messages
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    chatRoomId: "room_degen",
    userId: "user_1",
    content: "Hey everyone! Welcome to the $DEGEN community chat!",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "msg_2",
    chatRoomId: "room_degen",
    userId: "user_2",
    content:
      "Thanks for creating this amazing meme! I've been holding since launch.",
    createdAt: new Date(Date.now() - 3000000), // 50 minutes ago
  },
  {
    id: "msg_3",
    chatRoomId: "room_degen",
    userId: "user_3",
    content: "When do we get liquidity information? I want to add more!",
    createdAt: new Date(Date.now() - 2400000), // 40 minutes ago
  },
  {
    id: "msg_4",
    chatRoomId: "room_degen",
    userId: "user_1",
    content:
      "Liquidity was added to Base chain about 30 minutes after launch. Check the pinned post for contract details.",
    createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
  },
  {
    id: "msg_5",
    chatRoomId: "room_degen",
    userId: "user_4",
    content: "Just completed the daily task! Got my airdrop, super easy.",
    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
  },
];

// Mock daily tasks
const MOCK_TASKS: DailyTask[] = [
  {
    id: "task_1",
    memeId: "meme_1",
    description:
      "Share your $DEGEN holdings on Farcaster with the hashtag #DegenMoon",
    rewardAmount: 100,
    expiry: new Date(Date.now() + 86400000), // 24 hours from now
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "task_2",
    memeId: "meme_1",
    description: "Provide liquidity to the $DEGEN pool on Base chain",
    rewardAmount: 500,
    expiry: new Date(Date.now() + 86400000), // 24 hours from now
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
];

// Mock user data
const MOCK_USERS: Record<
  string,
  {
    username: string;
    isCreator: boolean;
    isVerified: boolean;
    tokenHolding: number;
  }
> = {
  user_1: {
    username: "degen_creator",
    isCreator: true,
    isVerified: true,
    tokenHolding: 25000,
  },
  user_2: {
    username: "crypto_fan",
    isCreator: false,
    isVerified: false,
    tokenHolding: 5000,
  },
  user_3: {
    username: "moon_boy",
    isCreator: false,
    isVerified: false,
    tokenHolding: 1000,
  },
  user_4: {
    username: "hodl_gang",
    isCreator: false,
    isVerified: true,
    tokenHolding: 15000,
  },
};

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticker, setTicker] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [userStats, setUserStats] = useState({
    tokenHolding: 0,
    isCreator: false,
    isVerified: false,
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Initialize chat data
  useEffect(() => {
    const tickerParam =
      typeof params.ticker === "string" ? params.ticker.toUpperCase() : "";
    setTicker(tickerParam);

    // In a real app, this would be fetched from the API
    // For now, we'll use the mock data
    setMessages(MOCK_MESSAGES);
    setTasks(MOCK_TASKS);

    // Mock user stats
    if (currentUser) {
      const userInfo = MOCK_USERS[currentUser.id] || {
        username: currentUser.username || "anonymous",
        isCreator: false,
        isVerified: false,
        tokenHolding: 0,
      };

      setUserStats({
        tokenHolding: userInfo.tokenHolding,
        isCreator: userInfo.isCreator,
        isVerified: userInfo.isVerified,
      });
    }
  }, [params.ticker, currentUser]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatRoomId: `room_${ticker.toLowerCase()}`,
      userId: currentUser.id,
      content: newMessage.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  // Complete a daily task
  const handleCompleteTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) return;

    // In a real app, this would be an API call
    setCompletedTasks((prev) => [...prev, taskId]);

    // Find the task to get the reward amount
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      // Update user token holdings (in a real app, this would update the blockchain)
      setUserStats((prev) => ({
        ...prev,
        tokenHolding: prev.tokenHolding + task.rewardAmount,
      }));

      // Add a system message
      const systemMsg: ChatMessage = {
        id: `msg_system_${Date.now()}`,
        chatRoomId: `room_${ticker.toLowerCase()}`,
        userId: "system",
        content: `🎉 ${currentUser?.username || "User"} completed the task "${
          task.description
        }" and earned ${task.rewardAmount} $${ticker} tokens!`,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, systemMsg]);
    }
  };

  // Format the created at date
  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/games"
                className="mr-3 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold">${ticker} Community</h1>
            </div>

            <div className="flex items-center text-sm">
              <span className="bg-gray-700 px-2 py-1 rounded-lg flex items-center">
                <Users className="h-4 w-4 mr-1 text-purple-400" />
                <span>{Object.keys(MOCK_USERS).length} online</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row container mx-auto max-w-5xl p-4 gap-4">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-800 rounded-xl overflow-hidden min-h-[400px] order-2 md:order-1">
          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.userId === "system"
                      ? "justify-center"
                      : message.userId === currentUser?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.userId === "system" ? (
                    <div className="bg-gray-700 px-3 py-2 rounded-lg text-sm text-gray-300 max-w-[80%]">
                      {message.content}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] ${
                        message.userId === currentUser?.id
                          ? "bg-purple-600"
                          : "bg-gray-700"
                      } rounded-xl px-4 py-3`}
                    >
                      <div className="flex items-center gap-1 mb-1 text-sm">
                        <span className="font-medium">
                          {MOCK_USERS[message.userId]?.username || "Anonymous"}
                        </span>

                        {MOCK_USERS[message.userId]?.isCreator && (
                          <span className="ml-1 bg-purple-700 text-purple-100 rounded-full text-xs px-2 py-0.5 flex items-center">
                            <Trophy className="h-3 w-3 mr-1" />
                            Creator
                          </span>
                        )}

                        {MOCK_USERS[message.userId]?.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <p>{message.content}</p>
                      <div className="text-xs text-gray-300 mt-1 text-right">
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-700 p-3">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message the ${ticker} community...`}
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-4 flex items-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-80 space-y-4 order-1 md:order-2">
          {/* User Stats */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="font-bold text-lg mb-3">Your ${ticker} Stats</h2>
            <div className="bg-gray-700 rounded-lg p-3 mb-3">
              <div className="text-sm text-gray-300 mb-1">Your balance</div>
              <div className="text-2xl font-bold">
                {userStats.tokenHolding.toLocaleString()} ${ticker}
              </div>
            </div>

            <div className="text-sm flex justify-between">
              <span className="text-gray-300">Community rank</span>
              <span className="font-medium">
                {userStats.tokenHolding > 10000
                  ? "Whale 🐋"
                  : userStats.tokenHolding > 5000
                  ? "Dolphin 🐬"
                  : userStats.tokenHolding > 1000
                  ? "Fish 🐟"
                  : "Shrimp 🦐"}
              </span>
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Daily Tasks</h2>
              <div className="text-xs text-gray-400 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Resets in 24h
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-600 rounded-full p-2 mt-1">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-2">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-400">
                          +{task.rewardAmount} ${ticker}
                        </span>
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={completedTasks.includes(task.id)}
                          className={`px-3 py-1 rounded text-sm ${
                            completedTasks.includes(task.id)
                              ? "bg-green-800 text-green-100 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {completedTasks.includes(task.id)
                            ? "Completed"
                            : "Complete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token Information */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="font-bold text-lg mb-3">Token Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Contract</span>
                <span className="font-mono text-purple-400">0x1234...5678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Supply</span>
                <span>1,000,000 ${ticker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Holders</span>
                <span>152</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Chain</span>
                <span>Base</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  View on BaseScan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
