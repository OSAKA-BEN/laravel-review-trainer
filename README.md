# Laravel Review Trainer

A web application designed to help developers improve their code review skills by analyzing Laravel code snippets and identifying security vulnerabilities, logic errors, and bad practices.

## Features

- **Interactive Code Challenges**: Review real-world Laravel code snippets with intentional issues
- **Multiple Difficulty Levels**: Easy, Medium, and Hard challenges to progressively build your skills
- **Line-by-Line Analysis**: Click on specific lines to flag potential issues
- **Detailed Explanations**: Learn why each issue is problematic and how to fix it
- **Syntax Highlighting**: PHP code is displayed with proper syntax highlighting for better readability

## Challenge Categories

The challenges cover common Laravel security and quality issues including:

- **Security Vulnerabilities**
  - SQL Injection
  - Mass Assignment
  - Insecure File Uploads
  - Timing Attacks
  - User Enumeration
  - Credential Exposure

- **Best Practices**
  - Password Hashing
  - Input Validation
  - Proper Authentication Checks
  - N+1 Query Problems

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with custom styling
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/laravel-review-trainer.git
   cd laravel-review-trainer
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
src/
├── app/
│   ├── challenge/[id]/   # Dynamic challenge pages
│   ├── page.tsx          # Home page with challenge list
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components (Button, Card, Dialog, Badge)
│   ├── ChallengeList.tsx # Challenge grid display
│   ├── CodeViewer.tsx    # Interactive code display with line selection
│   └── ResultModal.tsx   # Results and explanations modal
├── data/
│   └── challenges.json   # Challenge definitions and solutions
├── lib/
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript type definitions
```

## How It Works

1. Select a challenge from the home page
2. Review the Laravel code snippet displayed with syntax highlighting
3. Click on lines you believe contain issues
4. Submit your review to see your score
5. Learn from detailed explanations of each issue

## Contributing

Contributions are welcome! You can help by:

- Adding new challenges to `src/data/challenges.json`
- Improving existing challenge explanations
- Enhancing the UI/UX
- Fixing bugs

## License

MIT
