# Project Overview

![fs-architecture](https://github.com/user-attachments/assets/ccb0398d-e78b-4ff0-8dcb-cc83fd741bd2)

## Directory Structure

### Backend
```
backend/
│
├── .env
├── package.json
├── server.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Container.js
│   ├── Parcels.js
│   ├── Tracking.js
│   └── User.js
├── qrcodes/
│   ├── containers/
│   └── parcels/
├── routes/
│   ├── authRoutes.js
│   ├── containerRoutes.js
│   └── parcelRoutes.js
```

- **`server.js`**: Entry point for the backend server. Loads environment variables, connects to MongoDB, sets up middleware (CORS, JSON parsing), and mounts all API routes. Starts the Express server.

- **`routes/`**:
    - `authRoutes.js`: Handles user registration, login, logout, and customer tracking ID management. Generates JWT tokens and manages user roles.
    - `parcelRoutes.js`: Handles all parcel-related endpoints: create, update, delete, fetch, and public tracking. Generates QR codes for parcels and manages tracking logs.
    - `containerRoutes.js`: Handles container creation, updating, tracking, and management. Also generates QR codes for containers.

- **`models/`**:
    - `User.js`: Mongoose schema for users (admin, staff, customer). Stores user info, roles, and tracking IDs for customers.
    - `Parcels.js`: Mongoose schema for parcels. Includes sender/receiver info, tracking ID, status, location, and references to containers and users.
    - `Tracking.js`: Mongoose schema for tracking logs. Stores parcel/container status, location, and timestamps.
    - `Container.js`: Mongoose schema for containers. Contains container ID, destination, parcels, logs, and status.

- **`middleware/`**:
    - `authMiddleware.js`: Express middleware to authenticate users via JWT. Sets `req.currentUser` for use in protected routes.

- **`qrcodes/`**:
    - `containers/` and `parcels/`: Stores generated QR code images for containers and parcels, respectively.

- **`.env`**: Stores environment variables such as `MONGO_URI` and `JWT_SECRET`.

### Frontend (e-post)
```
e-post/
└── src/
    ├── App.tsx
    ├── index.tsx
    ├── pages/
    │   ├── ParcelsPage.tsx
    │   ├── ContainersPage.tsx
    │   ├── TrackingPage.tsx
    │   ├── LoginPage.tsx
    │   ├── SignupPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── Home.tsx
    │   └── NotFoundPage.tsx
    ├── components/
    │   ├── auth-provider.tsx
    │   ├── parcel-provider.tsx
    │   ├── parcels/
    │   │   └── ParcelList.tsx
    │   ├── tracking/
    │   │   ├── TrackingSearch.tsx
    │   │   └── TrackingResult.tsx
    │   └── ui/
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── tabs.tsx
    │       └── ... (other UI components)
    ├── layouts/
    │   └── DashboardLayout.tsx
    └── lib/
        └── api.ts
```

- **`App.tsx`**: Main React component that sets up routing using `react-router-dom`. Uses a `ProtectedRoute` component to guard routes based on authentication and user roles. Mounts all main pages and layouts.

- **`index.tsx`**: Entry point for the React app. Renders the root component.

- **`pages/`**:
    - `ParcelsPage.tsx`: Main page for managing parcels. Includes tabs for adding and updating parcels, QR scanning, and listing parcels.
    - `ContainersPage.tsx`: Page for managing containers.
    - `TrackingPage.tsx`: Page for tracking parcels by tracking ID or QR code.
    - `LoginPage.tsx` / `SignupPage.tsx`: Authentication pages.
    - `DashboardPage.tsx`: Main dashboard after login.
    - `Home.tsx`: Public landing page.
    - `NotFoundPage.tsx`: 404 page.

- **`components/`**:
    - `auth-provider.tsx`: React context/provider for authentication state and user info.
    - `parcel-provider.tsx`: React context/provider for parcel state and API calls.
    - `parcels/ParcelList.tsx`: Component to display a list of parcels.
    - `tracking/TrackingSearch.tsx`: Component for searching/tracking parcels by ID or QR code.
    - `tracking/TrackingResult.tsx`: Displays tracking results.
    - `ui/`: Shared UI components (Button, Card, Input, Label, Tabs, etc.).

- **`layouts/`**:
    - `DashboardLayout.tsx`: Layout wrapper for dashboard pages, includes navigation and outlet for nested routes.

- **`lib/`**:
    - `api.ts`: Axios instance configured for API requests, including JWT token handling.

---

### How the Application Works

#### Authentication
- Users can register (as customers) or log in (as admin, staff, or customer).
- JWT tokens are issued on login and stored on the client.
- Protected routes require a valid token; roles are checked for access to certain pages.

#### Parcels
- Staff can create parcels, which generates a unique tracking ID and QR code.
- Parcels have sender/receiver info, status, and location.
- Parcels can be updated (location/status) by scanning the QR code or entering the tracking ID.
- All actions are logged in the tracking logs.

#### Containers
- Staff/Admin can create containers, assign parcels, and update their status/location.
- Containers also have QR codes and logs.
- Updating a container can update all included parcels.

#### Tracking
- Anyone can track a parcel using its tracking ID or by scanning its QR code.
- Tracking info includes current status, location, and history.

---

## Running the Project

### Backend
1. **Install dependencies**:
    ```bash
    cd backend
    npm install
    ```
2. **Set up your `.env` file**:

     Add the following environment variables:
      ```
      MONGO_URI=<your-mongodb-connection-string>
      JWT_SECRET=<your-jwt-secret>
      ```
3. **Start the server**:
    ```bash
    npm start
    ```

### Frontend
1. **Install dependencies**:
    ```bash
    cd e-post
    npm install
    ```
2. **Start the React app**:
    ```bash
    npm start
    ```

---

### Notes
- **QR Code Scanning**: The frontend uses a QR scanning library (e.g., `react-qr-reader`) for scanning parcel/container codes.
- **Role-Based Access**: Only users with the correct role can access certain routes and perform actions.
- **API URLs**: The frontend expects the backend to be running and accessible at the configured API base URL.
- **Error Handling**: Both backend and frontend include error handling for authentication, validation, and server errors.
