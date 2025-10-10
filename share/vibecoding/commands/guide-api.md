---
description: API Guide from swagger
argument-hint: --swagger [spec-file] --output [output-path]
---

Use ${--swagger:swagger.json} create file ${--output:@docs/API_Integration_guide.md}

With format for each endpoint:

## [Endpoint Name]

**Endpoint:** [Full URL path with parameters]
**Method:** [GET/POST/PUT/PATCH/DELETE]
**Description:** [Brief description of what this endpoint does]

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
[Other headers]
```

**Request Payload:**
```json
{
  "field1": "type and description",
  "field2": "type and description"
}
```

**Success Response (200/201):**
```json
{
  "field1": "type and description",
  "field2": "type and description"
}
```

**Error Responses:**
- 400: Bad Request - [Description]
- 401: Unauthorized - [Description]
- 404: Not Found - [Description]
- 500: Internal Server Error - [Description]

**Notes:**
- [Any additional notes about this endpoint]
- [Validation rules, rate limiting, etc.]

---

Organize endpoints by feature/module for better readability.