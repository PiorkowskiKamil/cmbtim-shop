import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { getById, type Product } from './data/getProducts'

type CartLine = { id: string; qty: number }
type CartCtx = {
  add: (id: string, n?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  notify: (msg: string) => void
  count: number
  total: number
  items: { product: Product; qty: number }[]
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'cmbtim-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines))
  }, [lines])

  // transient "added to cart" toast — fired explicitly by add-to-cart buttons, not by cart ± steppers
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const notify = (msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  // immutable updates — never mutate the existing lines array
  // add n (default 1); a line dropping to qty ≤ 0 is removed
  const add = (id: string, n = 1) =>
    setLines((ls) => {
      const hit = ls.find((l) => l.id === id)
      if (!hit) return n > 0 ? [...ls, { id, qty: n }] : ls
      const qty = hit.qty + n
      return qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l))
    })
  // set an absolute qty (≤ 0 removes the line)
  const setQty = (id: string, qty: number) =>
    setLines((ls) =>
      qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l)),
    )
  const remove = (id: string) => setLines((ls) => ls.filter((l) => l.id !== id))
  const clear = () => setLines([])

  const items = lines
    .map((l) => ({ product: getById(l.id), qty: l.qty }))
    .filter((i): i is { product: Product; qty: number } => Boolean(i.product))
  // count derived from `items` (same getById-filtered source as total) — a line
  // whose product vanished from data won't desync the badge from the cart body
  const count = items.reduce((n, i) => n + i.qty, 0)
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return (
    <Ctx.Provider value={{ add, setQty, remove, clear, notify, count, total, items }}>
      {children}
      {toast && (
        <div
          role="status"
          className="toast fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-navy text-white px-4 py-3 rounded-lg shadow-lg text-sm"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold text-navy text-xs font-bold">
            ✓
          </span>
          {toast}
        </div>
      )}
    </Ctx.Provider>
  )
}

export const useCart = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}
