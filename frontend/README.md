# Smart Cafeteria System - Frontend

A modern, performant frontend application for the Smart Cafeteria Management System built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture Overview](#-architecture-overview)
- [Available Scripts](#-available-scripts)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19.2.3 |
| **Styling** | Tailwind CSS v4, tailwindcss-animate |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **State Management** | Zustand 5 (with persist middleware) |
| **Server State** | TanStack React Query 5 |
| **Forms** | React Hook Form 7 + Zod 4 |
| **HTTP Client** | Axios (with axios-retry) |
| **Animations** | GSAP 3 |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Date Utilities** | date-fns 4 |

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **pnpm** >= 10.x (package manager)

> ⚠️ This project uses **pnpm** as the package manager. Using npm or yarn may cause dependency resolution issues.

### Installing pnpm

```bash
# Using npm
npm install -g pnpm

# Using Homebrew (macOS)
brew install pnpm

# Using corepack (recommended)
corepack enable
corepack prepare pnpm@latest --activate
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Smart-Cafeteria-System/frontend
```

### 2. Run the Scripts in /scripts

#### macOS / Linux
```bash
./scripts/init.sh
```

#### Windows
```bash
.\scripts\init.ps1
```

### 3. Run Development Server

```bash
pnpm dev
```

The application will be available at **http://localhost:3000**

## 📁 Project Structure

```
frontend/
├── examples/                 # Reference implementations & patterns
│   ├── components/           # Example dumb/presentational components
│   ├── features/             # Example feature components with forms
│   ├── hooks/                # Example custom hooks (React Query)
│   ├── services/             # Example API service modules
│   ├── stores/               # Example Zustand stores
│   └── types/                # Example TypeScript type definitions
│
├── public/                   # Static assets (images, fonts, etc.)
│
├── src/
│   ├── app/                  # Next.js App Router (pages & layouts)
│   │   ├── layout.tsx        # Root layout component
│   │   └── page.tsx          # Home page
│   │
│   ├── components/           # Reusable UI components
│   │   └── ui/               # shadcn/ui components (Button, Input, etc.)
│   │
│   ├── features/             # Feature-specific components
│   │
│   ├── hooks/                # Custom React hooks
│   │
│   ├── lib/                  # Utility functions & configurations
│   │   ├── api.ts            # Axios instance & interceptors
│   │   └── routes.ts         # API route constants
│   │
│   ├── services/             # API service modules
│   │
│   ├── stores/               # Zustand state stores
│   │   ├── auth.store.ts     # Authentication state
│   │   └── useMaintenanceStore.ts
│   │
│   ├── styles/               # Global styles
│   │   ├── globals.css       # Tailwind & CSS variables
│   │   └── index.css
│   │
│   └── types/                # TypeScript type definitions
│
├── scripts/                  # Build & utility scripts
├── .env.example              # Environment variables template
├── components.json           # shadcn/ui configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

---

## 🏗 Architecture Overview

### State Management Strategy

| Type | Tool | Use Case |
|------|------|----------|
| **Server State** | TanStack React Query | API data fetching, caching, synchronization |
| **Client State** | Zustand | UI state, authentication, local preferences |
| **Form State** | React Hook Form | Form inputs, validation, submission |

### API Layer

The project uses a centralized Axios instance with:
- **Automatic retry** for failed requests (429, 408 errors)
- **Request interceptors** for authentication headers
- **Response interceptors** for error handling & toast notifications
- **Credentials support** for cookie-based authentication

### Component Patterns

1. **Dumb/Presentational Components** (`components/`)
   - Pure UI, no business logic
   - Receive data via props
   - Highly reusable

2. **Feature Components** (`features/`)
   - Business logic included
   - Use hooks for data fetching
   - Feature-specific

3. **UI Components** (`components/ui/`)
   - shadcn/ui base components
   - Built on Radix UI primitives
   - Customizable via Tailwind

---


## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint for code quality checks | 

---


**Happy Coding! 🚀**
