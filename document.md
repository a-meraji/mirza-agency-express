# API Documentation

Base URL: `http://localhost:3001` (or your deployed URL)

All endpoints expect `Content-Type: application/json`.

---

## 1. Create Appointments

**Endpoint:** `POST /create-appointments`

Creates appointment slots for the given dates. Behavior:

1. Deletes any existing appointments with dates **before today**.
2. Checks which of the requested dates **already exist** in the database.
3. Creates slots **only for dates that do not already exist** (no duplicates).

Send dates as ISO 8601 strings; they are converted to `Date` by the API.

### Request Body

```json
{
  "dates": ["2025-02-18T09:00:00.000Z", "2025-02-18T10:00:00.000Z"]
}
```

| Field  | Type     | Required | Description                    |
|--------|----------|----------|--------------------------------|
| dates  | Date[]   | Yes      | Array of ISO 8601 date strings |

### Response Body

**Success (201)**

`data` contains **only the newly created** appointments (dates that did not already exist). If all requested dates already existed, `data` is an empty array.

```json
{
  "status": 201,
  "message": "appointments created successfully",
  "data": [
    {
      "_id": "...",
      "date": "2025-02-18T09:00:00.000Z",
      "description": null,
      "phoneNumber": null,
      "email": null,
      "name": null,
      "services": [],
      "isBooked": false
    }
  ]
}
```

**Error (500)**

```json
{
  "status": 500,
  "message": "error occur while creating appointments",
  "data": null
}
```

---

## 2. Book Appointment

**Endpoint:** `POST /book-appointment`

Books an available appointment slot for a given date. Sends a Telegram notification on success.

### Request Body

```json
{
  "date": "2025-02-18T09:00:00.000Z",
  "name": "John Doe",
  "services": ["Haircut", "Beard Trim"],
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "description": "First time client"
}
```

| Field       | Type     | Required | Description                    |
|-------------|----------|----------|--------------------------------|
| date        | Date     | Yes      | ISO 8601 date of the slot      |
| name        | string   | Yes      | Client name                    |
| services    | string[] | Yes      | List of services               |
| email       | string   | Yes      | Client email                   |
| phoneNumber | string   | Yes      | Client phone number            |
| description | string   | No       | Optional notes                 |

### Response Body

**Success (200)**

```json
{
  "status": 200,
  "message": "appointment booked successfully",
  "data": {
    "_id": "...",
    "date": "2025-02-18T09:00:00.000Z",
    "description": "First time client",
    "phoneNumber": "+1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "services": ["Haircut", "Beard Trim"],
    "isBooked": true
  }
}
```

**Not found (404)**

```json
{
  "status": 404,
  "message": "appointment not found",
  "data": null
}
```

**Error (500)**

```json
{
  "status": 500,
  "message": "error occur while booking appointment",
  "data": null
}
```

---

## 3. Get Appointments

**Endpoint:** `POST /get-appointments`

Returns appointments. If `date` is provided, returns all slots for that day; otherwise returns slots for today. Response includes only `date` and `isBooked` (no client details).

### Request Body

```json
{
  "date": "2025-02-18T00:00:00.000Z"
}
```

| Field | Type | Required | Description                                      |
|-------|------|----------|--------------------------------------------------|
| date  | Date | No       | Day to fetch (ISO 8601). If omitted, uses today. |

### Response Body

**Success (200)**

```json
{
  "status": 200,
  "message": "appointments fetched successfully",
  "data": [
    {
      "date": "2025-02-18T09:00:00.000Z",
      "isBooked": false
    },
    {
      "date": "2025-02-18T10:00:00.000Z",
      "isBooked": true
    }
  ]
}
```

**Error (500)**

```json
{
  "status": 500,
  "message": "error occur while fetching appointments",
  "data": null
}
```

---

## Response Shape (all endpoints)

All responses use this structure:

| Field   | Type   | Description                    |
|---------|--------|--------------------------------|
| status  | number | HTTP-like status (200, 201, 404, 500) |
| message | string | Human-readable message         |
| data    | object \| array \| null | Payload or `null` on error |

Validation errors (e.g. invalid or missing body fields) are handled by NestJS and may return a different format (e.g. 400 with validation details).
