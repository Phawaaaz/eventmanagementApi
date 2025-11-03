# Models Relationships and Structure

This document describes the relationships between all models in the Event Management system.

## Models Overview

### 1. User Model (`userModel.js`)
- **Model Name**: `user` (lowercase)
- **Collections**: `users`
- **Primary Fields**: name, email, password, role, active
- **Relationships**:
  - Has many `reviews` (via Review.user)
  - Has many `bookings` (via Booking.user)
  - Has many `eventsOrganized` (via Event.organizer)

### 2. Event Model (`eventModels.js`)
- **Model Name**: `Event` (capitalized)
- **Collections**: `events`
- **Primary Fields**: name, description, category, date, location, seats, bookedSeats, price, organizer
- **Relationships**:
  - Belongs to `organizer` (User)
  - Has many `reviews` (via Review.event)
  - Has many `bookings` (via Booking.event)
- **Virtual Fields**:
  - `availableSeats`: Calculated as seats - bookedSeats
  - `averageRating`: Will be calculated via aggregation
  - `numReviews`: Will be calculated via aggregation

### 3. Review Model (`reviewModel.js`)
- **Model Name**: `Review` (capitalized)
- **Collections**: `reviews`
- **Primary Fields**: review, rating, event, user
- **Relationships**:
  - Belongs to `event` (Event)
  - Belongs to `user` (User)
- **Constraints**:
  - Unique index on (event, user) - prevents duplicate reviews
  - Rating must be between 1 and 5

### 4. Booking Model (`bookingModel.js`)
- **Model Name**: `Booking` (capitalized)
- **Collections**: `bookings`
- **Primary Fields**: event, user, price, numSeats, status, paid
- **Relationships**:
  - Belongs to `event` (Event)
  - Belongs to `user` (User)
- **Status Values**: pending, confirmed, cancelled

## Relationship Diagram

```
User (organizer)
  └── Events (one-to-many)
       ├── Reviews (one-to-many)
       └── Bookings (one-to-many)

User
  ├── Reviews (one-to-many)
  └── Bookings (one-to-many)
```

## Indexes

### User Model
- `email` (unique)
- `active`
- `role`

### Event Model
- `category`
- `date`
- `location`
- `isActive`
- `organizer`

### Review Model
- `(event, user)` (unique compound)
- `event`
- `user`
- `rating`
- `createdAt` (descending)

### Booking Model
- `(event, user)` (compound)
- `event`
- `user`
- `status`
- `createdAt` (descending)

## Important Notes

### Model Naming Convention
- **User model**: `user` (lowercase) - used in references
- **Other models**: Capitalized (Event, Review, Booking) - used in references

### Cascade Deletes
MongoDB doesn't support cascade deletes natively. Consider implementing:
- When a User is deleted: Handle reviews and bookings manually
- When an Event is deleted: Handle reviews and bookings manually
- Soft delete users by setting `active: false` instead of hard delete

### Virtual Fields
Virtual fields are used for:
- Populating related documents without storing them
- Calculating computed values
- Maintaining relationships without denormalization

### Data Integrity
- Reviews: One user can only review an event once (enforced by unique index)
- Bookings: Check seat availability before creating booking
- Events: bookedSeats cannot exceed seats (enforced by validation)

## Query Optimization

All models include indexes on frequently queried fields:
- Foreign keys (event, user) are indexed
- Status fields are indexed
- Date fields are indexed for sorting
- Compound indexes for common query patterns

## Model Methods

### Event Model
- `isSoldOut()`: Check if event is sold out
- `bookSeats(numSeats)`: Increment bookedSeats
- `cancelBooking(numSeats)`: Decrement bookedSeats
- `softDelete()`: Mark event as inactive

### User Model
- `correctPassword()`: Compare password with hash

## Future Enhancements

Consider adding:
- Middleware for cascade deletes
- Aggregation pipelines for statistics
- Pre-save hooks for calculated fields
- Post-save hooks for notifications

