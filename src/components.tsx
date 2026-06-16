import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { categories, type Product } from './data/getProducts'
import { useCart } from './cart'

export const zl = (n: number) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł'

// ponytail: inline SVG image-placeholder — zero deps, swap for a real <img> when the cmbtim feed exists
export const Placeholder = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-12 h-12 text-steel/30"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
)

export function Header() {
  const { count } = useCart()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = useNavigate()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (q.trim()) nav('/szukaj?q=' + encodeURIComponent(q.trim()))
  }
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4 md:gap-6">
        <Link to="/" className="font-display font-bold text-xl tracking-wide shrink-0">
          CMB <span className="text-gold">TIM</span>
        </Link>
        <form onSubmit={submit} className="flex-1 max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj produktów…"
            aria-label="Szukaj produktów"
            className="w-full rounded px-3 py-2 text-ink text-sm outline-none"
          />
        </form>
        <Link to="/koszyk" className="ml-auto font-display text-sm flex items-center gap-2 shrink-0 hover:text-gold transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Koszyk
          <span className="inline-flex items-center justify-center bg-gold text-navy rounded-full w-6 h-6 text-xs font-bold">
            {count}
          </span>
        </Link>
      </div>
      <nav className="border-t border-white/10">
        {/* mobile: toggle; desktop: hidden (row always shown) */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          className="md:hidden flex items-center justify-center gap-2 w-full px-4 py-3 text-sm text-white/80 hover:text-gold"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Kategorie
        </button>
        {/* vertical drawer on mobile (toggled), inline row on desktop */}
        <div
          className={
            (menuOpen ? 'flex' : 'hidden') +
            ' md:flex mx-auto max-w-6xl px-4 flex-col md:flex-row md:flex-wrap gap-x-5 md:gap-y-1 pb-2 md:py-2 text-sm'
          }
        >
          {categories.map((c) => (
            <NavLink
              key={c.slug}
              to={'/kategoria/' + c.slug}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                // ponytail: colour only, never font-weight — bold glyphs are wider → flex row reflows on switch
                'transition py-2.5 text-center border-b border-white/10 last:border-0 md:border-0 md:py-0 md:text-left ' +
                (isActive ? 'text-gold' : 'text-white/80 hover:text-gold')
              }
            >
              {c.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  const { add } = useCart()
  if (!products.length) return <p className="text-steel py-10">Brak wyników.</p>
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {products.map((p) => (
        <div key={p.id} className="border border-black/10 rounded-lg overflow-hidden flex flex-col bg-white">
          <Link
            to={'/produkt/' + p.id}
            className="aspect-square bg-mist flex items-center justify-center"
          >
            <Placeholder />
          </Link>
          <div className="p-3 flex flex-col gap-2 flex-1">
            <Link
              to={'/produkt/' + p.id}
              className="font-display font-semibold text-sm leading-tight hover:text-gold transition"
            >
              {p.name}
            </Link>
            <span className="text-navy font-bold mt-auto">{zl(p.price)}</span>
            <button
              onClick={() => add(p.id)}
              className="bg-gold text-navy font-display font-semibold text-sm rounded py-2 hover:bg-gold-dark transition"
            >
              Do koszyka
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
