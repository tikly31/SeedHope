# SeedHope - Crowdfunding & Fundraising Platform

A full-stack mobile and web application for creating, managing, and contributing to fundraising campaigns. Built with Spring Boot backend and React Native frontend, this platform enables users to raise funds for various causes including medical, education, disaster relief, and community projects.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Project Structure](#project-structure)
- [Features Breakdown](#features-breakdown)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Screenshots](#screenshots)

## 🎯 Overview

SeedHope is a comprehensive crowdfunding platform designed to connect people who need financial support with those willing to help. The application provides a secure, user-friendly interface for creating fundraising campaigns, making donations, and tracking progress toward funding goals.

**Key Highlights:**

- Cross-platform mobile application (iOS & Android)
- RESTful API backend with Spring Boot
- Secure authentication (JWT & OAuth2)
- Integrated payment gateway (SSLCommerz & Stripe)
- Real-time campaign tracking
- Comment system with nested replies
- File upload capabilities

## ✨ Key Features

### 1. **User Management**

- User registration and authentication (JWT-based)
- Google OAuth2 integration for social login
- Profile management with photo upload
- Password encryption using BCrypt
- Role-based access control (User/Admin)
- Top contributors leaderboard

### 2. **Campaign/Fundraiser Management**

- Create fundraising campaigns with detailed information
- Multiple campaign categories (Medical, Education, Disaster, Environment, Emergency, Family, Sports, Community)
- Campaign status workflow (Pending → Approved → Active → Done/Rejected)
- Photo and document uploads for campaigns
- Set funding goals and due dates
- Track raised amounts in real-time
- Edit and update campaigns
- Search and filter campaigns by category
- Campaign sorting options (by date, goal amount, status, due date)
- Trending campaigns feature
- Successful campaigns listing

### 3. **Donation System**

- Secure donation processing
- Multiple payment methods integration (SSLCommerz, Stripe)
- Preset and custom donation amounts
- Donation history tracking
- User donation statistics
- Anonymous donation option
- Payment status tracking (Success/Failed/Cancelled)
- IPN (Instant Payment Notification) handling

### 4. **Payment Gateway Integration**

- **SSLCommerz** integration for local payments
- **Stripe** integration for international payments
- Secure transaction processing
- Payment webhooks and callbacks
- Transaction ID tracking
- Payment status management
- Refund support

### 5. **Comments & Engagement**

- Add comments to campaigns
- Nested reply system (parent-child comments)
- Paginated comment loading
- User profile display on comments
- Like functionality on comments
- Real-time comment updates

### 6. **Search & Discovery**

- Search campaigns by title
- Filter by categories
- Sort campaigns by various criteria
- View trending campaigns
- Category-wise browsing
- Campaign details view with progress tracking

### 7. **File Management**

- Campaign photo uploads
- User profile picture uploads
- Document uploads for verification
- Separate storage for different file types
- File size validation (up to 10MB)
- Secure file storage

### 8. **Social Features**

- Share campaigns via social media
- Top contributors showcase
- Campaign organizer profiles
- User bio and information
- Campaign engagement metrics

### 9. **Security Features**

- JWT token-based authentication
- Spring Security integration
- Password hashing with BCrypt
- OAuth2 for Google login
- CORS configuration
- Secure API endpoints
- Role-based authorization

### 10. **Admin Features**

- Campaign approval/rejection workflow
- View all pending campaigns
- Update campaign status
- Monitor all campaigns
- User management

## 🛠 Technology Stack

### Backend

- **Framework:** Spring Boot 3.3.5
- **Language:** Java 17
- **Database:** PostgreSQL (Aiven Cloud)
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security, JWT, OAuth2
- **API Documentation:** RESTful APIs
- **Build Tool:** Maven
- **Payment:** Stripe API, SSLCommerz
- **Additional Libraries:**
  - Lombok (reducing boilerplate)
  - JWT (io.jsonwebtoken)
  - BCrypt (password encryption)
  - Jackson (JSON processing)

### Frontend

- **Framework:** React Native with Expo
- **Language:** TypeScript/JavaScript
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **State Management:** React Hooks
- **UI Components:**
  - React Native Paper
  - Expo Linear Gradient
  - Expo Vector Icons
  - React Native Reanimated
  - NativeWind (Tailwind for React Native)
- **HTTP Client:** Axios
- **Authentication:** JWT Decode, Async Storage
- **Forms:** React Native DateTimePicker, Picker
- **Payment:** WebView for payment gateways
- **Additional Features:**
  - Expo Image Picker
  - Expo Document Picker
  - Expo File System
  - React Native Gesture Handler
  - Google Sign-In

### Database Schema

- **Users:** User authentication and profile data
- **Campaigns:** Fundraiser information
- **Donations:** Donation transactions
- **Comments:** Campaign comments and replies
- **Payments:** Payment transaction records
- **Payment Status:** Transaction status tracking

## 🏗 Architecture & Design Patterns

### Design Patterns Implemented

1. **Builder Pattern**
   - Used in `Payment` model for flexible object creation
   - Used in `User` model (UserBuilder) for complex user object construction

2. **Strategy Pattern**
   - Campaign sorting strategies (`CampaignSortStrategy` interface)
   - Multiple sorting implementations:
     - `SortByCreationDateDesc`
     - `SortByDueDateAsc`
     - `SortByGoalAmountStrategy`
     - `SortByStatusStrategy`
     - `SortByDateStrategy`

3. **Observer Pattern**
   - `PaymentObserver` interface for payment event notifications
   - Used for updating campaign amounts on successful donations

4. **Factory Pattern**
   - `CampaignFactory` for campaign object creation
   - Centralizes campaign instantiation logic

5. **MVC (Model-View-Controller)**
   - Backend follows MVC architecture
   - Controllers handle HTTP requests
   - Services contain business logic
   - Repositories manage data access

6. **Repository Pattern**
   - Spring Data JPA repositories for data access
   - Abstraction layer for database operations

7. **DTO (Data Transfer Object) Pattern**
   - `CommentDTO` for transferring comment data
   - `PaymentRequest` and `PaymentResponse` for payment operations
   - Separates internal models from API responses

### Backend Architecture Layers

```
┌─────────────────────────────────────────┐
│          Controllers                     │  ← REST API Endpoints
├─────────────────────────────────────────┤
│          Services                        │  ← Business Logic
├─────────────────────────────────────────┤
│          Repositories                    │  ← Data Access Layer
├─────────────────────────────────────────┤
│          Models/Entities                 │  ← Database Entities
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
SeedHope/
├── Backend/
│   └── seedhope/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/example/seedhope/seedhope/
│       │   │   │   ├── config/          # Security & App Configuration
│       │   │   │   ├── controller/      # REST Controllers
│       │   │   │   ├── dto/            # Data Transfer Objects
│       │   │   │   ├── exception/      # Exception Handlers
│       │   │   │   ├── Factory/        # Factory Pattern
│       │   │   │   ├── model/          # JPA Entities
│       │   │   │   ├── observer/       # Observer Pattern
│       │   │   │   ├── repository/     # Data Repositories
│       │   │   │   ├── response/       # API Response Models
│       │   │   │   ├── service/        # Business Logic
│       │   │   │   │   └── strategy/   # Strategy Pattern
│       │   │   │   └── util/           # Utility Classes
│       │   │   └── resources/
│       │   │       ├── application.properties
│       │   │       └── photos/         # Uploaded Files
│       │   └── test/                   # Unit Tests
│       └── pom.xml                     # Maven Configuration
│
└── Frontend/
    ├── app/
    │   ├── src/
    │   │   ├── assets/                 # Images & Fonts
    │   │   ├── components/             # Reusable Components
    │   │   │   ├── BottomNavBar.tsx
    │   │   │   ├── FundraiserCard.tsx
    │   │   │   ├── DonationCard.tsx
    │   │   │   ├── Categories.tsx
    │   │   │   ├── Header.tsx
    │   │   │   └── ...
    │   │   ├── screen/                 # App Screens
    │   │   │   ├── HomeScreen.tsx
    │   │   │   ├── LogInScreen.tsx
    │   │   │   ├── SignUpScreen.tsx
    │   │   │   ├── CreateFundraiser.tsx
    │   │   │   ├── FundraiserDetailsScreen.tsx
    │   │   │   ├── DonationPage.tsx
    │   │   │   ├── ProfileScreen.tsx
    │   │   │   ├── SearchScreen.tsx
    │   │   │   ├── CommentScreen.tsx
    │   │   │   └── ...
    │   │   └── utils/                  # Helper Functions & API
    │   ├── (tabs)/                     # Tab Navigation
    │   └── _layout.tsx                 # Root Layout
    ├── android/                        # Android Native Code
    ├── ios/                           # iOS Native Code
    └── package.json                    # Dependencies
```

## 🎨 Features Breakdown

### Authentication Flow

```
1. User Registration → Email/Password stored with BCrypt
2. User Login → JWT token generated
3. Token stored in AsyncStorage (Mobile)
4. All API requests include JWT in Authorization header
5. Alternative: Google OAuth2 login
```

### Campaign Creation Workflow

```
1. User creates campaign with details
   ├── Title, Description
   ├── Category selection
   ├── Goal amount
   ├── Due date
   ├── Photo upload
   └── Document upload (optional)
2. Campaign status set to "PENDING"
3. Admin reviews campaign
4. Admin approves/rejects
5. Approved campaigns visible to all users
6. Users can donate to approved campaigns
7. Raised amount updates automatically
8. Campaign marked "DONE" when goal reached
```

### Donation Flow

```
1. User selects campaign
2. Enters donation amount
3. Chooses payment method
   ├── SSLCommerz (Local)
   └── Stripe (International)
4. Payment gateway opens
5. User completes payment
6. IPN/Webhook received
7. Payment status updated
8. Campaign raised amount updated
9. User's donation history updated
10. Top contributor list updated
```

### Comment System

```
Campaign Comments
├── Top-level comments (paginated)
│   ├── Reply 1
│   ├── Reply 2
│   └── Reply 3
└── Load more comments
    └── Nested replies supported
```

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/register` - Register new user
- `POST /api/v1/login` - User login (returns JWT)
- `GET /oauth2/callback/google` - Google OAuth callback
- `GET /me` - Get current user details
- `PUT /update/me` - Update user profile
- `PUT /update/password` - Update password
- `GET /passwordChecker/{password}` - Verify current password

### User Management

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /contributors` - Get top contributors

### Campaign Management

- `POST /campaign` - Create new campaign
- `PUT /campaign/update` - Update campaign
- `GET /campaign` - Get all approved campaigns
- `GET /campaign/all` - Get all campaigns (admin)
- `GET /campaign/pending` - Get pending campaigns (admin)
- `GET /campaign/{id}` - Get campaign details
- `PATCH /campaign/{id}/status` - Update campaign status (admin)
- `GET /campaign/category?category={name}` - Get campaigns by category
- `GET /campaign/sorted?sortBy={criteria}` - Get sorted campaigns
- `GET /campaign/successful` - Get successful campaigns
- `GET /campaign/trending` - Get trending campaigns
- `PATCH /campaign/{id}/updateAmount` - Update raised amount
- `GET /campaign/{category}/search?query={text}` - Search campaigns
- `GET /api/v1/campaigns/{organizerId}` - Get user's campaigns

### Donation Management

- `GET /api/donation/all` - Get all donations
- `GET /api/donation/me/{userId}` - Get user's donation history

### Payment Processing

- `POST /api/payment/initiate` - Initiate payment
- `POST /api/payment/ipn` - Payment IPN handler
- `POST /api/payment/success/{transactionId}` - Payment success callback
- `POST /api/payment/fail/{transactionId}` - Payment failure callback
- `POST /api/payment/cancel/{transactionId}` - Payment cancellation
- `GET /api/payment/status/{transactionId}` - Get payment status

### Comments

- `POST /api/comments` - Create comment
- `GET /api/comments/campaign/{campaignId}` - Get campaign comments
- `GET /api/comments/campaign/{campaignId}/paginated` - Get paginated comments
- `POST /api/comments/add/{parentCommentId}/replies` - Add reply
- `GET /api/comments/{parentCommentId}/replies` - Get comment replies

### File Uploads

- `POST /uploads/campaign` - Upload campaign photo
- `POST /uploads/user` - Upload user photo
- `POST /uploads/document` - Upload document

## 🚀 Setup & Installation

### Prerequisites

- Java 17+
- Maven
- Node.js & npm
- PostgreSQL
- Android Studio / Xcode (for mobile development)
- Expo CLI

### Backend Setup

```bash
# Navigate to backend directory
cd Backend/seedhope

# Install dependencies
mvn clean install

# Configure database in application.properties
spring.datasource.url=jdbc:postgresql://your-db-url
spring.datasource.username=your-username
spring.datasource.password=your-password

# Configure payment gateways
stripe.secret.key=your-stripe-key
sslcommerz.store.id=your-store-id
sslcommerz.store.password=your-password

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Update API base URL in config.js
export const API_BASE_URL = 'http://your-backend-url:8080';

# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📸 Screenshots

_(Add your application screenshots here)_

## 🔒 Security Features

- JWT token authentication with expiration
- BCrypt password hashing (strength 12)
- OAuth2 Google integration
- CORS configuration
- Spring Security filter chain
- Protected API endpoints
- Secure file uploads
- SQL injection prevention (JPA)
- XSS protection

## 🎯 Use Cases

1. **Medical Fundraising:** Raise funds for medical treatments and emergencies
2. **Education:** Collect donations for educational expenses
3. **Disaster Relief:** Quick fundraising for disaster victims
4. **Community Projects:** Fund local community initiatives
5. **Emergency Support:** Immediate financial help for urgent needs
6. **Environmental Causes:** Support environmental conservation projects
7. **Sports Events:** Fundraise for sports teams and events
8. **Family Support:** Help families in financial distress

## 📊 Key Metrics Tracked

- Total donations received
- Number of campaigns created
- Success rate of campaigns
- Top contributors
- Campaign progress (percentage funded)
- Donation history per user
- Trending campaigns
- Category-wise analytics

## 🧪 Testing

The project includes:

- Backend unit tests (JUnit)
- Integration tests for APIs
- Frontend component testing (Jest)

## 🤝 Contributing

This is a personal portfolio project built for demonstration purposes.

## 📝 License

This project is part of a personal portfolio and was built for educational purposes.

## 👨‍💻 Developer

Built by **HP** as a Software Development Project

## 📞 Interview Talking Points

When discussing this project in interviews, highlight:

1. **Full-stack Development:** End-to-end application development
2. **Design Patterns:** Practical implementation of multiple design patterns
3. **Payment Integration:** Real-world payment gateway integration
4. **Security:** JWT, OAuth2, and secure authentication
5. **Database Design:** Normalized schema with relationships
6. **RESTful APIs:** Well-structured REST API design
7. **Mobile Development:** Cross-platform React Native development
8. **State Management:** Complex state management in React
9. **File Handling:** Secure file upload and storage
10. **Real-world Application:** Solves actual social problems

## 🔮 Future Enhancements

- Push notifications for campaign updates
- Real-time chat support
- Campaign analytics dashboard
- Multi-language support
- Social media feed integration
- Email notifications
- Campaign milestones
- Fundraiser verification system
- Tax receipt generation
- Recurring donations

---

**Note:** This project was built 2 years ago as part of a Software Development Project course and demonstrates proficiency in full-stack development, design patterns, and modern web technologies.
It's a fund raising app created for Bangladesh.
