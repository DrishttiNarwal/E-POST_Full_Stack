import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from "react-router-dom"; // Standard client-side routing
import { ThemeProvider } from "./components/theme-provider"; // Your theme provider
import { AuthProvider } from "./components/auth-provider"; // Your auth provider

import "./styles/global.css"
import { ParcelsProvider } from './components/parcel-provider';


// Find the root element in your public/index.html
const rootElement = document.getElementById("root");

// Ensure the root element exists before trying to render
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create the React root
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing */}
    <BrowserRouter>
      {/* Your custom providers wrapping the App */}
      <ThemeProvider defaultTheme="light" storageKey="parcel-theme">
        <AuthProvider>
        <ParcelsProvider>
            <App /> 
        </ParcelsProvider> 
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals