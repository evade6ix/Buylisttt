// src/App.tsx
import { Routes, Route } from "react-router-dom"
import Landing from "./Landing"
import BuylistApp from "./BuylistApp"

export default function App() {
  return (
    <Routes>
      {/* Landing page at root */}
      <Route path="/" element={<Landing />} />

      {/* Buylist tool at /app */}
      <Route path="/app" element={<BuylistApp />} />
    </Routes>
  )
}
