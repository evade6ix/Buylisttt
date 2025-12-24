// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Landing from "./Landing";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        colors: {
          brand: [
            "#e0f2fe",
            "#bae6fd",
            "#7dd3fc",
            "#38bdf8",
            "#0ea5e9",
            "#0284c7",
            "#0369a1",
            "#075985",
            "#0b4a6f",
            "#082f49",
          ],
        },
        primaryColor: "brand",
        primaryShade: 4,
        defaultRadius: "md",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
