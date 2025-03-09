# IEM_360_codeCraft

**Website Link:** https://iem-360-code-craft.vercel.app/

**Video persentation:** https://youtu.be/phcfvQmt9Os

## Project Overview

Managing bus drivers manually leads to inefficiencies, errors, and high operational costs. Scheduling, attendance tracking, performance monitoring, and route assignments are often disorganized, affecting safety and compliance. A _Bus Driver Management System_ will streamline these processes, improve communication, reduce costs, and enhance overall efficiency.

IEM_360_codeCraft is a web application to solve the problem built using **Vite, React, and TypeScript**, with **Tailwind CSS and ShadCN** for styling. The backend is powered by **Firebase**, and environment variables are managed using a `.env` file.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/codewithrishab404/IEM_360_codeCraft
cd IEM_360_codeCraft
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Setup Environment Variables

A sample `.env.sample` file is provided. Create a `.env` file and update it with your **Firebase credentials**:

```sh
cp .env.sample .env
```

Edit the `.env` file and fill in the required Firebase configuration details from your Firebase project settings.

### 4. Initialize Tailwind CSS & ShadCN

[Tailwind setup docs](https://tailwindcss.com/docs/installation/using-vite)
[ShadCN setup docs](https://ui.shadcn.com/docs/installation/vite)

Ensure Tailwind CSS and ShadCN are set up correctly. If needed, run:

```sh
npx shadcn-ui@latest init
```

### 5. Start the Development Server

```sh
npm run dev
```

This will start the Vite development server temporarily. The app should now be accessible at `http://localhost:5173/`.

## Firebase Setup Guide

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a Web App and copy the Firebase config.
4. Update your `.env` file with the required Firebase credentials.
5. Enable Firestore and Authentication.

## Build for Production

To create a production-ready build, run:

```sh
npm run build
```

This generates an optimized build in the `dist/` directory.

## Contact

For queries, reach out to **rishabmallick20004@gmail.com** or open an issue on GitHub.
