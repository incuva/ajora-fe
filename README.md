# Àjọrà — Coming Soon

A premium, community-driven collective buying platform — where pooled demand meets structured commerce. Experience transparent, trust-first cooperative growth.

## 🚀 Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Fonts:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) & [Montserrat](https://fonts.google.com/specimen/Montserrat) via `next/font`

## 🛠️ Project Structure

```text
src/
├── app/
│   ├── layout.tsx     # Root layout & font configuration
│   ├── page.tsx       # Main landing page
│   └── globals.css    # Global styles & Tailwind v4 theme
└── components/
    └── home/          # Modularized landing page components
        ├── footer.tsx
        ├── header.tsx
        ├── icons.tsx
        ├── logo-mark.tsx
        └── pillar.tsx
```

## 🎨 Design System

The project uses a custom design system defined in `src/app/globals.css` using Tailwind v4's `@theme` directive.

- **Primary Green:** `#114B3A` (`--color-green`)
- **Accent Gold:** `#C89B3C` (`--color-gold`)
- **Background:** `#F7F7F5` (`--color-bg`)
- **Text:** `#1C1C1C` / `#6A6A6A`

## 🏁 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ajora-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Collaborative Guidelines

- **Styling:** Use Tailwind CSS utility classes. Avoid arbitrary values where possible by leveraging the theme tokens in `globals.css`.
- **Components:** Keep components modular and placed in `src/components`.
- **Animations:** Use `framer-motion` for all interactive and entrance animations.
- **Commits:** Follow conventional commit messages (e.g., `feat:`, `fix:`, `refactor:`, `docs:`).

## 📄 License

© 2026 Àjọrà by Basorun (Ibadan) Forerunner Interest-Free Cooperative Investment and Credit Society Limited. All rights reserved.
