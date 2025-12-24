// src/Landing.tsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./App.css"

type GameId = "Pokemon" | "One Piece" | "Gundam" | "Riftbound"

const GAME_LABELS: Record<GameId, string> = {
  Pokemon: "Pokémon",
  "One Piece": "One Piece",
  Gundam: "Gundam",
  Riftbound: "Riftbound",
}

function useTypewriter(words: string[], speed = 90, pause = 900) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    if (!words.length) return
    const word = words[index]

    // finished typing
    if (!deleting && subIndex === word.length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }

    // finished deleting
    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const t = setTimeout(
      () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? speed / 1.6 : speed
    )
    return () => clearTimeout(t)
  }, [subIndex, index, deleting, words, speed, pause])

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500)
    return () => clearInterval(t)
  }, [])

  return {
    text: words[index]?.slice(0, subIndex) ?? "",
    cursorVisible: blink,
  }
}

const SUPPORTED_STORES = [
  "Banana Games",
  "Game3",
  "401 Games",
  "Enter The Battlefield",
  "Duel Kingdom",
  "Taps Games",
  "Emmett's Toy Stop",
]

const SUPPORTED_GAMES = [
  "Pokémon",
  "One Piece",
  "Gundam",
  "Riftbound",
]

export default function Landing() {
  // faster cycle (~3–4s per game)
  const typewriter = useTypewriter(
    [
      GAME_LABELS.Pokemon,
      GAME_LABELS["One Piece"],
      GAME_LABELS.Gundam,
      GAME_LABELS.Riftbound,
    ],
    65,
    450
  )

  return (
    <div className="lp-root">
      {/* TOP NAV – ultra simple */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-mark">⇄</div>
            <div className="lp-logo-text">
              <span className="lp-logo-title">Buylist Syncer</span>
              {/* subtitle removed */}
            </div>
          </div>
          <div className="lp-nav-right">
            <span className="lp-nav-tag">Beta Version</span>
            <Link to="/app" className="lp-nav-button">
              Open app
            </Link>
          </div>
        </div>
      </header>

      {/* CENTER HERO */}
      <main className="lp-main">
        <div className="lp-main-inner">
          <section className="lp-hero">
            <p className="lp-kicker">Multi-store buylist search for real TCG people</p>

            <h1 className="lp-title">
              Search{" "}
              <span className="lp-typewriter">
                {typewriter.text}
                <span
                  className={`lp-cursor ${typewriter.cursorVisible ? "lp-cursor--on" : ""}`}
                >
                  |
                </span>
              </span>{" "}
              buylists
            </h1>

            <p className="lp-subtitle">
              One query hits every connected Storepass retailer and groups the results so you see
              real cash and credit spreads in seconds.
            </p>

            <div className="lp-actions">
              <Link to="/app" className="lp-primary">
                Launch buylist app
              </Link>
              <span className="lp-meta">
                Powered by live Storepass buylist data · No exports, no spreadsheets
              </span>
            </div>

            <p className="lp-games-line">
              <span className="lp-dot" />
              Pokémon · One Piece · Gundam · Riftbound
            </p>
          </section>

          {/* SUPPORTED STORES / GAMES */}
          <section className="lp-support">
            <div className="lp-support-card">
              <div className="lp-support-header">
                <span className="lp-support-eyebrow">Supported Stores</span>
                <h2>Where your buylists are routed.</h2>
                <p>
                  Every search fans out to your connected Storepass retailers and pulls live buylist
                  prices directly from their endpoints.
                </p>
              </div>
              <div className="lp-pill-grid">
                {SUPPORTED_STORES.map((store) => (
                  <span key={store} className="lp-pill">
                    {store}
                  </span>
                ))}
              </div>
            </div>

            <div className="lp-support-card">
              <div className="lp-support-header">
                <span className="lp-support-eyebrow">Supported Games</span>
                <h2>One engine, multiple ecosystems.</h2>
                <p>
                  Mix and match games without changing tools. Buylist Syncer treats each TCG as a
                  first-class citizen right from the search bar.
                </p>
              </div>
              <div className="lp-pill-grid lp-pill-grid--compact">
                {SUPPORTED_GAMES.map((game) => (
                  <span key={game} className="lp-pill lp-pill--game">
                    {game}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER REMOVED ON PURPOSE */}
    </div>
  )
}
