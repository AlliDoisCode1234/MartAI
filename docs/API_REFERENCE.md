# MartAI Public API Reference

## Overview

The MartAI Public API allows external integrations with your SEO data.

**Base URL**: `https://app.martai.io/api/v1`

---

## Authentication

All requests require an API key. Get one from **Settings → API Keys**.

```bash
# Option 1: Bearer token (preferred)
curl -H "Authorization: Bearer mart_xxx" https://app.martai.io/api/v1/keywords

# Option 2: X-API-Key header
curl -H "X-API-Key: mart_xxx" https://app.martai.io/api/v1/keywords
```

### Permissions

| Permission | Endpoints            |
| ---------- | -------------------- |
| `read`     | GET on all endpoints |
| `write`    | POST, PUT, DELETE    |
| `admin`    | All operations       |

---

## Rate Limits

| Tier   | Read    | Write   |
| ------ | ------- | ------- |
| Solo   | 100/hr  | 50/hr   |
| Growth | 500/hr  | 200/hr  |
| Agency | 2000/hr | 1000/hr |

Rate limit headers in every response:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Endpoints

### Keywords

#### `GET /keywords`

List all keywords for your project.

**Query Params:**

- `limit` (default: 50, max: 100)
- `offset` (default: 0)

```bash
curl -H "Authorization: Bearer mart_xxx" \
  "https://app.martai.io/api/v1/keywords?limit=20"
```

**Response:**

```json
{
  "keywords": [
    {
      "_id": "abc123",
      "keyword": "seo tips",
      "searchVolume": 2400,
      "difficulty": 45,
      "intent": "informational"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### `POST /keywords`

Create new keywords.

```bash
curl -X POST -H "Authorization: Bearer mart_xxx" \
  -H "Content-Type: application/json" \
  -d '{"keywords": ["seo tips", "content strategy"]}' \
  https://app.martai.io/api/v1/keywords
```

**Response:**

```json
{
  "created": ["k1abc", "k2def"],
  "count": 2
}
```

---

### Clusters

#### `GET /clusters`

List topic clusters (keyword groups).

```bash
curl -H "Authorization: Bearer mart_xxx" \
  "https://app.martai.io/api/v1/clusters"
```

**Response:**

```json
{
  "clusters": [
    {
      "_id": "c123",
      "clusterName": "SEO Basics",
      "keywords": ["seo tips", "seo guide"],
      "totalVolume": 5000
    }
  ],
  "pagination": { "total": 5, "limit": 50, "offset": 0, "hasMore": false }
}
```

---

### Briefs

#### `GET /briefs`

List content briefs.

**Query Params:**

- `limit`, `offset`
- `status`: `pending` | `in_progress` | `completed` | `published`

```bash
curl -H "Authorization: Bearer mart_xxx" \
  "https://app.martai.io/api/v1/briefs?status=pending"
```

---

### Analytics

#### `GET /analytics`

Get SEO analytics and KPIs.

**Query Params:**

- `days` (default: 30, max: 90)

```bash
curl -H "Authorization: Bearer mart_xxx" \
  "https://app.martai.io/api/v1/analytics?days=7"
```

**Response:**

```json
{
  "analytics": {
    "sessions": 1250,
    "pageViews": 3400,
    "avgPosition": 12.5,
    "ctr": 3.2
  },
  "filters": {
    "days": 7,
    "from": "2025-12-04T00:00:00Z",
    "to": "2025-12-11T00:00:00Z"
  }
}
```

---

## Error Responses

| Status | Meaning                    |
| ------ | -------------------------- |
| 401    | Missing or invalid API key |
| 403    | Insufficient permissions   |
| 422    | Validation error           |
| 429    | Rate limit exceeded        |
| 500    | Server error               |

**Error format:**

```json
{
  "error": "UNAUTHORIZED",
  "message": "Missing API key",
  "requestId": "req_abc123"
}
```

---

## OpenAPI Spec

Full machine-readable spec: [openapi.yaml](./openapi.yaml)

Import into Postman, Insomnia, or any OpenAPI-compatible tool.
