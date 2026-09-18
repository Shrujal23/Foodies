# Foodies

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Foodies is a full-stack recipe-sharing app for home cooks. People can discover recipes, publish their own dishes, save favourites, leave ratings and cooking notes, and organise recipes into collections.

I built this project while learning full-stack development. It is a practical space to explore how a React frontend, an Express API, MySQL, authentication, uploads, and external APIs work together. It is still growing, but the main user flows are usable today.

**Live app:** [foodies-dusky-sigma.vercel.app](https://foodies-dusky-sigma.vercel.app)

> The hosted API may occasionally be offline while I work on a more reliable hosting setup. If the live site has no data, running the project locally is the best option.

## Why this project exists

Food is one of the easiest ways for people to share culture, memories, and everyday knowledge. Foodies aims to make recipe discovery and sharing simple for people of different ages, different communities and background, cooking experience levels, and backgrounds—from someone learning their first meal to someone passing on a family favourite.

This project is intended to stay open source. The code is available under the MIT License, so people can learn from it, suggest improvements, and build on it. The longer-term goal is to grow it into a friendly, community-led place for discovering and sharing recipes, without making the experience feel difficult or exclusive.

### Principles I want Foodies to follow

- **Simple to use:** Recipes and core actions should be easy to understand, even for a first-time visitor.
- **Open to learn from:** The code, setup notes, and decisions should be understandable for learners and contributors.
- **Community-first:** People should be able to share their own recipes, tips, and cooking experiences respectfully.
- **Inclusive by design:** The interface should work well on phones, use clear language, and keep improving for different needs and abilities.
- **Respectful of creators:** Contributors should share original content or clearly credit sources. Do not copy recipe articles, photos, or instructions from other sites without permission.

## What is available as of now

- Create an account and sign in with email and password
- Browse recipes shared by the community
- Search community recipes and, when configured, Edamam recipe results
- Add, edit, and delete your own recipes with an image
- Save recipes to favourites and collections
- Rate recipes and add cooking notes in the discussion section
- View your profile, dashboard, and recent activity
- Ask the optional “Foody” AI helper for cooking ideas or anything     related to cooking
- Use the admin area to manage users, recipes, reviews, and collections

## Built with

| Area | Technology |
| --- | --- |
| Frontend | React, React Router, Context API, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MySQL |
| Authentication | JWT stored in an httpOnly cookie; Passport for optional OAuth |
| File uploads | Multer |
| Recipe search | Edamam API (optional) |
| AI helper | Groq API (optional) |
| Local containers | Docker Compose |

## Project structure

```text
project/
├── backend/                 # Express API
│   ├── controllers/         # Request handling and app logic
│   ├── db/                  # Database schemas and seed script
│   ├── middleware/          # Auth, validation, rate limiting, logging
│   ├── routes/              # API routes
│   ├── services/            # External API integrations
│   └── server.js
├── frontend/                # React application
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── services/
├── docker-compose.yml       # Local Docker setup
└── README.md
```

## Run locally

You can run Foodies in either of two ways:

- **Docker Compose** is the quickest route if Docker Desktop is installed. It starts the database, API, and frontend together.
- **Manual setup** is useful if you want to run and debug each part yourself.

### Option 1: Docker Compose

Requirements: [Docker Desktop](https://www.docker.com/products/docker-desktop/).

From the project root:

```bash
cp .env.docker.example .env
docker compose up --build
```

On Windows PowerShell, use this for the first command:

```powershell
Copy-Item .env.docker.example .env
```

Then open:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000/api`
- API documentation: `http://localhost:5000/api-docs`

The first start creates a local MySQL database using the SQL files in `backend/db/`. The values in `.env.docker.example` are for local development only. Use strong, private secrets for any deployed environment.

To stop the containers:

```bash
docker compose down
```

To completely reset the Docker database and uploaded files:

```bash
docker compose down -v
```

### Option 2: Manual setup

Requirements:

- Node.js 20 or newer
- npm
- MySQL 8 or newer

#### 1. Set up MySQL

Create a database named `foodies`. Then run these files in order:

```text
backend/db/schema.sql
backend/db/recipes_schema.sql
backend/db/reviews_schema.sql
backend/db/collections_schema.sql
backend/db/bookmarks_schema.sql
backend/db/activity_schema.sql
```

#### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env
```

In `backend/.env`, add your MySQL credentials and replace `JWT_SECRET` and `SESSION_SECRET` with long random values. Edamam, Groq, and OAuth values are optional.

Start the API:

```bash
npm start
```

For automatic restart while developing:

```bash
npm run dev
```

The API runs at `http://localhost:5000`, and Swagger documentation is available at `http://localhost:5000/api-docs`.

#### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

On PowerShell, replace `cp` with `Copy-Item`. The frontend opens at `http://localhost:3000`.

If React chooses another port, that is fine: the backend accepts local `localhost` and `127.0.0.1` development origins.

## Environment variables

Do not commit real `.env` files. The example files are safe to copy and explain every value.

| File | Purpose |
| --- | --- |
| `backend/.env.example` | Server port, MySQL connection, JWT/session secrets, and optional external API keys |
| `frontend/.env.example` | Frontend API address only; never place private keys here |
| `.env.docker.example` | Local Docker Compose secrets and optional external API keys |

## API overview

The backend API is under `/api`. Swagger provides the full list when the backend is running.

| Feature | Example endpoint |
| --- | --- |
| Authentication | `POST /api/auth/login` |
| Community recipes | `GET /api/recipes` |
| Create recipe | `POST /api/recipes/create-recipe` |
| Update recipe | `PUT /api/recipes/update-recipe/:id` |
| Recipe discussion and ratings | `GET` / `POST /api/recipes/:id/reviews` |
| Collections and favourites | `/api/bookmarks` |
| Admin tools | `/api/admin` |
| AI helper | `/api/chat` |

## Security notes

- Login tokens are stored in **httpOnly cookies**, so browser JavaScript cannot read them.
- Protected routes verify the logged-in user on the backend.
- Requests are validated and rate limited.
- Recipe uploads accept JPEG, PNG, and WebP images up to 5 MB.
- External API keys belong in `backend/.env`, not in the frontend.

These are helpful safeguards, but this is a learning project and should be reviewed carefully before use with real production users or sensitive data.

## Current limitations and next steps

Foodies is actively being improved. Planned work includes:

- Blogs
- Automated frontend and backend tests
- Email verification and a completed password-reset flow
- Better reporting and moderation tools for community content
- Pagination for larger admin lists
- Stronger production OAuth and deployment configuration
- Contributor guides, issue templates, and a code of conduct

## Contributing

Contributions, bug reports, and ideas are welcome. If you would like to help:

1. Check existing issues or open one to discuss a larger change.
2. Create a branch with a clear name.
3. Keep the change focused and explain how you tested it.
4. Update the README if your change adds a setup step or environment variable.

Please avoid committing secrets, `.env` files, build folders, or `node_modules`.

## License

Foodies is released under the [MIT License](LICENSE).
