export type User = {
  id: string;
  address: string;
  farcasterUserId?: string;
  username?: string;
  avatar?: string;
  createdAt: Date;
  credits: number;
  tokensEarned: number;
  gamesPlayed: number;
  gamesWon: number;
};

export type Meme = {
  id: string;
  gameId: string;
  creatorId: string;
  name: string;
  ticker: string;
  description: string;
  imageUrl: string;
  votes: number;
  disqualified: boolean;
  createdAt: Date;
  launchedOnChain: boolean;
  contractAddress?: string;
};

export type Game = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  entryLimit: number;
  startTime: Date;
  endTime?: Date;
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  roundDuration: number; // in seconds
  currentRound: number;
  totalRounds: number;
  createdAt: Date;
  participantCount: number;
  memeCount: number;
  winner?: string; // Meme ID of the winner
};

export type GameParticipant = {
  id: string;
  gameId: string;
  userId: string;
  remainingCredits: number;
  isEliminated: boolean;
  joinedAt: Date;
};

export type Vote = {
  id: string;
  gameId: string;
  roundNumber: number;
  memeId: string;
  userId: string;
  credits: number;
  createdAt: Date;
};

export type ChatRoom = {
  id: string;
  ticker: string;
  memeId: string;
  createdAt: Date;
};

export type ChatMessage = {
  id: string;
  chatRoomId: string;
  userId: string;
  content: string;
  createdAt: Date;
};

export type DailyTask = {
  id: string;
  memeId: string;
  description: string;
  rewardAmount: number;
  expiry: Date;
  createdAt: Date;
};

export type TaskCompletion = {
  id: string;
  taskId: string;
  userId: string;
  completedAt: Date;
};
