# E-Post

E-Post is a web application built with React, TypeScript, and TailwindCSS. It uses a custom Webpack setup for bundling and development.

## Features
- **React**: Component-based UI development.
- **TypeScript**: Strongly typed JavaScript for better maintainability.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Custom Webpack Setup**: Fully configurable build process.
- **Routing**: Powered by `react-router-dom`.
- **State Management**: Using React hooks and context.
- **Environment Variables**: Managed with `dotenv`.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Available Scripts

### `npm start`
Runs the app in development mode with hot module replacement (HMR).\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run dev`
Runs the app in development mode using the custom Webpack configuration.

### `npm run build`
Builds the app for production. The output is optimized and stored in the `build` folder.

### `npm run prod`
Runs the production build using a custom Webpack production configuration.

## 📁 Project Structure
```
e-post/
├── public/                # Static assets (index.html, favicon, etc.)
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-based page components
│   ├── layouts/           # Shared layout components (e.g., headers, sidebars)
│   ├── styles/            # Global styles and Tailwind configurations
│   ├── App.tsx            # Main React application component
│   └── index.tsx          # React entry point
├── webpack.config.js      # Webpack configuration
├── .babelrc               # Babel configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```
# Project documentation
## Environment Variables
Environment variables are managed using a `.env` file. Example:

`REACT_APP_API_BASE_URL=https://api.example.com`


## Technologies Used
- **React**: Frontend library
- **TypeScript**: Type-safe JavaScript
- **Webpack**: Module bundler
- **TailwindCSS**: CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Zod**: Schema validation

## Development Workflow
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/e-post.git
   cd e-post
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

## Deployment 
1. Build the app for production:
    ```bash
    npm run build
    ```

2. Serve the `build/` folder using a static file server or deploy it to a hosting service like Netlify, Vercel, or AWS.

# License
This project is licensed under the MIT License.

# Acknowledgments
* [React](https://reactjs.org/)
* [Webpack](https://webpack.js.org/)
* [TailwindCSS](https://tailwindcss.com/)
* [TypeScript](https://www.typescriptlang.org/)

