# README

## Project Overview

This repository features a full-stack web application with distinct customer-facing pages and a dedicated administrator Single-Page Application (SPA). The customer interface provides HTML views for browsing trips and content, while the admin SPA enables authenticated Create, Read, Update, Delete (CRUD) operations and content management. A key feature of the final iteration is secure admin login, implemented with token-based authentication and protected API routes.

---

## Quick Start

### 1) Backend Setup

```bash
cd travlr
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend Setup (for Angular admin)

```bash
cd travlr-admin
npm install
npm start
```

### Backend Environment Variables

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/travlr
JWT_SECRET=change_this_to_a_long_random_string
CORS_ORIGIN=http://localhost:4200
```

---

## Architecture (Course Competency: Web Architecture)

### Front-End Approaches: Express HTML/JS vs. SPA

#### Express HTML + JS (Server-Rendered Views)
- **How it works:** Routes on the server render Handlebars/HTML templates and deliver complete pages to the browser.
- **Strengths:** Simple delivery, excellent for SEO on public pages, minimal client build pipeline, easy Server-Side Rendering (SSR).
- **Trade-offs:** Full page reloads between views, limited client-side state, less dynamic user experience for administrative tasks.

#### Single-Page Application (SPA) for Admin (Angular)
- **How it works:** The browser downloads a compiled JavaScript bundle once. Subsequent navigation and updates are handled client-side. Data is fetched from the REST API as JSON via an HTTP service.
- **Strengths:** Responsive user experience with partial updates, robust client-side routing and state management, reusable components, comprehensive form validation, and clear separation from the backend.
- **Trade-offs:** Larger initial payload, increased build toolchain complexity, explicit handling of Cross-Origin Resource Sharing (CORS) and authentication headers, and additional setup required for SSR if needed.

**Conclusion:** Customer-facing pages benefit from the simplicity and SEO advantages of server-rendered Express views, while the admin interface leverages the responsiveness, modularity, and developer ergonomics of an SPA. This hybrid approach allows each side to utilize its strengths effectively.

### Why NoSQL MongoDB on the Backend?
- **Document Model Alignment:** Trips, users, and related data naturally fit a JSON-like document structure.
- **Schema Flexibility:** MongoDB's flexible schema accommodates changes during iterative development (sprints) without requiring costly migrations.
- **Developer Velocity:** Using Mongoose models provides validation and hooks while maintaining an end-to-end JSON data flow.
- **Scalability:** Horizontal scaling options like sharding and replica sets are readily available for future data growth.

---

## Functionality 

### JSON vs. JavaScript and Their Integration
- **JavaScript:** A programming language executable in Node.js and web browsers.
- **JSON (JavaScript Object Notation):** A text-based data format used for serializing structured data.
- **Integration:** The API delivers data in JSON format. The Angular SPA parses this JSON into TypeScript/JavaScript objects for UI rendering. When submitting data, the SPA sends JSON payloads back to the Express API, establishing a clear contract between the front-end and back-end.

### Refactoring and Reusable UI Components

#### Refactoring Examples
- **API Calls:** Extracted into a dedicated Angular `TripDataService`, centralizing base URLs, interceptors, error handling, and simplifying testing and caching.
- **Validation/Business Logic:** Moved from controllers to Mongoose schemas (e.g., for required fields and data types), ensuring consistent validation across routes and leaner controllers.
- **Express Route Files:** Split into `routes/`, `controllers/`, and `models/` for clearer separation of concerns and more testable modules.

#### Reusable UI Components (Angular)
- **Shared components:** Utilized for forms (e.g., trip editor), tables (e.g., trip list), and confirmation dialogs.
- **Benefits:** Consistent user experience, accelerated development, reduced bugs, and easier visual updates (single change, global update).

---

## Testing 

### Methods, Endpoints, and Security in a Full-Stack Application

#### HTTP Methods & Endpoints
| Method | Endpoint | Auth | Description |
|--------|-----------|------|--------------|
| GET | /api/trips | — | List all trips |
| GET | /api/trips/:id | — | Retrieve a single trip by ID |
| POST | /api/trips | JWT | Create a new trip (admin only) |
| PUT | /api/trips/:id | JWT | Update an existing trip (admin only) |
| DELETE | /api/trips/:id | JWT | Remove a trip (admin only) |
| POST | /api/auth/login | — | Authenticate an admin and return a JWT |

#### Authentication & Authorization
- **Login Flow:** Admin submits credentials, the server verifies them (e.g., `bcrypt.compare`), and then signs a JWT using `JWT_SECRET`.
- **Protected Routes:** The Admin SPA sends an `Authorization: Bearer <token>` header. Express middleware validates the token and sets `req.user`.
- **Password Storage:** Only hashed passwords (e.g., bcrypt with salt) are stored on the server.

#### CORS and CSRF
- **CORS:** Configured on the API to permit requests from the SPA's origin (e.g., `http://localhost:4200`).
- **CSRF (Cross-Site Request Forgery):** The risk is reduced due to the use of tokens (instead of cookies for sessions), but tokens are not sent automatically, and CORS is scoped.

#### API Testing Approach
- **Manual Integration Tests:** Using curl or Postman collections to verify endpoints, including success paths and failure cases (401, 403, 404, 422).
- **Security Tests:** Attempting access to protected routes with no token, invalid tokens, expired tokens, and valid tokens, ensuring correct HTTP status codes are returned.
- **Data Validation Tests:** Submitting invalid payloads and confirming the API responds with structured error messages.
- *(Optional)* **Automated Tests:** Employing Mocha/Jest with Supertest for endpoint assertions, including smoke tests for GET `/api/trips` and a protected POST with a valid JWT.

#### Example curl Tests
```bash
# Authentication
curl -s -X POST http://localhost:3000/api/auth/login  -H "Content-Type: application/json"  -d '{"email":"admin@example.com","password":"SuperSecret!"}'

# Protected Create (replace TOKEN)
curl -s -X POST http://localhost:3000/api/trips  -H "Authorization: Bearer TOKEN"  -H "Content-Type: application/json"  -d '{"code":"LA01","name":"Los Angeles Getaway","length":3}'
```

---

## Reflection 

This course significantly advanced my ability to deliver production-ready full-stack projects. I gained confidence in data modeling, REST API design, modern SPA integration, and secure authentication implementation. These skills directly apply to technology consulting and small-business solutions, such as developing internal admin tools.

### Acquired and Enhanced Skills
- **Back-end Engineering:** Express routing, controller/DAO patterns, environment configuration, and Mongoose modeling/validation.
- **Database Design:** NoSQL selection, document schema shaping, and indexing for efficient read patterns.
- **Front-end Engineering:** Angular component architecture, reactive forms, route guards, and reusable UI components.
- **Auth & Security:** Password hashing, JWT authentication, protected routes, CORS configuration, and least-privilege access.
- **Testing & Tooling:** Postman/curl for API testing, error-driven development, and practical debugging of 401/403/404 issues.
- **Dev Workflow:** NPM scripts, environment management, and clear separation between server-side rendered customer pages and the admin SPA.

Ultimately, this project showcases my capability to plan and implement a robust MEAN-style stack with secure administrative operations, making me a more competitive candidate for roles requiring end-to-end feature ownership and clear communication of technical trade-offs.

---

## Folder Structure 

```
travlr/
  app.js
  package.json
  .env(.example)
  /app_server           # Server-rendered (customer) pages/templates
  /app_api              # REST API: routes, controllers
  /models               # Mongoose schemas (e.g., Trip, User)
  /public               # Static assets (css/js/images)

travlr-admin/           # Angular SPA (admin)
  src/app/
    services/           # e.g., trip-data.service.ts, auth.service.ts
    components/         # Reusable components
    pages/              # Feature pages (list/edit)
    guards/             # Auth guards
```

---

## Security Notes
- Store only bcrypt-hashed passwords.
- Keep `JWT_SECRET` out of source control (use `.env`).
- Limit CORS origins to known front-end hosts.
- Log authentication failures without exposing sensitive details.
- Consider role claims (e.g., `admin`) within the JWT for fine-grained authorization.
