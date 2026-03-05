# Bitespeed Identity Reconciliation API

This project implements the backend API required for the Bitespeed Identity Reconciliation task.

## Live API
POST endpoint:

https://bitespeed-identity-reconciliation-m7ux.onrender.com/identify

## Repository
https://github.com/SHREINITHIRJ/bitespeed-identity-reconciliation

## Tech Stack
- Node.js
- Express.js
- Prisma ORM
- SQLite
- Render (deployment)

## API Endpoint

POST /identify

### Request Body

{
  "email": "string",
  "phoneNumber": "string"
}

### Response

{
  "contact": {
    "primaryContactId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}

## How It Works

The service reconciles identities by linking contacts that share the same email or phone number.

Rules implemented:

- Oldest contact becomes **primary**
- New linked records become **secondary**
- Emails and phone numbers are consolidated across linked contacts
- Response returns the primary contact and all linked secondary contacts

## Example Request

POST /identify

{
 "email": "doc@fluxkart.com",
 "phoneNumber": "123456"
}

## Example Response

{
 "contact": {
   "primaryContactId": 1,
   "emails": [
     "test@example.com",
     "doc@fluxkart.com"
   ],
   "phoneNumbers": [
     "123456"
   ],
   "secondaryContactIds": [2]
 }
}
