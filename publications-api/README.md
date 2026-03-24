# Publications API

Node + Express + Prisma + SQLite backend for the IIT publications page.

## Setup

```bash
npm install
npx prisma migrate dev --name init
node prisma/seed.js   # optional: load sample data
npm run dev
```

Server starts at `http://localhost:3000`.

---

## API Reference

### GET `/api/publications`
Returns a paginated list of publications.

**Query params**
| Param    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `field`  | string | Filter by field (exact match)        |
| `year`   | number | Filter by year                       |
| `search` | string | Search title, authors, field         |
| `page`   | number | Page number (default: 1)             |
| `limit`  | number | Results per page (default: 20)       |

**Response**
```json
{
  "data": [ ...publications ],
  "meta": { "total": 7, "page": 1, "limit": 20, "pages": 1 }
}
```

---

### GET `/api/publications/:id`
Returns a single publication.

---

### POST `/api/publications`
Creates a new publication.

**Body** (JSON)
```json
{
  "title":    "Paper title",       // required
  "authors":  "Author A, B",       // required
  "venue":    "NeurIPS",           // required
  "year":     2024,                // required
  "field":    "Machine Learning",  // optional
  "abstract": "Short summary...",  // optional
  "link":     "https://arxiv.org"  // optional
}
```

---

### PUT `/api/publications/:id`
Updates a publication. All fields optional (partial update supported).

---

### DELETE `/api/publications/:id`
Deletes a publication. Returns `204 No Content`.

---

## Switching to PostgreSQL

1. Change `package.json` to install `pg` if needed.
2. In `prisma/schema.prisma`, update the datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/publications"
```

4. Run `npx prisma migrate dev`.
