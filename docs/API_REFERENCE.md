# MartAI Public API

Enterprise REST API for programmatic access to your SEO data.

---

## Quick Start

Get your first response in 30 seconds:

```bash
# Replace with your API key
curl -H "Authorization: Bearer mart_YOUR_API_KEY" \
  https://app.martai.com/api/v1/keywords
```

---

## Authentication

All API requests require authentication via API key:

**Option 1: Authorization Header (Recommended)**

```http
Authorization: Bearer mart_sk_live_xxxxxxxxxxxxxxxxxxxx
```

**Option 2: X-API-Key Header**

```http
X-API-Key: mart_sk_live_xxxxxxxxxxxxxxxxxxxx
```

### Getting Your API Key

1. Log in to [MartAI Dashboard](https://app.martai.com)
2. Go to **Settings → API Keys**
3. Click **Create New Key**
4. Copy your key (shown only once)

> ⚠️ **Security:** Store your API key securely. Never commit to git or expose in client-side code. Treat it like a password.

### Permissions

| Level   | Access               |
| ------- | -------------------- |
| `read`  | GET endpoints only   |
| `write` | GET + POST endpoints |
| `admin` | All + key management |

---

## Base URL

```
https://app.martai.com/api/v1
```

All endpoints return JSON. Set `Content-Type: application/json` for POST requests.

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Your requested data
  },
  "meta": {
    "requestId": "req_1702123456_abc123def",
    "timestamp": "2024-12-09T12:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Keywords array cannot be empty",
    "details": {
      "field": "keywords",
      "received": 0,
      "minimum": 1
    }
  },
  "meta": {
    "requestId": "req_1702123456_abc123def",
    "timestamp": "2024-12-09T12:00:00.000Z"
  }
}
```

### Error Codes

| Code               | HTTP | Description                | What to do                      |
| ------------------ | ---- | -------------------------- | ------------------------------- |
| `unauthorized`     | 401  | Invalid or missing API key | Check your API key              |
| `forbidden`        | 403  | Insufficient permissions   | Request higher permission level |
| `not_found`        | 404  | Resource doesn't exist     | Check the ID                    |
| `rate_limited`     | 429  | Too many requests          | Slow down, check `Retry-After`  |
| `validation_error` | 400  | Invalid request data       | Check `details` field           |
| `internal_error`   | 500  | Server error               | Retry with exponential backoff  |

---

## Endpoints

### Keywords

#### List Keywords

```http
GET /api/v1/keywords
```

Retrieve all keywords for your project.

**Query Parameters:**

| Param    | Type | Default | Range | Description    |
| -------- | ---- | ------- | ----- | -------------- |
| `limit`  | int  | 50      | 1-100 | Items per page |
| `offset` | int  | 0       | 0+    | Skip N items   |

**Example Request:**

```bash
curl "https://app.martai.com/api/v1/keywords?limit=25" \
  -H "Authorization: Bearer mart_YOUR_API_KEY"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "_id": "j971pz2dwq4z...",
        "keyword": "best seo tools 2024",
        "volume": 12000,
        "difficulty": 45,
        "cpc": 2.5,
        "source": "api",
        "createdAt": 1702123456789
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 25,
      "offset": 0,
      "hasMore": true
    }
  },
  "meta": {
    "requestId": "req_1702123456_abc123",
    "timestamp": "2024-12-09T12:00:00.000Z"
  }
}
```

---

#### Create Keywords

```http
POST /api/v1/keywords
```

Add new keywords to your project. Requires `write` permission.

**Request Body:**

```json
{
  "keywords": ["seo tools", "keyword research", "content strategy"]
}
```

**Limits:**

- Minimum: 1 keyword
- Maximum: 100 keywords per request
- Keywords must be non-empty strings
- Max 200 characters per keyword

**Example Request:**

```bash
curl -X POST "https://app.martai.com/api/v1/keywords" \
  -H "Authorization: Bearer mart_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"keywords": ["seo tips", "keyword research"]}'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "created": ["j971pz2dwq4z...", "k082qa3exr5a..."],
    "count": 2
  },
  "meta": {
    "requestId": "req_1702123456_abc123",
    "timestamp": "2024-12-09T12:00:00.000Z"
  }
}
```

---

### Clusters

#### List Clusters

```http
GET /api/v1/clusters
```

Retrieve keyword clusters (topic groups).

**Query Parameters:**

| Param    | Type | Default | Range |
| -------- | ---- | ------- | ----- |
| `limit`  | int  | 50      | 1-100 |
| `offset` | int  | 0       | 0+    |

**Example Request:**

```bash
curl "https://app.martai.com/api/v1/clusters" \
  -H "Authorization: Bearer mart_YOUR_API_KEY"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "clusters": [
      {
        "_id": "c123abc...",
        "name": "SEO Tools",
        "keywordCount": 15,
        "avgVolume": 5400,
        "avgDifficulty": 42,
        "status": "active",
        "createdAt": 1702123456789
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

### Briefs

#### List Content Briefs

```http
GET /api/v1/briefs
```

Retrieve content briefs for your project.

**Query Parameters:**

| Param    | Type   | Default | Description                                               |
| -------- | ------ | ------- | --------------------------------------------------------- |
| `limit`  | int    | 50      | Items per page (max 100)                                  |
| `offset` | int    | 0       | Pagination offset                                         |
| `status` | string | -       | Filter: `planned`, `in_progress`, `approved`, `published` |

**Example Request:**

```bash
curl "https://app.martai.com/api/v1/briefs?status=approved" \
  -H "Authorization: Bearer mart_YOUR_API_KEY"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "briefs": [
      {
        "_id": "b456def...",
        "title": "Complete Guide to Keyword Research in 2024",
        "status": "approved",
        "scheduledDate": 1702987654321,
        "h2Outline": [
          "What is Keyword Research?",
          "Best Keyword Research Tools",
          "How to Find Low Competition Keywords"
        ],
        "metaTitle": "Keyword Research Guide 2024 | MartAI",
        "createdAt": 1702123456789
      }
    ],
    "pagination": {
      "total": 8,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    },
    "filters": {
      "status": "approved"
    }
  }
}
```

---

### Analytics

#### Get Analytics Summary

```http
GET /api/v1/analytics
```

Retrieve analytics KPIs for your project.

**Query Parameters:**

| Param  | Type | Default | Range | Description       |
| ------ | ---- | ------- | ----- | ----------------- |
| `days` | int  | 30      | 1-90  | Days to look back |

**Example Request:**

```bash
curl "https://app.martai.com/api/v1/analytics?days=7" \
  -H "Authorization: Bearer mart_YOUR_API_KEY"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "analytics": {
      "sessions": 12500,
      "clicks": 8200,
      "impressions": 150000,
      "ctr": 5.47,
      "avgPosition": 12.3,
      "leads": 45,
      "revenue": 2350.0,
      "conversionRate": 0.36
    },
    "filters": {
      "days": 7,
      "from": "2024-12-02T00:00:00.000Z",
      "to": "2024-12-09T12:00:00.000Z"
    },
    "projectId": "p789ghi..."
  }
}
```

---

## Rate Limits

| Plan       | Requests/min | Daily Limit |
| ---------- | ------------ | ----------- |
| Enterprise | 100          | Unlimited   |

When rate limited, you'll receive:

**Response:**

```json
{
  "success": false,
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded. Please slow down.",
    "retryAfter": 60
  }
}
```

**Headers:**

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Remaining: 0
```

**Best practice:** Implement exponential backoff:

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status !== 429) return response;

    const retryAfter = response.headers.get('Retry-After') || 60;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
  }
  throw new Error('Max retries exceeded');
}
```

---

## CORS

All endpoints support Cross-Origin Resource Sharing:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, X-API-Key, Content-Type
```

Preflight requests (`OPTIONS`) return `204 No Content`.

---

## Code Examples

### JavaScript/Node.js

```javascript
const MARTAI_API_KEY = process.env.MARTAI_API_KEY;
const BASE_URL = 'https://app.martai.com/api/v1';

async function getKeywords() {
  const response = await fetch(`${BASE_URL}/keywords`, {
    headers: {
      Authorization: `Bearer ${MARTAI_API_KEY}`,
    },
  });

  const { success, data, error } = await response.json();

  if (!success) {
    throw new Error(error.message);
  }

  return data.keywords;
}

async function createKeywords(keywords) {
  const response = await fetch(`${BASE_URL}/keywords`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MARTAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keywords }),
  });

  const { success, data, error } = await response.json();

  if (!success) {
    throw new Error(error.message);
  }

  return data.created;
}
```

### Python

```python
import requests
import os

MARTAI_API_KEY = os.environ.get('MARTAI_API_KEY')
BASE_URL = 'https://app.martai.com/api/v1'

def get_keywords():
    response = requests.get(
        f'{BASE_URL}/keywords',
        headers={'Authorization': f'Bearer {MARTAI_API_KEY}'}
    )

    data = response.json()

    if not data['success']:
        raise Exception(data['error']['message'])

    return data['data']['keywords']

def create_keywords(keywords: list):
    response = requests.post(
        f'{BASE_URL}/keywords',
        headers={
            'Authorization': f'Bearer {MARTAI_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={'keywords': keywords}
    )

    data = response.json()

    if not data['success']:
        raise Exception(data['error']['message'])

    return data['data']['created']
```

### cURL

```bash
# List keywords
curl -H "Authorization: Bearer mart_YOUR_API_KEY" \
  https://app.martai.com/api/v1/keywords

# Create keywords
curl -X POST \
  -H "Authorization: Bearer mart_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"keywords": ["seo", "marketing"]}' \
  https://app.martai.com/api/v1/keywords

# Get analytics (last 7 days)
curl -H "Authorization: Bearer mart_YOUR_API_KEY" \
  "https://app.martai.com/api/v1/analytics?days=7"
```

---

## Changelog

| Version | Date     | Changes                                                |
| ------- | -------- | ------------------------------------------------------ |
| v1.0.0  | Dec 2024 | Initial release: keywords, clusters, briefs, analytics |

---

## Support

- **Email:** api-support@martai.com
- **Documentation:** https://docs.martai.com
- **Dashboard:** https://app.martai.com
