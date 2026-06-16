import data from './products.json'

export type Product = {
  id: string
  name: string
  category: string
  slug: string
  price: number
  desc: string
}

const products = data as Product[]

// ponytail: reads bundled JSON now; swap the body for fetch(cmbtim API) when
// integration is real — every call site stays unchanged (the bought-back one-way door)
export function getProducts(): Product[] {
  return products
}

export const categories = [
  { name: 'Elewacje', slug: 'elewacje' },
  { name: 'Dekarskie', slug: 'dekarskie' },
  { name: 'Remonty', slug: 'remonty' },
  { name: 'Farby przemysłowe', slug: 'farby-przemyslowe' },
  { name: 'Elektryczne', slug: 'elektryczne' },
  { name: 'Hydrauliczne', slug: 'hydrauliczne' },
  { name: 'Narzędzia', slug: 'narzedzia' },
  { name: 'BHP', slug: 'bhp' },
]

export const getBySlug = (slug: string) => getProducts().filter((p) => p.slug === slug)
export const getById = (id: string) => getProducts().find((p) => p.id === id)
export const search = (q: string) =>
  q.trim() ? getProducts().filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : []
