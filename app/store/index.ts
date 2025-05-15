"use client";

import { create } from "zustand";
import { Game, Meme, User } from "../types";

interface GameStore {
  activeGame: Game | null;
  currentRoundMemes: Meme[];
  remainingCredits: number;
  userVotes: Record<string, number>; // memeId -> credits
  setActiveGame: (game: Game | null) => void;
  setCurrentRoundMemes: (memes: Meme[]) => void;
  setRemainingCredits: (credits: number) => void;
  addVote: (memeId: string, credits: number) => void;
  resetVotes: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  activeGame: null,
  currentRoundMemes: [],
  remainingCredits: 1000,
  userVotes: {},
  setActiveGame: (game) => set({ activeGame: game }),
  setCurrentRoundMemes: (memes) => set({ currentRoundMemes: memes }),
  setRemainingCredits: (credits) => set({ remainingCredits: credits }),
  addVote: (memeId, credits) =>
    set((state) => {
      const currentVotes = state.userVotes[memeId] || 0;
      const updatedVotes = {
        ...state.userVotes,
        [memeId]: currentVotes + credits,
      };
      const newRemainingCredits = state.remainingCredits - credits;

      return {
        userVotes: updatedVotes,
        remainingCredits:
          newRemainingCredits >= 0
            ? newRemainingCredits
            : state.remainingCredits,
      };
    }),
  resetVotes: () => set({ userVotes: {}, remainingCredits: 1000 }),
}));

interface UserStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));
