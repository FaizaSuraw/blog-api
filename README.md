# Minimal Blogging Platform API

A simple RESTful blog API built with:

- Express.js
- Prisma ORM
- PostgreSQL
- Deployed on Render

## API Endpoints

### Users

- `GET /users` — Get all users
- `GET /users/:id` — Get a user and their posts
- `POST /users` — Create a new user

### Posts

- `GET /posts` — Get all posts (with author details)
- `GET /posts/:id` — Get a specific post (with author)
- `POST /posts` — Create a new post
- `PUT /posts/:id` — Update a post
- `DELETE /posts/:id` — Delete a post

## Live API

🔗 https://blog-api-iavq.onrender.com

---

### 📁 Tech Stack

- Express for server & routing
- Prisma for database interaction
- PostgreSQL on Render
