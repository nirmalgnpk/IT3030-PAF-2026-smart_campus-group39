# Smart Campus - Comprehensive Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Backend Functions](#backend-functions)
5. [Frontend Functions](#frontend-functions)
6. [API Endpoints](#api-endpoints)
7. [Database Models](#database-models)
8. [Setup & Installation](#setup--installation)
9. [Running the Project](#running-the-project)
10. [Features](#features)

---

## 🎯 Project Overview

**Smart Campus** is a comprehensive campus management system designed to streamline resource booking, facility management, user authentication, and administrative operations. The platform enables students, staff, and administrators to efficiently manage campus facilities, schedule bookings, and handle support tickets.

### Key Objectives:
- Efficient resource and facility management
- Centralized user authentication (Local & OAuth2)
- Real-time notifications and updates
- Admin dashboard for system monitoring
- Profile management and photo uploads
- OTP-based security for sensitive operations

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot (Java)
- **Build Tool**: Maven
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB
- **Email Service**: Integrated EmailService
- **File Storage**: Local file system

### Frontend
- **Framework**: React 18+ with Vite
- **State Management**: React Context API (AuthContext)
- **HTTP Client**: Axios
- **UI Components**: React Icons (Feather Icons)
- **Charts**: Recharts
- **Routing**: React Router v6

### Security
- Spring Security with JWT
- Password Encryption (PasswordEncoder)
- OTP-based verification
- CORS configuration for local development
- OAuth2 integration (Google)

---

## 📁 Project Structure

```
IT3030-PAF-2026-smart_campus-group39/
├── backend/                                 # Spring Boot Backend
│   ├── src/main/java/com/smartcampus/backend/
│   │   ├── config/                         # Configuration classes
│   │   │   ├── SecurityConfig.java        # Spring Security setup
│   │   │   ├── WebConfig.java             # CORS & web configuration
│   │   │   └── WebMvcConfig.java          # MVC configuration
│   │   ├── controller/                    # REST Controllers
│   │   │   ├── AuthController.java        # Authentication endpoints
│   │   │   ├── UserController.java        # User management
│   │   │   ├── ResourceController.java    # Facility/Resource CRUD
│   │   │   ├── NotificationController.java # Notification management
│   │   │   └── FileUploadController.java  # File handling
│   │   ├── service/                       # Business Logic
│   │   │   ├── UserService.java           # User operations
│   │   │   ├── AuthService.java           # Auth logic
│   │   │   ├── ResourceService.java       # Resource operations
│   │   │   ├── NotificationService.java   # Notification logic
│   │   │   ├── JwtService.java            # JWT token handling
│   │   │   ├── OtpService.java            # OTP generation/verification
│   │   │   ├── EmailService.java          # Email sending
│   │   │   └── FileStorageService.java    # File storage operations
│   │   ├── model/                         # Entity models
│   │   │   ├── User.java                  # User entity
│   │   │   ├── Resource.java              # Resource/Facility entity
│   │   │   ├── Notification.java          # Notification entity
│   │   │   └── OtpRecord.java             # OTP record
│   │   ├── dto/                           # Data Transfer Objects
│   │   │   ├── ResourceDTO.java           # Resource DTO
│   │   │   └── UserDTO.java               # User DTO
│   │   ├── repository/                    # MongoDB Repositories
│   │   │   ├── UserRepository.java        # User DB operations
│   │   │   ├── ResourceRepository.java    # Resource DB operations
│   │   │   └── NotificationRepository.java # Notification DB operations
│   │   ├── security/                      # Security components
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── CustomUserDetailsService.java
│   │   │   └── JwtAuthenticationEntryPoint.java
│   │   └── SmartCampusApplication.java    # Main Spring Boot app
│   ├── pom.xml                            # Maven dependencies
│   ├── mvnw & mvnw.cmd                    # Maven wrapper
│   └── target/                            # Compiled output
│
├── frontend/                               # React + Vite Frontend
│   ├── src/
│   │   ├── api.js                        # Axios API configuration
│   │   ├── AuthContext.jsx               # Authentication context provider
│   │   ├── App.jsx                       # Main app routing
│   │   ├── ProtectedRoute.jsx            # Route protection wrapper
│   │   ├── main.jsx                      # React entry point
│   │   ├── index.jsx                     # DOM rendering
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── OtpInput.jsx         # OTP input component
│   │   │   └── Navbar/
│   │   │       └── Navbar.jsx            # Navigation bar
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   └── Home.jsx              # Dashboard home page
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx             # Login page
│   │   │   │   ├── ForgotPassword.jsx    # Password reset
│   │   │   │   └── Oauth2callback.jsx    # OAuth2 callback handler
│   │   │   ├── Register/
│   │   │   │   └── Register.jsx          # User registration
│   │   │   ├── Profile/
│   │   │   │   └── Profile.jsx           # User profile management
│   │   │   ├── Admin/
│   │   │   │   └── AdminDashboard.jsx    # Admin dashboard
│   │   │   ├── facilities/
│   │   │   │   ├── FacilitiesPage.jsx   # Facilities listing
│   │   │   │   ├── ResourceCard.jsx      # Individual resource card
│   │   │   │   ├── ResourceDetailModal.jsx # Resource details
│   │   │   │   ├── ResourceFilter.jsx    # Filtering component
│   │   │   │   ├── ResourceForm.jsx      # Create/Edit resource form
│   │   │   │   ├── ResourceList.jsx      # Resource list container
│   │   │   │   └── README.md             # Facilities module docs
│   │   │   └── book/                     # Booking pages (placeholder)
│   │   ├── services/
│   │   │   └── resourceService.js        # Resource API calls
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── image/                    # Static images
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── public/
│
├── uploads/
│   └── profile-photos/                    # User profile photo storage
│
└── IMPLEMENTATION_CHECKLIST.md            # Project progress tracking
```

---

## 🔧 Backend Functions

### **AuthController** - Authentication Endpoints
**File**: `backend/src/main/java/.../controller/AuthController.java`

#### Methods:

1. **`sendRegisterOtp(Map<String, String> body)`** [POST]
   - Endpoint: `/api/auth/send-register-otp`
   - Purpose: Send OTP to email during registration
   - Parameters: `name`, `userName`, `email`, `password`, `role`
   - Validates user data and stores pending registration
   - Sends OTP via email service
   - Returns: Success message or error response

2. **`verifyRegisterOtp(Map<String, String> body)`** [POST]
   - Endpoint: `/api/auth/verify-register-otp`
   - Purpose: Verify OTP and complete registration
   - Parameters: `email`, `otp`
   - Creates new user in database if OTP is valid
   - Returns: JWT token and user data

3. **`login(Map<String, String> body)`** [POST]
   - Endpoint: `/api/auth/login`
   - Purpose: Authenticate user with email/password
   - Parameters: `email`, `password`
   - Validates credentials and generates JWT
   - Returns: Token, user info, and role

4. **`verify(HttpServletRequest request)`** [GET]
   - Endpoint: `/api/auth/verify`
   - Purpose: Verify and restore session from JWT token
   - Extracts token from Authorization header
   - Returns: User data if token is valid

5. **`logout(HttpServletRequest request)`** [POST]
   - Endpoint: `/api/auth/logout`
   - Purpose: Logout user and invalidate session
   - Clears authentication context
   - Returns: Success message

6. **`sendForgotPasswordOtp(Map<String, String> body)`** [POST]
   - Endpoint: `/api/auth/forgot-password/send-otp`
   - Purpose: Initiate password reset process
   - Parameters: `email`
   - Sends reset OTP to user email
   - Returns: Success message or user not found error

7. **`verifyForgotPasswordOtp(Map<String, String> body)`** [POST]
   - Endpoint: `/api/auth/forgot-password/verify-otp`
   - Purpose: Verify OTP for password reset
   - Parameters: `email`, `otp`
   - Generates temporary reset token
   - Returns: Reset token for next step

8. **`resetPassword(Map<String, String> body)`** [POST]
   - Endpoint: `/api/auth/forgot-password/reset`
   - Purpose: Reset password with token
   - Parameters: `resetToken`, `newPassword`
   - Updates user password and invalidates token
   - Returns: Success message

9. **`googleOAuth2Callback(Map<String, String> body)`** [POST]
   - Endpoint: `/api/auth/google-callback`
   - Purpose: Handle Google OAuth2 login
   - Parameters: `idToken`, `email`, `name`, `photoUrl`
   - Creates or finds user, generates JWT
   - Returns: Token and user data

10. **`uploadProfilePhoto(MultipartFile file)`** [POST]
    - Endpoint: `/api/auth/upload-profile-photo`
    - Purpose: Upload user profile photo
    - Stores file and returns accessible URL
    - Returns: File URL

---

### **UserController** - User Management Endpoints
**File**: `backend/src/main/java/.../controller/UserController.java`

#### Methods:

1. **`getAllUsers()`** [GET]
   - Endpoint: `/api/users`
   - Purpose: Fetch all users (admin only)
   - Returns: List of all users

2. **`getUserStats()`** [GET]
   - Endpoint: `/api/users/stats`
   - Purpose: Get comprehensive user statistics
   - Calculates:
     - Total users, students, technicians, managers, admins
     - Active vs disabled user counts
     - Local vs Google authenticated users
     - User registration by month
   - Returns: Statistics object with aggregated data

3. **`getUserById(String id)`** [GET]
   - Endpoint: `/api/users/{id}`
   - Purpose: Get user details by ID
   - Returns: User object or 404 if not found

4. **`createUser(UserDTO userDTO)`** [POST]
   - Endpoint: `/api/users`
   - Purpose: Create new user (admin endpoint)
   - Parameters: UserDTO with name, email, password, role
   - Returns: Created user object

5. **`updateUser(String id, Map<String, Object> body)`** [PUT]
   - Endpoint: `/api/users/{id}`
   - Purpose: Update user information
   - Parameters: Dynamic map with fields like name, userName, role, enabled
   - Returns: Updated user object

6. **`deleteUser(String id)`** [DELETE]
   - Endpoint: `/api/users/{id}`
   - Purpose: Delete user from system
   - Returns: 204 No Content

7. **`changePassword(String id, Map<String, String> body)`** [POST]
   - Endpoint: `/api/users/{id}/change-password`
   - Purpose: Change user password
   - Parameters: `currentPassword`, `newPassword`
   - Validates current password before changing
   - Returns: Success or error message

---

### **ResourceController** - Facility/Resource Management
**File**: `backend/src/main/java/.../controller/ResourceController.java`

#### Methods:

1. **`getAllResources(String type, String location, Integer minCapacity)`** [GET]
   - Endpoint: `/api/resources`
   - Purpose: Get all resources with optional filtering
   - Query Parameters:
     - `type`: Filter by resource type (LAB, CLASSROOM, LIBRARY, etc.)
     - `location`: Filter by location
     - `minCapacity`: Filter by minimum capacity
   - Returns: List of resources matching criteria

2. **`getResourceById(String id)`** [GET]
   - Endpoint: `/api/resources/{id}`
   - Purpose: Get single resource details
   - Returns: Resource object or 404

3. **`createResource(ResourceDTO resourceDTO)`** [POST]
   - Endpoint: `/api/resources`
   - Purpose: Create new facility/resource (admin only)
   - Parameters: ResourceDTO with name, type, capacity, location, etc.
   - Returns: Created resource object

4. **`updateResource(String id, ResourceDTO resourceDTO)`** [PUT]
   - Endpoint: `/api/resources/{id}`
   - Purpose: Update resource details
   - Parameters: ResourceDTO with updated fields
   - Returns: Updated resource or error

5. **`deleteResource(String id)`** [DELETE]
   - Endpoint: `/api/resources/{id}`
   - Purpose: Delete resource from system
   - Returns: 204 No Content

---

### **NotificationController** - Notification Management
**File**: `backend/src/main/java/.../controller/NotificationController.java`

#### Methods:

1. **`getUserNotifications(String userId)`** [GET]
   - Endpoint: `/api/notifications/user/{userId}`
   - Purpose: Fetch all notifications for a user (newest first)
   - Returns: List of notifications

2. **`getUnreadNotifications(String userId)`** [GET]
   - Endpoint: `/api/notifications/user/{userId}/unread`
   - Purpose: Fetch only unread notifications
   - Returns: List of unread notifications

3. **`getUnreadCount(String userId)`** [GET]
   - Endpoint: `/api/notifications/user/{userId}/unread-count`
   - Purpose: Get count of unread notifications (for badge)
   - Returns: `{ "count": number }`

4. **`createNotification(Map<String, String> body)`** [POST]
   - Endpoint: `/api/notifications`
   - Purpose: Create custom notification
   - Parameters: `userId`, `type`, `title`, `message`, `relatedId`
   - Notification Types: WELCOME, LOGIN, BOOKING, TICKET, RESOURCE, PROFILE, SYSTEM
   - Returns: Created notification object

5. **`sendBookingNotification(Map<String, String> body)`** [POST]
   - Endpoint: `/api/notifications/send/booking`
   - Purpose: Send booking-related notification
   - Parameters: `userId`, `status`, `details`, `bookingId`
   - Status Options: CONFIRMED, REJECTED, PENDING
   - Returns: Created notification

6. **`sendTicketNotification(Map<String, String> body)`** [POST]
   - Endpoint: `/api/notifications/send/ticket`
   - Purpose: Send support ticket notification
   - Parameters: `userId`, `status`, `response`, `ticketId`
   - Returns: Created notification

7. **`sendResourceNotification(Map<String, String> body)`** [POST]
   - Endpoint: `/api/notifications/send/resource`
   - Purpose: Notify user about new resource
   - Parameters: `userId`, `resourceName`, `resourceId`
   - Returns: Created notification

8. **`broadcast(Map<String, String> body)`** [POST]
   - Endpoint: `/api/notifications/broadcast`
   - Purpose: Send system-wide notification to all users (admin only)
   - Parameters: `title`, `message`
   - Returns: Number of recipients

9. **`markAsRead(String notificationId)`** [PUT]
   - Endpoint: `/api/notifications/{notificationId}/read`
   - Purpose: Mark single notification as read
   - Returns: Success message

10. **`markAllAsRead(String userId)`** [PUT]
    - Endpoint: `/api/notifications/user/{userId}/read-all`
    - Purpose: Mark all user notifications as read
    - Returns: Count of updated notifications

11. **`deleteNotification(String notificationId)`** [DELETE]
    - Endpoint: `/api/notifications/{notificationId}`
    - Purpose: Delete single notification
    - Returns: Success message or 404

12. **`deleteAllForUser(String userId)`** [DELETE]
    - Endpoint: `/api/notifications/user/{userId}`
    - Purpose: Delete all notifications for user
    - Returns: Success message

---

### **Service Layer Functions**

#### **UserService** - User Business Logic
**File**: `backend/src/main/java/.../service/UserService.java`

1. **`createUser(User user)`**
   - Saves new user to database
   - Returns: Created user with ID

2. **`getAllUsers()`**
   - Retrieves all users from database
   - Returns: List of users

3. **`getUserById(String id)`**
   - Fetches user by ID
   - Returns: User or null if not found

4. **`updateUser(String id, User user)`**
   - Updates existing user
   - Returns: Updated user

5. **`deleteUser(String id)`**
   - Removes user from database
   - Returns: void

6. **`changePassword(String userId, String currentPassword, String newPassword)`**
   - Validates current password
   - Encrypts and saves new password
   - Throws: RuntimeException if validation fails

---

#### **ResourceService** - Resource Business Logic
**File**: `backend/src/main/java/.../service/ResourceService.java`

1. **`getAllResources()`**
   - Retrieves all resources
   - Returns: List of resources

2. **`getResourceById(String id)`**
   - Fetches resource by ID
   - Returns: Optional<Resource>

3. **`searchResources(String type, String location, Integer minCapacity)`**
   - Filters resources by multiple criteria
   - Supports partial matching
   - Returns: Filtered list of resources

4. **`createResource(ResourceDTO dto)`**
   - Converts DTO to entity and saves
   - Returns: Created resource

5. **`updateResource(String id, ResourceDTO dto)`**
   - Updates resource fields
   - Returns: Updated resource
   - Throws: RuntimeException if not found

6. **`deleteResource(String id)`**
   - Hard delete of resource
   - Throws: RuntimeException if not found

7. **`mapDTOToResource(ResourceDTO dto)`** [Private]
   - Converts DTO to entity
   - Handles all field mappings

---

#### **JwtService** - JWT Token Management
**File**: `backend/src/main/java/.../service/JwtService.java`

1. **`generateToken(String email, String role, String userId)`**
   - Creates JWT token with user claims
   - Expiration: Configured time (typically 24 hours)
   - Returns: Compact token string

2. **`extractEmail(String token)`**
   - Extracts email from token claims
   - Returns: Email string

3. **`extractRole(String token)`**
   - Extracts user role from token
   - Returns: Role string

4. **`extractUserId(String token)`**
   - Extracts user ID from token
   - Returns: User ID string

5. **`isTokenValid(String token)`**
   - Validates token signature and expiration
   - Returns: boolean

6. **`parseClaims(String token)`** [Private]
   - Parses and verifies JWT
   - Returns: Claims object

---

#### **OtpService** - OTP Management
**File**: `backend/src/main/java/.../service/OtpService.java`

1. **`generateAndStore(String email)`**
   - Generates 6-digit random OTP
   - Stores with 10-minute expiration
   - Returns: OTP code string

2. **`verify(String email, String code)`**
   - Validates OTP against stored record
   - Checks expiration and usage
   - Marks as used on success
   - Returns: boolean

3. **`remove(String email)`**
   - Removes OTP entry after use
   - Returns: void

---

#### **FileStorageService** - File Operations
**File**: `backend/src/main/java/.../service/FileStorageService.java`

1. **`store(MultipartFile file)`**
   - Saves file to configured directory
   - Generates UUID filename to avoid conflicts
   - Preserves file extension
   - Returns: Filename string
   - Throws: IOException

---

#### **EmailService** - Email Operations
**File**: `backend/src/main/java/.../service/EmailService.java`

1. **`sendOtp(String email, String otp, String purpose)`**
   - Sends OTP via email
   - Purpose: "REGISTER" or "PASSWORD_RESET"
   - Returns: void
   - Throws: Exception if sending fails

---

#### **NotificationService** - Notification Business Logic
**File**: `backend/src/main/java/.../service/NotificationService.java`

1. **`getUserNotifications(String userId)`**
   - Retrieves all notifications for user
   - Ordered by newest first
   - Returns: List of notifications

2. **`getUnreadNotifications(String userId)`**
   - Gets unread notifications only
   - Returns: List of unread notifications

3. **`getUnreadCount(String userId)`**
   - Counts unread notifications
   - Returns: Long count

4. **`createNotification(String userId, String type, String title, String message, String relatedId)`**
   - Creates and saves notification
   - Returns: Created notification

5. **`markAsRead(String notificationId)`**
   - Marks notification as read
   - Returns: boolean (success/not found)

6. **`markAllAsRead(String userId)`**
   - Marks all user notifications as read
   - Returns: int (count updated)

7. **`deleteNotification(String notificationId)`**
   - Deletes notification
   - Returns: boolean (success/not found)

8. **`deleteAllForUser(String userId)`**
   - Deletes all user notifications
   - Returns: void

9. **`broadcastToAll(String title, String message)`**
   - Sends notification to all users
   - Returns: int (recipient count)

---

## 🎨 Frontend Functions

### **AuthContext** - Authentication State Management
**File**: `frontend/src/AuthContext.jsx`

#### Context Functions:

1. **`login(userData)`**
   - Stores JWT token in localStorage
   - Sets Authorization header in axios
   - Updates currentUser state
   - Normalizes user data structure

2. **`logout()`**
   - Calls backend logout endpoint
   - Clears authentication state
   - Removes token from storage

3. **`clearAuth()`** [Private]
   - Removes stored token
   - Clears axios headers
   - Resets user state

4. **`getAuthHeader()`**
   - Returns Authorization header object
   - Retrieves token from localStorage
   - Used for manual axios calls

5. **`normalizeUser(userData, token)`** [Private]
   - Ensures consistent user object structure
   - Maps both `id` and `userId` fields
   - Attaches token to user object

#### Context Properties:
- `currentUser`: Current logged-in user object
- `loading`: Loading state during initialization
- `children`: React components

---

### **API Service** - HTTP Configuration
**File**: `frontend/src/api.js`

1. **`axios.create(config)`**
   - Creates axios instance with base URL: `http://localhost:8080`
   - Configures request interceptor

2. **Request Interceptor**
   - Automatically adds Bearer token from localStorage
   - Runs before every API request
   - Sets Authorization header if token exists

---

### **resourceService** - Resource API Functions
**File**: `frontend/src/services/resourceService.js`

1. **`buildQueryString(filters)`** [Private]
   - Builds URL query string from filter object
   - Supports: type, location, minCapacity
   - Returns: Query string (e.g., "?type=LAB&location=Block+A")

2. **`getAllResources(filters = {})`** [Async]
   - Endpoint: GET `/api/resources`
   - Fetches resources with optional filtering
   - Parameters:
     - `filters`: Object with optional `type`, `location`, `minCapacity`
   - Returns: Promise<array> of resources
   - Throws: Error if request fails

3. **`getResourceById(id)`** [Async]
   - Endpoint: GET `/api/resources/{id}`
   - Fetches single resource details
   - Parameters: Resource ID string
   - Returns: Promise<object> resource
   - Throws: Error if not found

4. **`createResource(resourceData)`** [Async]
   - Endpoint: POST `/api/resources`
   - Creates new resource
   - Parameters: Resource data object
   - Returns: Promise<object> created resource
   - Throws: Error if validation fails

5. **`updateResource(id, resourceData)`** [Async]
   - Endpoint: PUT `/api/resources/{id}`
   - Updates existing resource
   - Parameters: Resource ID and updated data
   - Returns: Promise<object> updated resource
   - Throws: Error if not found

6. **`deleteResource(id)`** [Async]
   - Endpoint: DELETE `/api/resources/{id}`
   - Soft deletes resource
   - Parameters: Resource ID
   - Returns: Promise<object> or success object
   - Throws: Error if deletion fails

---

### **App Component** - Main Router
**File**: `frontend/src/App.jsx`

#### Routes Configuration:

**Public Routes:**
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset
- `/oauth-callback` - OAuth2 callback

**Protected Routes (Any logged-in user):**
- `/dashboard` - User dashboard
- `/facilities` - Facilities/resources listing
- `/facilities/:id` - Resource details
- `/bookings` - User bookings
- `/tickets` - Support tickets
- `/notifications` - Notifications page
- `/profile` - User profile management

**Admin-Only Routes:**
- `/admin/dashboard` - Admin control panel
- `/admin/tickets` - Technician ticket management

#### Styling:
- Global font: DM Sans
- Keyframe animations: spin, fadeIn
- Focus states for inputs
- Hover effects for interactive elements

---

### **App Structure Components**

#### **Navbar** - Navigation Bar
**File**: `frontend/src/components/Navbar/Navbar.jsx`
- Responsive navigation bar
- User menu with logout
- Role-based menu items
- Notification badge
- Mobile-friendly hamburger menu

#### **OtpInput** - OTP Entry Component
**File**: `frontend/src/components/auth/OtpInput.jsx`
- 6-digit OTP input field
- Auto-focus between inputs
- Paste support
- Clear button
- Keyboard navigation

#### **ProtectedRoute** - Route Protection Wrapper
**File**: `frontend/src/ProtectedRoute.jsx`
- Checks authentication status
- Role-based access control
- Optional `roles` prop for specific permissions
- Redirects to login if not authenticated
- Shows unauthorized message for invalid roles

---

### **Page Components**

#### **Home** - Dashboard/Home Page
**File**: `frontend/src/pages/Home/Home.jsx`
- Welcome screen for authenticated users
- Quick access to main features
- User information display
- Recent activities

#### **Login** - Authentication
**File**: `frontend/src/pages/Login/Login.jsx`
- Email and password input
- "Remember me" checkbox
- "Forgot password" link
- Google OAuth2 button
- Error message display
- Loading state

#### **Register** - User Registration
**File**: `frontend/src/pages/Register/Register.jsx`
- Multi-step registration form
- OTP verification step
- User information input (name, email, password)
- Role selection dropdown
- Email validation
- Password strength indicator

#### **ForgotPassword** - Password Recovery
**File**: `frontend/src/pages/Login/ForgotPassword.jsx`
- Email input for account lookup
- OTP verification step
- New password input
- Password confirmation
- Success notification

#### **Oauth2callback** - OAuth2 Handler
**File**: `frontend/src/pages/Login/Oauth2callback.jsx`
- Handles OAuth2 redirect
- Exchanges auth code for token
- Creates or logs in user
- Redirects to dashboard

#### **Profile** - User Profile Management
**File**: `frontend/src/pages/Profile/Profile.jsx`
- Display user information
- Edit profile fields
- Profile photo upload
- Password change
- Account settings
- Delete account option

#### **FacilitiesPage** - Facility Browsing
**File**: `frontend/src/pages/facilities/FacilitiesPage.jsx`
- Displays all campus facilities/resources
- Statistics dashboard:
  - Total rooms count
  - Available rooms
  - Out of service count
- Modal views for filtering
- Search and filter functionality
- Admin controls (create, edit, delete)

#### **ResourceCard** - Facility Display Card
**File**: `frontend/src/pages/facilities/ResourceCard.jsx`
- Individual facility card display
- Resource details preview
- Status badge (Available/Out of Service)
- Booking button
- Resource type icon
- Capacity display

#### **ResourceList** - Facility List Container
**File**: `frontend/src/pages/facilities/ResourceList.jsx`
- Container for multiple resource cards
- Grid/list view toggle
- Sort functionality
- Pagination
- Empty state handling

#### **ResourceDetailModal** - Facility Details
**File**: `frontend/src/pages/facilities/ResourceDetailModal.jsx`
- Full facility information
- Availability schedule
- Booking form
- Photo gallery
- User reviews/ratings
- Similar resources

#### **ResourceFilter** - Filtering Component
**File**: `frontend/src/pages/facilities/ResourceFilter.jsx`
- Filter by type (LAB, CLASSROOM, LIBRARY, etc.)
- Filter by location
- Filter by capacity range
- Sort options
- Apply/Reset buttons
- Active filters display

#### **ResourceForm** - Create/Edit Facility
**File**: `frontend/src/pages/facilities/ResourceForm.jsx`
- Form for creating new resource
- Form for editing existing resource
- Fields:
  - Resource name
  - Type selection
  - Location input
  - Capacity number
  - Availability windows
  - Status selection
  - Description
- Form validation
- Submit button
- Cancel option

#### **AdminDashboard** - Admin Control Panel
**File**: `frontend/src/pages/Admin/AdminDashboard.jsx`

**Features:**
- User Management
  - View all users table
  - Search users
  - Filter by role
  - Edit user details
  - Enable/Disable users
  - Delete users
  - Change user roles

- Statistics
  - User count by role (pie chart)
  - User registration trends (line chart)
  - Active vs disabled users (bar chart)
  - Total active users
  - User activity timeline

- Notification Management
  - Unread notifications badge
  - Notifications panel
  - Mark as read
  - Create broadcast notification
  - Delete notifications

- Tabs:
  - Users tab: User management
  - Notifications tab: Notification management
  - Resources tab: Facility management
  - Tickets tab: Support ticket management

---

## 📡 API Endpoints Summary

### Authentication Endpoints
```
POST   /api/auth/send-register-otp         - Send registration OTP
POST   /api/auth/verify-register-otp       - Verify OTP & register
POST   /api/auth/login                     - Login user
GET    /api/auth/verify                    - Verify session token
POST   /api/auth/logout                    - Logout user
POST   /api/auth/forgot-password/send-otp  - Send password reset OTP
POST   /api/auth/forgot-password/verify-otp - Verify reset OTP
POST   /api/auth/forgot-password/reset     - Reset password
POST   /api/auth/google-callback           - OAuth2 Google callback
POST   /api/auth/upload-profile-photo      - Upload profile photo
```

### User Management Endpoints
```
GET    /api/users                      - Get all users
GET    /api/users/stats                - Get user statistics
GET    /api/users/{id}                 - Get user by ID
POST   /api/users                      - Create user
PUT    /api/users/{id}                 - Update user
DELETE /api/users/{id}                 - Delete user
POST   /api/users/{id}/change-password - Change user password
```

### Resource Management Endpoints
```
GET    /api/resources                  - Get all resources (with filters)
GET    /api/resources/{id}             - Get resource by ID
POST   /api/resources                  - Create resource
PUT    /api/resources/{id}             - Update resource
DELETE /api/resources/{id}             - Delete resource
```

### Notification Endpoints
```
GET    /api/notifications/user/{userId}              - Get user notifications
GET    /api/notifications/user/{userId}/unread       - Get unread notifications
GET    /api/notifications/user/{userId}/unread-count - Get unread count
POST   /api/notifications                            - Create notification
POST   /api/notifications/send/booking               - Send booking notification
POST   /api/notifications/send/ticket                - Send ticket notification
POST   /api/notifications/send/resource              - Send resource notification
POST   /api/notifications/broadcast                  - Broadcast to all users
PUT    /api/notifications/{notificationId}/read      - Mark as read
PUT    /api/notifications/user/{userId}/read-all     - Mark all as read
DELETE /api/notifications/{notificationId}           - Delete notification
DELETE /api/notifications/user/{userId}              - Delete all for user
```

---

## 📊 Database Models

### User Model
```
{
  _id: ObjectId
  name: String (required)
  userName: String (unique, required)
  email: String (unique, required)
  password: String (encrypted, required)
  role: String (ADMIN, MANAGER, TECHNICIAN, STUDENT, USER)
  enabled: Boolean (default: true)
  provider: String (LOCAL or GOOGLE)
  googleId: String (if OAuth)
  profilePhotoUrl: String
  profilePhotoPath: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Resource Model
```
{
  _id: ObjectId
  name: String (required)
  type: String (LAB, CLASSROOM, LIBRARY, AUDITORIUM, SPORTS_FACILITY, etc.)
  capacity: Integer
  location: String
  description: String
  status: String (ACTIVE, UNDER_MAINTENANCE, OUT_OF_SERVICE)
  availabilityWindows: [{
    day: String (MON, TUE, etc.)
    startTime: String
    endTime: String
  }]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Notification Model
```
{
  _id: ObjectId
  userId: String (reference to User)
  type: String (WELCOME, LOGIN, BOOKING, TICKET, RESOURCE, PROFILE, SYSTEM)
  title: String
  message: String
  read: Boolean (default: false)
  relatedId: String (optional, links to booking/ticket/resource)
  createdAt: DateTime
}
```

### OTP Record Model
```
{
  code: String (6-digit)
  expiryTime: DateTime
  isUsed: Boolean (default: false)
}
```

---

## 🚀 Setup & Installation

### Prerequisites
- Java 11+
- Node.js 16+
- npm or yarn
- MongoDB
- Git

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Build with Maven**
```bash
./mvnw clean install
```

3. **Configure application.properties**
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/smartcampus
spring.data.mongodb.database=smartcampus

jwt.secret=your-super-secret-jwt-key-here-min-256-chars
jwt.expiration=86400000

file.upload-dir=./uploads/profile-photos

mail.smtp.host=smtp.gmail.com
mail.smtp.port=587
mail.from=your-email@gmail.com
mail.password=your-app-password
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoints in api.js**
```javascript
const api = axios.create({
    baseURL: "http://localhost:8080",
});
```

---

## 🎯 Running the Project

### Start Backend
```bash
cd backend
./mvnw spring-boot:run
```
- Server runs on `http://localhost:8080`
- Swagger docs available at `http://localhost:8080/swagger-ui.html`

### Start Frontend
```bash
cd frontend
npm run dev
```
- Frontend runs on `http://localhost:5173` (Vite default)
- Or as configured in vite.config.js

### Access Application
- Homepage: `http://localhost:5173/`
- Login: `http://localhost:5173/login`
- Admin Dashboard: `http://localhost:5173/admin/dashboard` (requires ADMIN role)

---

## ✨ Features

### Authentication & Security
- ✅ Local user registration with email verification
- ✅ OTP-based email verification
- ✅ JWT token-based authentication
- ✅ Google OAuth2 integration
- ✅ Password encryption and secure reset
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and endpoints

### User Management
- ✅ User registration and login
- ✅ Profile management with photo upload
- ✅ Password change functionality
- ✅ User statistics and analytics
- ✅ Admin user management dashboard
- ✅ Enable/disable user accounts
- ✅ Role assignment and modification

### Facility Management
- ✅ Create, read, update, delete facilities
- ✅ Resource filtering by type, location, capacity
- ✅ Resource availability scheduling
- ✅ Resource status tracking
- ✅ Detailed resource information
- ✅ Gallery and description support

### Notification System
- ✅ Real-time notifications
- ✅ Multiple notification types (Booking, Ticket, Resource, System)
- ✅ Unread notification tracking
- ✅ Broadcast notifications (admin)
- ✅ Notification history
- ✅ Mark as read functionality

### Admin Dashboard
- ✅ User management interface
- ✅ User statistics and charts
- ✅ Role and status management
- ✅ System notifications
- ✅ Resource management
- ✅ Activity monitoring

### Responsive Design
- ✅ Mobile-friendly interface
- ✅ Responsive grid layouts
- ✅ Touch-friendly navigation
- ✅ Adaptive font sizes
- ✅ Cross-browser compatibility

---

## 📝 Notes

- All passwords are encrypted using Spring Security's PasswordEncoder
- JWT tokens expire after 24 hours (configurable)
- OTP codes expire after 10 minutes
- All file uploads are stored locally in `uploads/profile-photos/`
- MongoDB is used as the primary database
- CORS is configured for development (localhost:3000 and localhost:5173)

---

## 👥 Project Team

- **Year**: 2026
- **Course**: IT3030 PAF (Project and Application Framework)
- **Group**: 39
- **Project Name**: Smart Campus

---

## 📄 License

This project is part of the academic curriculum. All rights reserved.

---

**Last Updated**: April 26, 2026
**Version**: 1.0.0
