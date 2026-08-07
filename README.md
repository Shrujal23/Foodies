# Foodies

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)](https://aws.amazon.com/ec2/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

Foodies is a full-stack recipe app built as a portfolio project. People can browse recipes, publish their own, leave reviews, save favorites into collections, and chat with a small AI cooking helper.

It is not a commercial product. It is a learning project that tries to cover real full-stack pieces end to end: auth, database work, file uploads, third-party API, role-based admin, and deployment.

It's aim is to be an open source destinationf for all food and recipe lovers.g

**Live frontend:** [foodies-dusky-sigma.vercel.app](https://foodies-dusky-sigma.vercel.app)

Backend runs on AWS EC2 when I have it up. I do not keep the server on 24/7, so if the live site cannot load data, that is usually why. I am trying to explore other option so the backend can keep on running.

---

## What you can do in the app

- Register / log in with email and password (JWT)
- Browse community recipes and search (community recipes + Edamam API results)
- Create a recipe with image upload
- Open a recipe, read details, leave a rating and review
- Save recipes to favorites and organize them in collections
- Use a personal dashboard for stats and recent activity
- Chat with “Foody” (AI assistant via https://console.groq.com/ or GROQ) for cooking tips. The model used here is openai/gpt-oss-20b.
- Admins can moderate users, recipes, reviews, and collections

---

## Stack

| Layer | Tools |
|--------|--------|
| Frontend | React, React Router, Context API, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MySQL |
| Auth | JWT (main flow), Passport for optional Google/GitHub OAuth |
| AI | Groq API |
| Recipe search | Edamam API |
| Hosting | Vercel (frontend), AWS EC2 (backend) |

---

## Project layout

```
project/
├── backend/          Express API, MySQL, uploads, middleware
│   ├── controllers/
│   ├── db/           schema SQL files + seed-admin
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/         React app
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── services/
├── explain.md        Interview walkthrough (start to finish)
└── README.md
```

---

## Run it locally

You need **Node.js**, **npm**, and **MySQL**.

### 1. Backend

```bash
cd backend
npm install
```

Copy the example env (safe to push) into a real `.env` (gitignored — keep secrets here):

```bash
cp .env.example .env
```

Fill in secrets in `backend/.env`. Names match the code (`MYSQL_*`, `JWT_SECRET`, etc.).

**Local vs AWS DB:** the example has two MySQL blocks. Keep only one uncommented — local for daily work, RDS when you want cloud. Same toggle idea as your private `.env`.

Google/GitHub OAuth keys are optional (not fully set up/tested). Email/password login works without them.

Create the MySQL database, then run the SQL files under `backend/db/` (`schema.sql`, `recipes_schema.sql`, `reviews_schema.sql`, `bookmarks_schema.sql`, `collections_schema.sql`, `activity_schema.sql`).

Optional admin seed:

```bash
node db/seed-admin.js
```

Default seed (from the script): email `admin@gmail.com`, password `admin` — change this if you use it for anything beyond local demos.

Start the API:

```bash
npm start
# or: npm run dev
```

API base: `http://localhost:5000/api`  
Swagger (if running): `http://localhost:5000/api-docs`

### 2. Frontend

```bash
cd frontend
npm install
```

```bash
cp .env.example .env
```

Defaults point at local API (`http://localhost:5000`). Comment/uncomment the deploy URLs in `frontend/.env.example` when switching to EC2.

```bash
npm start
```

App: `http://localhost:3000`

---

## Main API shapes (recipes)

These are the ones I keep intentional and named clearly:

| Action | Method | Path |
|--------|--------|------|
| List community recipes | GET | `/api/recipes` |
| Create | POST | `/api/recipes/create-recipe` |
| Update | PUT | `/api/recipes/update-recipe/:id` |
| Delete | DELETE | `/api/recipes/delete-recipe/:id` |
| One user recipe | GET | `/api/recipes/user/:id` |

Other groups: `/api/auth`, `/api/users`, `/api/bookmarks`, `/api/admin`, `/api/chat`.

**Auth (security-first):** JWT is stored in an **httpOnly cookie** (not `localStorage`).  
The browser sends it automatically on API calls via `credentials: 'include'`.  
JS cannot read the token, which reduces XSS token theft.  
`Authorization: Bearer` is still accepted for tools like Swagger.

---

## Admin

- Route: `/admin` (admin role only)
- Tabs: Users, Recipes, Reviews, Collections
- Stats cards at the top (counts)
- Frontend gates with `AdminRoute`; backend checks admin role again on `/api/admin/*`

That double check is intentional, because the hiding a button is not security.

---

## Things I would improve next

- Real forgot-password flow (UI exists as of now; backend is not wired yet fully)
- Email verification
- Pagination on large admin lists
- automated tests
- Stronger production OAuth callback config
- Potential video sharing option
- Automated email letter(frequency will be decided)
- Blogs section

---

## Contribution

Contributions are welcome! If you want to help improve Foodies, feel free to open an issue or submit a pull request with bug fixes, enhancements, or documentation updates.

Follow the existing code style and add notes about any setup steps or environment changes.

---

## License

MIT — see [LICENSE](./LICENSE).
