// src/App.tsx
import { useEffect, useState } from "react"
import "./App.css"

type StoreConfig = {
  id: string
  name: string
  apiPath: string
}

type StorePassVariant = {
  id: string | number
  title: string
  offer_price?: number
  offer_price_credit?: number
}

type StorePassProduct = {
  id: string
  display_name: string
  image_url?: string
  product_line?: string
  productType?: string
  product_data?: {
    setName?: string
    set?: {
      name?: string
    }
  }
  store_pass_variant_info?: StorePassVariant[]
}

type StoreEntry = {
  storeId: string
  storeName: string
  bestCash?: number
  bestCredit?: number
  variants: StorePassVariant[]
}

type CardGroup = {
  key: string
  name: string
  setName?: string
  imageUrl?: string
  entries: StoreEntry[]
}

// ---- games ----

type GameId = "Pokemon" | "One Piece" | "Gundam" | "Riftbound"

const GAMES: { id: GameId; label: string; hint: string }[] = [
  {
    id: "Pokemon",
    label: "Pokémon",
    hint: 'charizard sv107, pikachu vmax, lugia v…',
  },
  {
    id: "One Piece",
    label: "One Piece",
    hint: "luffy, zoro, op01-025…",
  },
  {
    id: "Gundam",
    label: "Gundam",
    hint: "strike freedom, barbatos…",
  },
  {
    id: "Riftbound",
    label: "Riftbound",
    hint: "sett, kampo…",
  },
]

// All stores we query
const STORES: StoreConfig[] = [
  { id: "banana", name: "Banana Games", apiPath: "banana/search" },
  { id: "game3", name: "Game3", apiPath: "game3/search" },
  { id: "401games", name: "401 Games", apiPath: "401games/search" },
  { id: "etb", name: "Enter The Battlefield", apiPath: "etb/search" },
  { id: "duelkingdom", name: "Duel Kingdom", apiPath: "duelkingdom/search" },
  { id: "taps", name: "Taps Games", apiPath: "taps/search" },
  { id: "emmetts", name: "Emmett's Toy Stop", apiPath: "emmetts/search" },
]

// ---------- grouping helpers ----------

function normalizeForKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function extractCardCode(name: string): string | null {
  const codePatterns = [
    /\b[a-z]{0,4}\d+\/\d{2,3}\b/i,
    /\bTG\d+\/TG\d+\b/i,
  ]

  for (const pattern of codePatterns) {
    const m = name.match(pattern)
    if (m) return m[0].toUpperCase()
  }

  return null
}

function buildCardKey(p: StorePassProduct): string {
  const name = p.display_name || ""
  const setName = p.product_data?.setName || p.product_data?.set?.name || ""
  const code = extractCardCode(name)
  const base = normalizeForKey(name)

  if (code && setName) return `${code}__${setName.toLowerCase()}`
  if (code) return code
  if (setName) return `${base}__${setName.toLowerCase()}`
  return base
}

// --------------------------------------

function App() {
  const [query, setQuery] = useState("charizard")
  const [game, setGame] = useState<GameId>("Pokemon")
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<CardGroup[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<CardGroup | null>(null)
  const [storeErrors, setStoreErrors] = useState<string[]>([])

  // warm backend (no UI)
  useEffect(() => {
    fetch("/api/health").catch(() => {})
  }, [])

  const handleSearch = async () => {
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setCards([])
    setStoreErrors([])

    try {
      const results = await Promise.all(
        STORES.map(async (store) => {
          try {
            const res = await fetch(
              `/api/${store.apiPath}?name=${encodeURIComponent(
                trimmed
              )}&product_line=${encodeURIComponent(game)}`
            )
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`)
            }
            const json = await res.json()
            const products: StorePassProduct[] = json.products || []

            if (products.length > 0) {
              console.log(`Sample product from ${store.name}:`, products[0])
            }

            return { store, products }
          } catch (err) {
            console.error(`Error fetching ${store.name}:`, err)
            return { store, products: [] as StorePassProduct[], error: true }
          }
        })
      )

      const errors: string[] = []
      const grouped: Map<string, CardGroup> = new Map()

      for (const { store, products, error: storeHadError } of results) {
        if (storeHadError) errors.push(store.name)

        for (const p of products) {
          const setName = p.product_data?.setName || p.product_data?.set?.name || ""
          const key = buildCardKey(p)
          const variants: StorePassVariant[] = p.store_pass_variant_info || []

          let bestCash: number | undefined
          let bestCredit: number | undefined

          for (const v of variants) {
            if (typeof v.offer_price === "number") {
              if (bestCash === undefined || v.offer_price > bestCash) {
                bestCash = v.offer_price
              }
            }
            if (typeof v.offer_price_credit === "number") {
              if (bestCredit === undefined || v.offer_price_credit > bestCredit) {
                bestCredit = v.offer_price_credit
              }
            }
          }

          const entry: StoreEntry = {
            storeId: store.id,
            storeName: store.name,
            bestCash,
            bestCredit,
            variants,
          }

          const existing = grouped.get(key)
          if (existing) {
            existing.entries.push(entry)
          } else {
            grouped.set(key, {
              key,
              name: p.display_name,
              setName: setName || undefined,
              imageUrl: p.image_url,
              entries: [entry],
            })
          }
        }
      }

      setCards(Array.from(grouped.values()))
      setStoreErrors(errors)
    } catch (err) {
      console.error("Search error:", err)
      setError("Search failed")
    } finally {
      setLoading(false)
    }
  }

  const totalStores = STORES.length
  const currentGameConfig = GAMES.find((g) => g.id === game) ?? GAMES[0]

  const getGlobalBest = (card: CardGroup) => {
    let globalBestCash: number | undefined
    let globalBestCredit: number | undefined

    for (const e of card.entries) {
      if (
        typeof e.bestCash === "number" &&
        (globalBestCash === undefined || e.bestCash > globalBestCash)
      ) {
        globalBestCash = e.bestCash
      }
      if (
        typeof e.bestCredit === "number" &&
        (globalBestCredit === undefined || e.bestCredit > globalBestCredit)
      ) {
        globalBestCredit = e.bestCredit
      }
    }
    return { globalBestCash, globalBestCredit }
  }

  return (
    <div className="app-root">
      {/* Main content – no header/profile block */}
      <main className="app-main app-main--tight">
        {/* Hero / search */}
        <section className="hero hero--terminal">
          <div className="hero-header-row">
            <div>
              <p className="hero-label">BUYLIST TERMINAL</p>
              <h1>Type a card once, scan every counterparty.</h1>
              <p className="hero-subtext">
                Live buylist prices across all connected stores, grouped by
                actual card so Shiny Vault, promos, and alt arts don&apos;t
                clutter the screen.
              </p>
            </div>
          </div>

          {/* Game selector */}
          <div
            style={{
              marginTop: 8,
              marginBottom: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {GAMES.map((g) => {
              const active = g.id === game
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGame(g.id)}
                  className="hero-pill"
                  style={{
                    cursor: "pointer",
                    borderColor: active ? "var(--accent)" : undefined,
                    boxShadow: active
                      ? "0 0 0 1px rgba(56, 189, 248, 0.5)"
                      : "none",
                    background: active ? "#020617" : undefined,
                  }}
                >
                  <span className="hero-pill-value">{g.label}</span>
                </button>
              )
            })}
          </div>

          <div className="hero-search-row">
            <div className="hero-search-input-wrap">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
                placeholder={currentGameConfig.hint}
                className="hero-search-input"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="hero-search-button"
            >
              {loading ? (
                <span className="hero-search-button-inner">
                  <span className="spinner" />
                  Searching…
                </span>
              ) : (
                <span className="hero-search-button-inner">
                  <span>↵</span>
                  Run search
                </span>
              )}
            </button>
          </div>

          <div className="hero-meta-row">
            <div className="hero-pill">
              <span className="hero-pill-label">Game</span>
              <span className="hero-pill-value">
                {currentGameConfig.label}
              </span>
            </div>
            <div className="hero-pill">
              <span className="hero-pill-label">Stores</span>
              <span className="hero-pill-value">{totalStores}</span>
            </div>
            <div className="hero-pill">
              <span className="hero-pill-label">Connected</span>
              <span className="hero-pill-value">
                {totalStores - storeErrors.length}/{totalStores}
              </span>
            </div>
            <div className="hero-pill">
              <span className="hero-pill-label">Distinct cards</span>
              <span className="hero-pill-value">{cards.length}</span>
            </div>
          </div>

          {error && <p className="hero-error">{error}</p>}

          {storeErrors.length > 0 && (
            <p className="hero-warning">
              Timeouts from:{" "}
              <span className="hero-warning-stores">
                {storeErrors.join(", ")}
              </span>
            </p>
          )}
        </section>

        {/* Results */}
        <section className="results-section">
          <div className="results-header">
            <div>
              <h2>Results</h2>
              <p>
                {cards.length
                  ? `Showing ${cards.length} distinct ${currentGameConfig.label} cards. Click to see per-store depth.`
                  : `Run a ${currentGameConfig.label} search to pull current buylist prices from your connected stores.`}
              </p>
            </div>
          </div>

          {cards.length === 0 && !loading && !error && (
            <div className="empty-state">
              <p className="empty-title">Waiting for a query</p>
              <p className="empty-body">
                Search anything from &quot;Charizard&quot; to exact codes like
                &quot;SV49/SV94&quot; and we&apos;ll group the results for you.
              </p>
            </div>
          )}

          {cards.length > 0 && (
            <div className="card-grid">
              {cards.map((card) => {
                const { globalBestCash, globalBestCredit } = getGlobalBest(card)

                return (
                  <button
                    key={card.key}
                    onClick={() => setSelectedCard(card)}
                    className="card-root card-root--terminal"
                  >
                    {card.imageUrl && (
                      <div className="card-image-wrap">
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="card-image"
                        />
                      </div>
                    )}

                    <div className="card-body">
                      <div className="card-title-wrap">
                        <div className="card-title">{card.name}</div>
                        {card.setName && (
                          <div className="card-set">{card.setName}</div>
                        )}
                      </div>

                      <div className="card-meta-row">
                        <span className="card-buylists">
                          {card.entries.length}{" "}
                          {card.entries.length === 1 ? "buylist" : "buylists"}
                          {" · "}
                          grouped
                        </span>
                      </div>

                      <div className="card-price-row">
                        {typeof globalBestCash === "number" && (
                          <div className="price-chip price-chip--cash">
                            <span className="price-label">Best cash</span>
                            <span className="price-value">
                              ${globalBestCash.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {typeof globalBestCredit === "number" && (
                          <div className="price-chip price-chip--credit">
                            <span className="price-label">Best credit</span>
                            <span className="price-value">
                              ${globalBestCredit.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="card-footer-row">
                        <span className="card-footer-text">
                          View per-store offers
                        </span>
                        <span className="card-footer-icon">⤵</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {selectedCard && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedCard(null)}
            >
              ×
            </button>

            <div className="modal-header">
              <div className="modal-heading">
                <h2 className="modal-title">{selectedCard.name}</h2>
                {selectedCard.setName && (
                  <p className="modal-set">{selectedCard.setName}</p>
                )}
                <p className="modal-subtitle">
                  {selectedCard.entries.length}{" "}
                  {selectedCard.entries.length === 1
                    ? "buylist across all stores"
                    : "buylists across all stores"}
                </p>
              </div>
              {selectedCard.imageUrl && (
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.name}
                  className="modal-image"
                />
              )}
            </div>

            <div className="modal-table-wrap">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Best cash</th>
                    <th>Best credit</th>
                    <th>Conditions &amp; offers</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard.entries.map((entry) => (
                    <tr key={entry.storeId}>
                      <td className="cell-store">{entry.storeName}</td>
                      <td className="cell-money">
                        {typeof entry.bestCash === "number" ? (
                          <span className="money-chip">
                            ${entry.bestCash.toFixed(2)}
                          </span>
                        ) : (
                          <span className="money-none">–</span>
                        )}
                      </td>
                      <td className="cell-money">
                        {typeof entry.bestCredit === "number" ? (
                          <span className="money-chip money-chip--credit">
                            ${entry.bestCredit.toFixed(2)}
                          </span>
                        ) : (
                          <span className="money-none">–</span>
                        )}
                      </td>
                      <td className="cell-conditions">
                        {entry.variants.length === 0 ? (
                          <span className="conditions-none">
                            No variant data
                          </span>
                        ) : (
                          <div className="conditions-list">
                            {entry.variants.map((v) => (
                              <div key={v.id} className="conditions-item">
                                <span className="conditions-title">{v.title}</span>
                                <span className="conditions-offers">
                                  {typeof v.offer_price === "number"
                                    ? `$${v.offer_price.toFixed(2)}`
                                    : "-"}{" "}
                                  <span className="conditions-sep">/</span>
                                  {typeof v.offer_price_credit === "number"
                                    ? `$${v.offer_price_credit.toFixed(2)}`
                                    : "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="modal-footnote">
              Prices shown are current buylist offers from connected
              Storepass-powered retailers.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
