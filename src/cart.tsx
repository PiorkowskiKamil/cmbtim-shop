import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getById, type Product } from './data/getProducts'

type CartLine = { id: string; qty: number }
type CartCtx = {
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
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

  // immutable updates — never mutate the existing lines array
  const add = (id: string) =>
    setLines((ls) => {
      const hit = ls.find((l) => l.id === id)
      return hit
        ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...ls, { id, qty: 1 }]
    })
  const remove = (id: string) => setLines((ls) => ls.filter((l) => l.id !== id))
  const clear = () => setLines([])

  const items = lines
    .map((l) => ({ product: getById(l.id), qty: l.qty }))
    .filter((i): i is { product: Product; qty: number } => Boolean(i.product))
  // count derived from `items` (same getById-filtered source as total) — a line
  // whose product vanished from data won't desync the badge from the cart body
  const count = items.reduce((n, i) => n + i.qty, 0)
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return <Ctx.Provider value={{ add, remove, clear, count, total, items }}>{children}</Ctx.Provider>
}

export const useCart = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}
