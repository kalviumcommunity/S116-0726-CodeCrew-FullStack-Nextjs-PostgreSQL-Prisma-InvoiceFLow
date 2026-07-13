# Database Design

## Project

Bulk Invoice Upload and Background Processing System

## Overview

The system is designed to process large CSV files containing invoice data. Each CSV upload is tracked separately, and every invoice is processed independently in the background. Processing results are stored in the database for progress tracking, error reporting, and upload history.

The database consists of three main tables:

1. Upload
2. Invoice
3. InvoiceReference

---

# Entity Relationship

```
Upload (1)
    │
    │
    ├───────────────< Invoice (Many)

InvoiceReference
(Independent reference data used for invoice matching)
```

---

# Table: Upload

Stores information about each uploaded CSV file.

| Column | Type | Constraints | Description |
|---------|------|------------|-------------|
| id | UUID | Primary Key | Unique upload identifier |
| fileName | String | Required | Name of uploaded CSV file |
| totalRows | Integer | Required | Total invoices in CSV |
| processedRows | Integer | Default 0 | Number of processed invoices |
| successRows | Integer | Default 0 | Successfully processed invoices |
| failedRows | Integer | Default 0 | Failed invoices |
| status | UploadStatus | Required | Current upload status |
| uploadedAt | DateTime | Default Now | Upload timestamp |

---

# Table: Invoice

Stores every invoice from a CSV upload.

| Column | Type | Constraints | Description |
|---------|------|------------|-------------|
| id | UUID | Primary Key | Unique invoice identifier |
| uploadId | UUID | Foreign Key | References Upload.id |
| invoiceNumber | String | Required | Invoice number |
| customerName | String | Required | Customer name |
| invoiceDate | Date | Required | Invoice date |
| amount | Decimal | Required | Invoice amount |
| status | InvoiceStatus | Required | Processing result |
| errorMessage | String | Nullable | Error message if validation fails |
| createdAt | DateTime | Default Now | Record creation timestamp |

---

# Table: InvoiceReference

Stores reference invoices used to determine Match or Mismatch during processing.

| Column | Type | Constraints | Description |
|---------|------|------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| invoiceNumber | String | Unique | Invoice number |
| customerName | String | Required | Customer name |
| invoiceDate | Date | Required | Invoice date |
| amount | Decimal | Required | Invoice amount |

---

# Enums

## UploadStatus

Possible values:

- PENDING
- PROCESSING
- COMPLETED
- FAILED

---

## InvoiceStatus

Possible values:

- PROCESSING
- MATCH
- MISMATCH
- FAILED

---

# Relationships

## Upload → Invoice

Relationship: One-to-Many

One Upload can contain multiple Invoices.

Each Invoice belongs to exactly one Upload.

---

## InvoiceReference

InvoiceReference is independent of Upload and Invoice.

It is used during processing to compare uploaded invoices against existing invoice records.

---

# Validation Rules

Each uploaded invoice is validated before processing.

Required Fields

- Invoice Number
- Customer Name
- Invoice Date
- Amount

Validation Checks

- Missing required fields
- Invalid date format
- Invalid amount
- Duplicate invoice numbers
- Invalid invoice format

---

# Processing Flow

1. User uploads CSV.
2. Upload record is created.
3. Each invoice is inserted into the processing queue.
4. Worker validates invoice.
5. Invoice status is updated.
6. Upload progress counters are updated.
7. User can monitor progress in real time.

---

# Indexes

Recommended indexes:

Upload

- id
- uploadedAt
- status

Invoice

- uploadId
- invoiceNumber
- status

InvoiceReference

- invoiceNumber

These indexes improve lookup performance and progress retrieval.