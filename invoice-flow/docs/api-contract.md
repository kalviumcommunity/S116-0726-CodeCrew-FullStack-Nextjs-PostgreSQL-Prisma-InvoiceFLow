# API Contract

## Project

Bulk Invoice Upload and Background Processing System

## Base URL

```
/api
```

---

# API Overview

The backend exposes REST APIs for:

- Uploading CSV files
- Viewing upload history
- Tracking processing progress
- Viewing processed invoices

---

# 1. Upload CSV

## Endpoint

```
POST /api/upload
```

## Description

Uploads a CSV file and creates a background processing job.

## Request

Content-Type

```
multipart/form-data
```

Parameter

| Name | Type | Required |
|------|------|----------|
| file | CSV File | Yes |

---

## Success Response

Status Code

```
201 Created
```

```json
{
  "uploadId": "d2ab4b0f",
  "status": "PROCESSING",
  "message": "CSV uploaded successfully."
}
```

---

## Error Response

Status Code

```
400 Bad Request
```

```json
{
  "error": {
    "code": "INVALID_FILE",
    "message": "Only CSV files are allowed."
  }
}
```

---

# 2. Get Upload History

## Endpoint

```
GET /api/uploads
```

## Description

Returns all previous uploads.

## Success Response

```json
[
  {
    "id": "1",
    "fileName": "july.csv",
    "totalRows": 5000,
    "successRows": 4900,
    "failedRows": 100,
    "status": "COMPLETED",
    "uploadedAt": "2026-07-10T09:30:00Z"
  }
]
```

---

# 3. Get Upload Progress

## Endpoint

```
GET /api/uploads/{uploadId}/progress
```

## Description

Returns current background processing progress.

## Success Response

```json
{
  "totalRows": 5000,
  "processedRows": 3200,
  "successRows": 3100,
  "failedRows": 100,
  "progress": 64,
  "status": "PROCESSING"
}
```

---

# 4. Get Processed Invoices

## Endpoint

```
GET /api/uploads/{uploadId}/invoices
```

## Description

Returns all invoices associated with a specific upload.

## Success Response

```json
[
  {
    "invoiceNumber": "INV001",
    "customerName": "Rahul",
    "invoiceDate": "2026-07-10",
    "amount": 1500,
    "status": "MATCH",
    "errorMessage": null
  },
  {
    "invoiceNumber": "INV002",
    "customerName": "Priya",
    "invoiceDate": "2026-07-10",
    "amount": 2500,
    "status": "FAILED",
    "errorMessage": "Missing Invoice Number"
  }
]
```

---

# Error Format

All API errors follow a common structure.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invoice Number is missing.",
    "details": {
      "row": 15
    }
  }
}
```

---

# HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Invalid Request |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# Processing Flow

```
Upload CSV

↓

Validate File

↓

Create Upload Record

↓

Parse CSV

↓

Create Queue Jobs

↓

Background Worker

↓

Validate Invoice

↓

Save Result

↓

Update Progress

↓

Frontend Polls Progress API

↓

Display Progress Bar and Results
```

---

# Notes

- Only CSV files are accepted.
- Processing is asynchronous using BullMQ.
- Failed invoices do not stop processing of remaining invoices.
- Progress is tracked at the upload level.
- Invoice validation is performed independently for every row.
- Upload history is permanently stored in PostgreSQL.