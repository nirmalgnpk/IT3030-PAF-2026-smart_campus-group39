# Booking Management API - Complete Reference

## Base URL
```
Development: http://localhost:8080/api/bookings
Production: https://api.smartcampus.com/api/bookings
```

## Authentication
Currently: No authentication required (development)
Future: JWT Bearer token in Authorization header

## Response Codes
- **200 OK** - Successful GET, PUT operations
- **201 CREATED** - Successful POST (create)
- **204 NO_CONTENT** - Successful DELETE
- **400 BAD_REQUEST** - Validation error or invalid state
- **404 NOT_FOUND** - Resource not found
- **409 CONFLICT** - Time slot already booked

---

## Endpoints

### 1. GET /api/bookings
Get all bookings with optional filters

**Authentication**: ADMIN ONLY (TODO: implement @PreAuthorize)

**Query Parameters**:
```
status     (optional) - Filter by status: PENDING, APPROVED, REJECTED, CANCELLED
userId     (optional) - Filter by user ID
resourceId (optional) - Filter by resource ID
```

**Request Examples**:
```bash
# Get all bookings
curl http://localhost:8080/api/bookings

# Get all PENDING bookings
curl "http://localhost:8080/api/bookings?status=PENDING"

# Get bookings for user
curl "http://localhost:8080/api/bookings?userId=user123"

# Get all bookings for a resource
curl "http://localhost:8080/api/bookings?resourceId=room1"

# Combine filters
curl "http://localhost:8080/api/bookings?status=APPROVED&resourceId=room1"
```

**Success Response (200 OK)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "resourceId": "room1",
    "resourceName": "Conference Room A",
    "userId": "user123",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "date": "2026-04-20",
    "startTime": "14:00",
    "endTime": "15:00",
    "purpose": "Team meeting",
    "expectedAttendees": 5,
    "status": "PENDING",
    "rejectionReason": null,
    "createdAt": "2026-04-19T10:30:00",
    "updatedAt": "2026-04-19T10:30:00"
  }
]
```

---

### 2. GET /api/bookings/{id}
Get a single booking by ID

**Authentication**: Not required

**Path Parameters**:
```
id (required) - MongoDB ObjectId
```

**Request Examples**:
```bash
curl http://localhost:8080/api/bookings/507f1f77bcf86cd799439011
```

**Success Response (200 OK)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "resourceId": "room1",
  "resourceName": "Conference Room A",
  "userId": "user123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "date": "2026-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5,
  "status": "PENDING",
  "rejectionReason": null,
  "createdAt": "2026-04-19T10:30:00",
  "updatedAt": "2026-04-19T10:30:00"
}
```

**Error Response (404 NOT_FOUND)**:
```json
{}
```

---

### 3. GET /api/bookings/user/{userId}
Get all bookings for a specific user

**Authentication**: Not required (but should validate user context)

**Path Parameters**:
```
userId (required) - User identifier
```

**Request Examples**:
```bash
curl http://localhost:8080/api/bookings/user/user123
curl http://localhost:8080/api/bookings/user/john.doe@example.com
```

**Success Response (200 OK)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "resourceId": "room1",
    "resourceName": "Conference Room A",
    "userId": "user123",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "date": "2026-04-20",
    "startTime": "14:00",
    "endTime": "15:00",
    "purpose": "Team meeting",
    "expectedAttendees": 5,
    "status": "APPROVED",
    "rejectionReason": null,
    "createdAt": "2026-04-19T10:30:00",
    "updatedAt": "2026-04-19T11:00:00"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "resourceId": "lab2",
    "resourceName": "Lab C",
    "userId": "user123",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "date": "2026-04-21",
    "startTime": "09:00",
    "endTime": "11:00",
    "purpose": "Lab experiment",
    "expectedAttendees": 3,
    "status": "PENDING",
    "rejectionReason": null,
    "createdAt": "2026-04-19T11:15:00",
    "updatedAt": "2026-04-19T11:15:00"
  }
]
```

---

### 4. POST /api/bookings
Create a new booking

**Authentication**: Not required

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "resourceId": "room1",
  "userId": "user123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "date": "2026-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5
}
```

**Validation Rules**:
- All fields required
- Email must be valid format
- Date format: YYYY-MM-DD
- Time format: HH:mm (24-hour)
- startTime must be < endTime
- expectedAttendees >= 1

**Success Response (201 CREATED)**:
```json
{
  "id": "507f1f77bcf86cd799439013",
  "resourceId": "room1",
  "resourceName": "Conference Room A",
  "userId": "user123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "date": "2026-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5,
  "status": "PENDING",
  "rejectionReason": null,
  "createdAt": "2026-04-19T13:45:00",
  "updatedAt": "2026-04-19T13:45:00"
}
```

**Conflict Response (409 CONFLICT)**:
```json
{
  "message": "Resource already booked for this time slot"
}
```

**Validation Error (400 BAD_REQUEST)**:
```json
{
  "message": "Invalid email format"
}
```

**Request Examples**:
```bash
# Successful booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "room1",
    "userId": "user123",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "date": "2026-04-20",
    "startTime": "14:00",
    "endTime": "15:00",
    "purpose": "Team meeting",
    "expectedAttendees": 5
  }'

# Conflict - overlapping booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "room1",
    "userId": "user456",
    "userName": "Jane Smith",
    "userEmail": "jane@example.com",
    "date": "2026-04-20",
    "startTime": "14:30",
    "endTime": "15:30",
    "purpose": "Another meeting",
    "expectedAttendees": 3
  }'
# Returns 409 CONFLICT: "Resource already booked for this time slot"
```

---

### 5. PUT /api/bookings/{id}/approve
Approve a PENDING booking

**Authentication**: ADMIN ONLY (TODO: @PreAuthorize)

**Path Parameters**:
```
id (required) - MongoDB ObjectId
```

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**: Empty (no body required)

**Success Response (200 OK)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "resourceId": "room1",
  "resourceName": "Conference Room A",
  "userId": "user123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "date": "2026-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5,
  "status": "APPROVED",
  "rejectionReason": null,
  "createdAt": "2026-04-19T10:30:00",
  "updatedAt": "2026-04-19T14:00:00"
}
```

**Error Response (400 BAD_REQUEST)**:
```json
{
  "message": "Only PENDING bookings can be approved"
}
```

**Request Examples**:
```bash
# Approve a pending booking
curl -X PUT http://localhost:8080/api/bookings/507f1f77bcf86cd799439011/approve \
  -H "Content-Type: application/json"

# Error - trying to approve already approved booking
curl -X PUT http://localhost:8080/api/bookings/507f1f77bcf86cd799439011/approve \
  -H "Content-Type: application/json"
# Returns 400: "Only PENDING bookings can be approved"
```

---

### 6. PUT /api/bookings/{id}/reject
Reject a PENDING booking with a reason

**Authentication**: ADMIN ONLY (TODO: @PreAuthorize)

**Path Parameters**:
```
id (required) - MongoDB ObjectId
```

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "reason": "Room maintenance scheduled for this time"
}
```

**Success Response (200 OK)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "resourceId": "room1",
  "resourceName": "Conference Room A",
  "userId": "user123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "date": "2026-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5,
  "status": "REJECTED",
  "rejectionReason": "Room maintenance scheduled for this time",
  "createdAt": "2026-04-19T10:30:00",
  "updatedAt": "2026-04-19T14:05:00"
}
```

**Error Response (400 BAD_REQUEST)**:
```json
{
  "message": "Only PENDING bookings can be rejected"
}
```

**Request Examples**:
```bash
curl -X PUT http://localhost:8080/api/bookings/507f1f77bcf86cd799439011/reject \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Room maintenance scheduled for this time"
  }'

# Alternative reasons
-d '{"reason": "Double booking detected"}'
-d '{"reason": "Resource not available for this date"}'
-d '{"reason": "Insufficient notice period"}'
```

---

### 7. PUT /api/bookings/{id}/cancel
Cancel an APPROVED booking

**Authentication**: Not required (but should validate user owns booking)

**Path Parameters**:
```
id (required) - MongoDB ObjectId
```

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**: Empty

**Success Response (200 OK)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "resourceId": "room1",
  "resourceName": "Conference Room A",
  "userId": "user123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "date": "2026-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5,
  "status": "CANCELLED",
  "rejectionReason": null,
  "createdAt": "2026-04-19T10:30:00",
  "updatedAt": "2026-04-19T14:10:00"
}
```

**Error Response (400 BAD_REQUEST)**:
```json
{
  "message": "Only APPROVED bookings can be cancelled"
}
```

**Request Examples**:
```bash
# Cancel an approved booking
curl -X PUT http://localhost:8080/api/bookings/507f1f77bcf86cd799439011/cancel \
  -H "Content-Type: application/json"

# Cannot cancel PENDING booking - already rejected
curl -X PUT http://localhost:8080/api/bookings/507f1f77bcf86cd799439012/cancel \
  -H "Content-Type: application/json"
# Returns 400: "Only APPROVED bookings can be cancelled"
```

---

### 8. DELETE /api/bookings/{id}
Hard delete a booking (permanently remove from database)

**Authentication**: ADMIN ONLY (TODO: @PreAuthorize)

**Path Parameters**:
```
id (required) - MongoDB ObjectId
```

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**: Empty

**Success Response (204 NO_CONTENT)**:
```
No body returned
```

**Error Response (404 NOT_FOUND)**:
```
No body returned
```

**Request Examples**:
```bash
# Delete a booking
curl -X DELETE http://localhost:8080/api/bookings/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json"

# Non-existent booking returns 404
curl -X DELETE http://localhost:8080/api/bookings/nonexistent-id \
  -H "Content-Type: application/json"
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Human-readable error message"
}
```

### Common Error Messages

| HTTP Code | Message | Cause |
|-----------|---------|-------|
| 400 | "Resource already booked for this time slot" | Time conflict |
| 400 | "Invalid email format" | Validation error |
| 400 | "Only PENDING bookings can be approved" | Invalid state transition |
| 400 | "Only APPROVED bookings can be cancelled" | Invalid state transition |
| 404 | (empty body) | Booking not found |
| 409 | "Resource already booked for this time slot" | Time conflict |

---

## Data Models

### Booking Object
```json
{
  "id": "507f1f77bcf86cd799439011",          // MongoDB ObjectId
  "resourceId": "room1",                      // Resource identifier
  "resourceName": "Conference Room A",        // Display name
  "userId": "user123",                        // User identifier
  "userName": "John Doe",                     // User full name
  "userEmail": "john@example.com",            // User email
  "date": "2026-04-20",                       // Date (YYYY-MM-DD)
  "startTime": "14:00",                       // Start time (HH:mm)
  "endTime": "15:00",                         // End time (HH:mm)
  "purpose": "Team meeting",                  // Booking purpose
  "expectedAttendees": 5,                     // Number of people
  "status": "PENDING",                        // Status enum
  "rejectionReason": null,                    // Reason if rejected
  "createdAt": "2026-04-19T10:30:00",        // ISO timestamp
  "updatedAt": "2026-04-19T10:30:00"         // ISO timestamp
}
```

### Status Enum
```
PENDING   - Awaiting admin review
APPROVED  - Confirmed by admin
REJECTED  - Denied by admin
CANCELLED - Cancelled by user/admin
```

---

## Testing with cURL

### Complete Test Sequence
```bash
# 1. Create a booking
BOOKING_ID=$(curl -s -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "room1",
    "userId": "user123",
    "userName": "Test User",
    "userEmail": "test@example.com",
    "date": "2026-04-25",
    "startTime": "10:00",
    "endTime": "11:00",
    "purpose": "Test meeting",
    "expectedAttendees": 2
  }' | jq -r '.id')

echo "Created booking: $BOOKING_ID"

# 2. Get the booking
curl -s http://localhost:8080/api/bookings/$BOOKING_ID | jq '.'

# 3. Approve the booking
curl -s -X PUT http://localhost:8080/api/bookings/$BOOKING_ID/approve \
  -H "Content-Type: application/json" | jq '.'

# 4. Cancel the booking
curl -s -X PUT http://localhost:8080/api/bookings/$BOOKING_ID/cancel \
  -H "Content-Type: application/json" | jq '.'

# 5. Get user's bookings
curl -s "http://localhost:8080/api/bookings/user/user123" | jq '.'
```

---

## Rate Limiting (Future)
Currently: No rate limiting
Planned: 100 requests per minute per IP

## Versioning (Future)
Current API version: v1 (implicit)
Planned versioning: /api/v1/bookings

## Status Transitions Diagram
```
           Create (POST)
               ↓
          PENDING
          /      \
    Approve     Reject
     /              \
APPROVED          REJECTED
    |                (terminal)
    |
  Cancel
    |
CANCELLED
(terminal)
```

---

**API Documentation Version**: 1.0
**Last Updated**: April 19, 2026
**Status**: Production Ready (with auth enhancements pending)
