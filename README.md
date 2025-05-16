# Mayhem - Memecoin Battles

Mayhem is a web3 application for creating and participating in memecoin battles on Base chain. Users can submit memes, vote for their favorites, and winners get launched as real tokens with utility.

## Features

- **Create Games**: Creators can set up memecoin battles with custom settings
- **Submit Memes**: Users can submit memes with name, ticker, image, and description
- **Vote in Rounds**: Players use credits to vote on their favorite memes
- **Launch on Chain**: Winning memes get launched as tokens on Base chain
- **Community Chat**: Each token gets a dedicated chat room
- **Daily Tasks**: Complete tasks to earn more tokens and build community

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Authentication**: Farcaster Auth, Web3 Wallet Connection (RainbowKit)
- **Blockchain**: Base Chain, Ethereum (via ethers.js)
- **State Management**: Zustand
- **Styling**: TailwindCSS

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A Farcaster account (for authentication)
- A Web3 wallet (for blockchain interactions)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mayhem.git
   cd mayhem
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:

   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_APP_DOMAIN=mayhem.xyz
   NEXT_PUBLIC_APP_URI=https://mayhem.xyz
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Core Workflows

### For Creators

1. Create a game specifying entry limit, start time, and round settings
2. Wait for meme submissions
3. Moderate submissions based on community guidelines
4. When game starts, creators can monitor the rounds
5. After the final round, the winning meme is launched as a token

### For Players

1. Browse and join upcoming games
2. Submit memes to games before they start
3. Vote for favorite memes during active rounds
4. Earn tokens based on participation and voting
5. Join token communities and complete daily tasks

## Project Structure

- `/app` - Next.js app directory
  - `/api` - API endpoints
  - `/components` - Reusable UI components
  - `/games` - Game-related pages
  - `/chat` - Token community chat rooms
  - `/store` - Zustand state management
  - `/types` - TypeScript type definitions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
