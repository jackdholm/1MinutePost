# 1MinutePost

A simple anonymous posting board where only show for 10 minutes unless upvoted. Upvoted posts have their time increased by 1 minute per vote, but all posts are removed at midnight every 24 hours.

## Tech Stack

- **Backend:** ASP.NET Core (.NET 8)
- **Frontend:** Angular
- **Database:** SQLite
- **Auth:** JWT

## Projects

- **1MinutePost** — The main web application serving the API and Angular frontend.
- **1MinutePost_Update** — A lightweight cleanup process that deletes all posts. Run this on a schedule (e.g., via cron or Task Scheduler).

## Getting Started

1. Install [.NET SDK](https://dotnet.microsoft.com/) and [Node.js](https://nodejs.org/).
2. Install Angular dependencies:
   ```bash
   cd 1MinutePost/ClientApp
   npm install
   ```
3. Run the app:
   ```bash
   cd 1MinutePost
   dotnet run
   ```
   The app will be available at `http://localhost:5008`.

## Configuration

Connection strings and environment-specific settings are in `appsettings.json` and `appsettings.Production.json`.

## Features

- Anonymous posting — no account required to read or vote
- Posts expire automatically after 10 minutes
- User registration and login for attributed posts
- Upvote system
