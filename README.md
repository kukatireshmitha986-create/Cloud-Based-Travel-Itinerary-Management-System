# ☁️ Cloud-Based Travel Itinerary Management System

<p align="center">
  <strong>A Full-Stack Cloud Computing Application for Intelligent Travel Planning and Itinerary Management</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Cloud-Ready-4285F4?style=for-the-badge&logo=icloud&logoColor=white" alt="Cloud">
</p>

<p align="center">
  <strong>React.js • Node.js • Express.js • SQLite • JWT • REST API • Bootstrap • Cloud Computing</strong>
</p>

---

## 📌 Overview

The **Cloud-Based Travel Itinerary Management System** is a full-stack web application designed to provide a centralized platform for planning, organizing, and managing travel activities.

The application enables users to manage their complete travel lifecycle from a single dashboard, including trip creation, destination management, day-wise itinerary planning, travel expense tracking, budget monitoring, and profile management.

The system is developed using a **3-Tier Architecture** consisting of:

- **Presentation Layer** — React.js frontend
- **Application Layer** — Node.js and Express.js backend
- **Data Layer** — SQLite database

The architecture is designed to be **cloud-ready**, allowing the frontend and backend to be deployed independently on cloud infrastructure.

---

## 🎯 Objectives

The primary objectives of the project are:

- To develop a centralized travel planning platform.
- To simplify trip and itinerary management.
- To provide secure user authentication and authorization.
- To support day-wise travel planning.
- To provide travel expense and budget tracking.
- To provide dashboard-based travel statistics.
- To demonstrate RESTful API development.
- To implement a database-backed full-stack application.
- To demonstrate practical cloud computing concepts.
- To design an architecture suitable for cloud deployment and scalability.

---

## 🚀 Key Features

### 🔐 Authentication & Security

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- User-specific data access
- Secure logout
- Profile management

### 🧳 Trip Management

Users can:

- Create new trips
- View existing trips
- Search trips
- Edit trip details
- Delete trips
- Define travel dates
- Specify number of travelers
- Set estimated trip budget
- Select travel type
- Set trip status
- Add trip descriptions

### 🗓️ Itinerary Management

The system provides structured day-wise itinerary planning.

Users can add:

- Day number
- Activity
- Time
- Location
- Notes

Users can also view and delete itinerary activities associated with a trip.

### 💰 Expense Management

The expense module allows users to track travel spending.

Supported categories include:

- Transport
- Accommodation
- Food
- Activities
- Shopping
- Other

The system provides a calculated total for recorded expenses associated with a trip.

### 🌍 Destination Management

The destination module provides a centralized view of destinations associated with user trips.

Users can access the corresponding trip itinerary from the destination interface.

### 📊 Dashboard

The dashboard provides an overview of travel activity, including:

- Total trips
- Upcoming trips
- Number of destinations
- Total planned budget
- Recent trips
- Quick actions

### 🔎 Search & Filtering

Trips can be searched using:

- Trip name
- Destination
- Travel type

### 👤 Profile Management

Users can:

- View account information
- Update their name
- View their registered email address

### 📱 Responsive UI

The interface is designed to provide a consistent experience across desktop and different screen sizes using responsive CSS and Bootstrap components.

---

## 🏗️ System Architecture

The system follows a **3-Tier Architecture**.

```text
┌───────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                 │
│                                                       │
│        React.js + Vite + Bootstrap + CSS              │
│                                                       │
│     Dashboard • Trips • Itinerary • Expenses          │
└───────────────────────────┬───────────────────────────┘
                            │
                            │ REST API / HTTP
                            ▼
┌───────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                  │
│                                                       │
│             Node.js + Express.js                     │
│                                                       │
│      Authentication • Business Logic • CRUD           │
│                JWT • API Services                     │
└───────────────────────────┬───────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌───────────────────────────────────────────────────────┐
│                       DATA LAYER                      │
│                                                       │
│                       SQLite                          │
│                                                       │
│      Users • Trips • Itinerary • Expenses             │
└───────────────────────────────────────────────────────┘
```

---

## ☁️ Cloud Architecture

The application is designed with a cloud-ready architecture where frontend and backend services can be deployed independently.

```text
                         INTERNET
                            │
                            ▼
                  ┌──────────────────┐
                  │   Web Browser    │
                  │      Client      │
                  └────────┬─────────┘
                           │
                           │ HTTPS
                           ▼
                  ┌──────────────────┐
                  │ Cloud Frontend   │
                  │    React.js      │
                  └────────┬─────────┘
                           │
                           │ REST API
                           ▼
                  ┌──────────────────┐
                  │  Cloud Backend   │
                  │ Node + Express   │
                  └────────┬─────────┘
                           │
                           │ Database Access
                           ▼
                  ┌──────────────────┐
                  │ Database Layer   │
                  │ SQLite / Cloud DB│
                  └──────────────────┘
```

---

## 🧩 Architecture Components

### Presentation Layer

**Technologies**

- React.js
- Vite
- HTML5
- CSS3
- Bootstrap 5
- Bootstrap Icons
- JavaScript

**Responsibilities**

- User interface
- Navigation
- Dashboard
- Authentication screens
- Trip forms
- Itinerary management
- Expense management
- Destination management
- Profile management

### Application Layer

**Technologies**

- Node.js
- Express.js
- REST API
- JWT
- bcryptjs

**Responsibilities**

- Authentication
- Authorization
- Business logic
- CRUD operations
- API request processing
- Database communication

### Data Layer

**Technology**

- SQLite
- SQLite3

**Responsibilities**

- User data storage
- Trip data storage
- Itinerary storage
- Expense storage
- Persistent application data

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| UI Framework | Bootstrap 5 |
| Styling | CSS3 |
| Icons | Bootstrap Icons |
| API Client | Axios |
| Backend | Node.js |
| Framework | Express.js |
| Authentication | JWT |
| Password Security | bcryptjs |
| Database | SQLite |
| Database Driver | SQLite3 |
| Configuration | dotenv |
| API Communication | REST |
| Version Control | Git |
| Repository | GitHub |
| Development Environment | Visual Studio Code |

---

## 📂 Project Structure

```text
Cloud-Based-Travel-Itinerary-Management-System/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── database.js
│   ├── server.js
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── travel_itinerary.db
│
├── screenshots/
│
├── .gitignore
│
└── README.md
```

---

## 🗄️ Database Design

The application uses SQLite as the relational database during development.

### Users Table

| Field | Description |
|---|---|
| id | Unique user identifier |
| name | User name |
| email | Registered email |
| password | Hashed password |
| created_at | Account creation timestamp |

### Trips Table

| Field | Description |
|---|---|
| id | Unique trip identifier |
| user_id | Associated user |
| trip_name | Name of the trip |
| destination | Travel destination |
| start_date | Trip start date |
| end_date | Trip end date |
| travelers | Number of travelers |
| budget | Estimated trip budget |
| travel_type | Type of travel |
| description | Trip description |
| status | Trip status |
| created_at | Trip creation timestamp |

### Itinerary Table

| Field | Description |
|---|---|
| id | Unique itinerary identifier |
| trip_id | Associated trip |
| day_number | Day of itinerary |
| activity | Planned activity |
| time | Activity time |
| location | Activity location |
| notes | Additional notes |

### Expenses Table

| Field | Description |
|---|---|
| id | Unique expense identifier |
| trip_id | Associated trip |
| category | Expense category |
| description | Expense description |
| amount | Expense amount |
| expense_date | Expense date |

---

## 🔗 REST API

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/profile` | Retrieve user profile |
| PUT | `/api/auth/profile` | Update user profile |

### Trip APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/trips` | Create a trip |
| GET | `/api/trips` | Retrieve user trips |
| GET | `/api/trips/:id` | Retrieve a specific trip |
| PUT | `/api/trips/:id` | Update a trip |
| DELETE | `/api/trips/:id` | Delete a trip |

### Itinerary APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/itinerary` | Add itinerary activity |
| GET | `/api/itinerary/:tripId` | Retrieve trip itinerary |
| DELETE | `/api/itinerary/:id` | Delete itinerary activity |

### Expense APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses` | Add an expense |
| GET | `/api/expenses/:tripId` | Retrieve trip expenses |
| DELETE | `/api/expenses/:id` | Delete an expense |

### Dashboard API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Retrieve dashboard statistics |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Verify backend availability |

---

## 🔐 Security Implementation

### JWT Authentication

JSON Web Tokens are used to authenticate users and protect private API operations.

Authenticated requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

### Password Hashing

Passwords are hashed using `bcryptjs` before being stored in the database.

### Protected Routes

Authenticated API endpoints verify the JWT before processing protected requests.

### Environment Variables

Sensitive configuration is maintained using environment variables.

Example:

```env
PORT=5000
JWT_SECRET=your_secure_secret
```

> The `.env` file should not be committed to GitHub.

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following software is installed:

- Node.js
- npm
- Git
- Visual Studio Code
- Modern web browser

---

### 1. Clone the Repository

```bash
git clone https://github.com/kukatireshmitha986-create/Cloud-Based-Travel-Itinerary-Management-System.git
```

Navigate into the project:

```bash
cd Cloud-Based-Travel-Itinerary-Management-System
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
JWT_SECRET=your_secure_secret
```

Start the backend:

```bash
node server.js
```

The backend will run at:

```text
http://localhost:5000
```

Test the API health endpoint:

```text
http://localhost:5000/
```

---

### 3. Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in a web browser.

---

## 🔄 Application Workflow

```text
User
  │
  ▼
Register / Login
  │
  ▼
JWT Authentication
  │
  ▼
Dashboard
  │
  ├───────────────┐
  │               │
  ▼               ▼
Create Trip     My Trips
  │               │
  │               ├── Edit Trip
  │               └── Delete Trip
  │
  ├── Itinerary
  │      ├── Add Activity
  │      └── Delete Activity
  │
  └── Expenses
         ├── Add Expense
         └── Delete Expense
```

---

## 📸 Application Screenshots

### 🔐 Login / Registration

The authentication interface allows users to securely register and log in to the application.

### 📊 Dashboard

The dashboard provides a centralized overview of travel activity, including trips, upcoming journeys, destinations, budget information, and recent trips.

### 🧳 My Trips

The My Trips module provides a structured view of all created journeys with options to view, edit, delete, manage itineraries, and manage expenses.

### ➕ Create Trip

The Create Trip interface allows users to provide complete journey details including destination, dates, travelers, budget, travel type, status, and description.

### 🗓️ Itinerary

The itinerary module provides day-wise activity planning for each trip.

### 💰 Expenses

The expenses module allows users to record travel spending and monitor the total expenses associated with a trip.

### 🌍 Destinations

The destinations module displays destinations associated with user trips.

### 👤 Profile

The profile module allows users to view and update account information.

> Add your actual screenshots inside the `screenshots` folder and reference them here when needed.

Example screenshot structure:

```text
screenshots/
├── dashboard.png
├── my-trips.png
├── create-trip.png
├── itinerary.png
├── expenses.png
├── destinations.png
└── profile.png
```

---

## 🧪 Testing

The application can be tested across the following modules.

### Authentication Testing

- User registration
- User login
- Invalid login handling
- JWT authentication
- Logout
- Profile update

### Trip Testing

- Create trip
- View trips
- Search trips
- Edit trip
- Delete trip

### Itinerary Testing

- Add activity
- View activities
- Delete activity

### Expense Testing

- Add expense
- View expenses
- Calculate total expenses
- Delete expense

### Dashboard Testing

- Total trip count
- Upcoming trip count
- Destination count
- Total budget

---

## 📊 Sample Application Data

### Sample Trip

| Field | Value |
|---|---|
| Trip Name | Goa Beach Vacation |
| Destination | Goa, India |
| Start Date | 2026-10-12 |
| End Date | 2026-10-16 |
| Travelers | 2 |
| Budget | ₹25,000 |
| Travel Type | Leisure |
| Status | Planned |

### Sample Itinerary

| Day | Activity | Time | Location |
|---|---|---|---|
| Day 1 | Baga Beach Visit | 10:00 AM | Baga Beach |
| Day 1 | Fort Aguada Visit | 5:00 PM | Aguada Fort |

### Sample Expense

| Category | Description | Amount |
|---|---|---:|
| Transport | Local travel | ₹600 |
| Food | Lunch | ₹850 |

---

## ☁️ Cloud Computing Concepts Demonstrated

### 1. Three-Tier Architecture

The system separates the presentation, application, and data layers.

### 2. Client-Server Architecture

The React frontend communicates with the Express backend through REST APIs.

### 3. RESTful Web Services

The backend provides HTTP-based APIs for application operations.

### 4. Authentication & Authorization

JWT provides secure authentication for protected resources.

### 5. Centralized Data Management

Application information is stored in a structured database.

### 6. Scalability

The separation of frontend and backend allows components to be independently deployed and scaled.

### 7. Cloud Deployment

The application is designed to support deployment on cloud platforms such as:

- Render
- Railway
- AWS
- Microsoft Azure

### 8. Remote Accessibility

After deployment, users can access the application remotely through a web browser.

---

## 🌩️ Cloud Deployment Roadmap

The application can be extended to a production cloud environment using the following architecture:

```text
                     INTERNET
                         │
                         ▼
              ┌────────────────────┐
              │  Cloud Frontend    │
              │     React.js       │
              └─────────┬──────────┘
                        │
                     HTTPS
                        │
                        ▼
              ┌────────────────────┐
              │   Cloud Backend    │
              │ Node.js + Express  │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │ Cloud Database     │
              │ SQLite / SQL DB    │
              └────────────────────┘
```

---

## 📈 Advantages

- Centralized travel management
- Easy itinerary planning
- Secure authentication
- Expense tracking
- Budget monitoring
- Destination management
- Responsive interface
- REST API architecture
- Database-backed application
- Modular design
- Cloud deployment ready
- Easy maintenance
- Scalable architecture
- User-friendly interface

---

## 🔮 Future Enhancements

Future versions of the system can include:

- 🗺️ Google Maps integration
- 🌦️ Weather API integration
- ✈️ Flight information
- 🏨 Hotel information
- 🤖 AI-based itinerary recommendations
- 📧 Email notifications
- 🔔 Push notifications
- 📄 PDF itinerary export
- 📊 Advanced expense analytics
- 📈 Data visualization and charts
- ☁️ Cloud database migration
- 👨‍💼 Admin dashboard
- 🔑 Role-based access control
- 🤝 Trip sharing
- 🔄 Real-time collaboration
- 🌐 Multi-language support
- 📱 Mobile application
- ☁️ Cloud storage for travel documents
- 🐳 Docker containerization
- 🔄 CI/CD pipeline

---

## 🎓 Academic Relevance

This project demonstrates practical concepts from:

- Cloud Computing
- Full-Stack Web Development
- Web Technologies
- Database Management Systems
- Software Engineering
- Computer Networks
- REST API Development
- Authentication and Security
- Distributed Application Architecture

---

## 📚 Learning Outcomes

This project provides practical experience in:

- React.js application development
- Vite development workflow
- Node.js backend development
- Express.js REST API development
- SQLite database integration
- JWT authentication
- bcrypt password hashing
- CRUD operations
- Axios API communication
- Responsive web design
- Client-server architecture
- Three-tier architecture
- Git and GitHub
- Cloud application architecture
- Cloud deployment concepts

---

## 📋 Project Information

| Category | Details |
|---|---|
| Project Title | Cloud-Based Travel Itinerary Management System |
| Domain | Cloud Computing |
| Application Type | Full-Stack Web Application |
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | SQLite |
| Authentication | JWT |
| Password Security | bcryptjs |
| API | REST API |
| Architecture | Three-Tier Architecture |
| UI Framework | Bootstrap 5 |
| Development Tool | Visual Studio Code |
| Version Control | Git |
| Repository | GitHub |

---

## 👩‍💻 Developer

### Reshmitha Kukati

**AI & Data Science Student**  
**Prathyusha Engineering College**

GitHub:  
https://github.com/kukatireshmitha986-create

---

## 📜 License

This project is developed for academic and educational purposes.

---

## ⭐ Project Highlights

- ✅ Full-Stack Cloud Computing Application
- ✅ React.js Frontend
- ✅ Node.js Backend
- ✅ Express.js REST API
- ✅ SQLite Database
- ✅ JWT Authentication
- ✅ bcrypt Password Security
- ✅ CRUD Operations
- ✅ Trip Management
- ✅ Itinerary Management
- ✅ Expense Tracking
- ✅ Destination Management
- ✅ Dashboard Analytics
- ✅ Profile Management
- ✅ Responsive User Interface
- ✅ Three-Tier Architecture
- ✅ Cloud Deployment Ready
- ✅ GitHub Ready

---

## 🏷️ GitHub Topics

```text
cloud-computing
reactjs
nodejs
expressjs
sqlite
jwt
rest-api
full-stack-development
travel-management
travel-itinerary
web-development
cloud-project
javascript
bootstrap
vite
database
authentication
crud
three-tier-architecture
student-project
```

---

## ⭐ Support

If you find this project useful for learning or academic purposes, consider giving the repository a ⭐ on GitHub.

**Built with React.js, Node.js, Express.js, SQLite and Cloud Computing concepts.**
