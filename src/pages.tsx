import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { categories, getBySlug, getById, search } from './data/getProducts'
import { ProductGrid, Placeholder, zl } from './components'
import { useCart } from './cart'

const Wrap = ({ children }: { children: ReactNode }) => (
  <main className="mx-auto max-w-6xl px-4 py-8 min-h-[60vh]">{children}</main>
)

export function Home() {
  return (
    <Wrap>
      <section className="bg-navy text-white rounded-xl px-6 md:px-10 py-12 md:py-16 mb-10">
        <h1 className="font-display font-bold text-3xl md:text-4xl max-w-2xl leading-tight">
          Skład materiałów budowlanych w Gdyni
        </h1>
        <p className="text-white/70 mt-3 max-w-xl">
          Od elewacji po narzędzia — produkty najwyższej jakości z każdej kategorii.
        </p>
      </section>

      <h2 className="font-display font-semibold text-xl mb-5">Kategorie</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to={'/kategoria/' + c.slug}
            className="group border border-black/10 rounded-lg overflow-hidden bg-white hover:border-gold hover:shadow-md transition flex flex-col"
          >
            <div className="aspect-[4/3] bg-mist flex items-center justify-center">
              <Placeholder />
            </div>
            <div className="p-5 flex flex-col">
              <span className="w-10 h-1 bg-gold mb-3 group-hover:w-16 transition-all" />
              <span className="font-display font-semibold">{c.name}</span>
              <span className="text-steel text-sm mt-1">{getBySlug(c.slug).length} produktów</span>
            </div>
          </Link>
        ))}
      </div>
    </Wrap>
  )
}

export function Category() {
  const { slug } = useParams()
  const cat = categories.find((c) => c.slug === slug)
  return (
    <Wrap>
      <h1 className="font-display font-bold text-2xl mb-6">{cat?.name ?? 'Kategoria'}</h1>
      <ProductGrid products={getBySlug(slug ?? '')} />
    </Wrap>
  )
}

export function Product() {
  const { id } = useParams()
  const p = getById(id ?? '')
  const { add, notify } = useCart()
  const [amount, setAmount] = useState('1')
  if (!p)
    return (
      <Wrap>
        <p>
          Nie znaleziono produktu.{' '}
          <Link className="text-gold" to="/">
            Wróć
          </Link>
        </p>
      </Wrap>
    )
  return (
    <Wrap>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-mist rounded-lg flex items-center justify-center">
          <Placeholder />
        </div>
        <div>
          <Link to={'/kategoria/' + p.slug} className="text-steel text-sm hover:text-gold transition">
            {p.category}
          </Link>
          <h1 className="font-display font-bold text-3xl mt-1">{p.name}</h1>
          <p className="text-navy font-bold text-2xl mt-4">{zl(p.price)}</p>
          <p className="text-ink/70 mt-4 leading-relaxed">{p.desc}</p>
          <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
            <div className="flex items-center border border-black/15 rounded-lg">
              <button
                onClick={() => setAmount((a) => String(Math.max(1, (parseInt(a) || 1) - 1)))}
                className="px-4 py-3 text-xl leading-none text-steel hover:text-gold"
                aria-label="Mniej"
              >
                −
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                onFocus={(e) => e.target.select()}
                onBlur={() => setAmount((a) => String(Math.max(1, parseInt(a) || 1)))}
                className="w-20 text-center py-3 text-base outline-none"
                aria-label="Ilość"
              />
              <button
                onClick={() => setAmount((a) => String((parseInt(a) || 0) + 1))}
                className="px-4 py-3 text-xl leading-none text-steel hover:text-gold"
                aria-label="Więcej"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                const n = Math.max(1, parseInt(amount) || 1)
                add(p.id, n)
                notify(`Dodano do koszyka (${n} szt.)`)
              }}
              className="bg-gold text-navy font-display font-semibold rounded px-8 py-3.5 hover:bg-gold-dark transition"
            >
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

export function Cart() {
  const { items, total, remove, count, add, setQty } = useCart()
  if (!count)
    return (
      <Wrap>
        <p className="text-steel">
          Koszyk jest pusty.{' '}
          <Link className="text-gold" to="/">
            Przeglądaj produkty
          </Link>
        </p>
      </Wrap>
    )
  return (
    <Wrap>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-steel hover:text-gold text-sm mb-4 transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Wróć do zakupów
      </Link>
      <h1 className="font-display font-bold text-2xl mb-6">Koszyk</h1>
      <div className="flex flex-col gap-3">
        {items.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center gap-4 border border-black/10 rounded-lg p-3 bg-white">
            <div className="w-16 h-16 bg-mist rounded flex items-center justify-center shrink-0">
              <Placeholder />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm truncate">{product.name}</p>
              <p className="text-steel text-sm">{zl(product.price)} / szt.</p>
            </div>
            <div className="flex items-center border border-black/15 rounded shrink-0">
              <button
                onClick={() => add(product.id, -1)}
                className="px-2.5 py-1 text-steel hover:text-gold"
                aria-label="Mniej"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                onFocus={(e) => e.target.select()}
                className="qty-input w-14 text-center py-1 outline-none text-sm"
                aria-label="Ilość"
              />
              <button
                onClick={() => add(product.id, 1)}
                className="px-2.5 py-1 text-steel hover:text-gold"
                aria-label="Więcej"
              >
                +
              </button>
            </div>
            <span className="font-bold text-navy w-24 text-right shrink-0 hidden sm:block">
              {zl(product.price * qty)}
            </span>
            <button
              onClick={() => remove(product.id)}
              className="text-steel hover:text-gold text-sm transition shrink-0"
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 border-t border-black/10 pt-4">
        <span className="font-display font-bold text-lg">Razem: {zl(total)}</span>
        <Link
          to="/checkout"
          className="bg-gold text-navy font-display font-semibold rounded px-8 py-3 hover:bg-gold-dark transition"
        >
          Do kasy
        </Link>
      </div>
    </Wrap>
  )
}

export function Checkout() {
  const { items, total, clear, count } = useCart()
  const [done, setDone] = useState(false)

  if (done)
    return (
      <Wrap>
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gold/20 text-gold mx-auto flex items-center justify-center text-3xl">
            ✓
          </div>
          <h1 className="font-display font-bold text-2xl mt-4">Zamówienie złożone</h1>
          <p className="text-steel mt-2">Dziękujemy! To demo — płatność nie została pobrana.</p>
          <Link to="/" className="inline-block mt-6 text-gold font-display font-semibold">
            Wróć do sklepu
          </Link>
        </div>
      </Wrap>
    )

  if (!count)
    return (
      <Wrap>
        <p className="text-steel">
          Koszyk jest pusty.{' '}
          <Link className="text-gold" to="/">
            Przeglądaj produkty
          </Link>
        </p>
      </Wrap>
    )

  const place = (e: FormEvent) => {
    e.preventDefault()
    clear()
    setDone(true)
  }

  return (
    <Wrap>
      <h1 className="font-display font-bold text-2xl mb-6">Kasa</h1>
      <form onSubmit={place} className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <input required placeholder="Imię i nazwisko" className="border border-black/15 rounded px-3 py-2" />
          <input required type="email" placeholder="E-mail" className="border border-black/15 rounded px-3 py-2" />
          <input required placeholder="Adres dostawy" className="border border-black/15 rounded px-3 py-2" />
          {/* ponytail: mock checkout — no payment gateway until the shop goes public */}
          <button className="bg-gold text-navy font-display font-semibold rounded py-3 hover:bg-gold-dark transition">
            Złóż zamówienie ({zl(total)})
          </button>
        </div>
        <div className="bg-mist rounded-lg p-4 h-fit">
          <h2 className="font-display font-semibold mb-3">Podsumowanie</h2>
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex justify-between text-sm py-1">
              <span>
                {product.name} ×{qty}
              </span>
              <span>{zl(product.price * qty)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t border-black/10 mt-2 pt-2">
            <span>Razem</span>
            <span>{zl(total)}</span>
          </div>
        </div>
      </form>
    </Wrap>
  )
}

export function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = search(q)
  return (
    <Wrap>
      <h1 className="font-display font-bold text-2xl mb-2">Wyniki: „{q}”</h1>
      <p className="text-steel text-sm mb-6">{results.length} produktów</p>
      <ProductGrid products={results} />
    </Wrap>
  )
}

export function Privacy() {
  return (
    <Wrap>
      <h1 className="font-display font-bold text-2xl mb-4">Polityka prywatności</h1>
      <div className="text-ink/70 max-w-2xl space-y-3 leading-relaxed">
        <p>Administrator danych: CMB TIM S.C., ul. Pucka 87, 81-036 Gdynia.</p>
        <p>
          W tym demo dane podane w zamówieniu (imię, e-mail, adres) nie są nigdzie wysyłane ani
          przechowywane — checkout jest zamockowany.
        </p>
        <p>
          W wersji produkcyjnej dane przetwarzane są wyłącznie w celu realizacji zamówienia (RODO art.
          6 ust. 1 lit. b). Kontakt: cmbtim@wp.pl.
        </p>
        <p className="text-steel text-sm">Treść demonstracyjna — nie stanowi porady prawnej.</p>
      </div>
    </Wrap>
  )
}

export function Cookies() {
  return (
    <Wrap>
      <h1 className="font-display font-bold text-2xl mb-4">Polityka Cookies</h1>
      <div className="text-ink/70 max-w-2xl space-y-3 leading-relaxed">
        <p>
          Ten sklep używa wyłącznie funkcjonalnego magazynu przeglądarki (localStorage) do zapamiętania
          zawartości koszyka.
        </p>
        <p>
          Nie używamy cookies analitycznych, marketingowych ani third-party — dlatego nie wyświetlamy
          banera zgody (przechowywanie niezbędne jest zwolnione z obowiązku zgody).
        </p>
        <p>Zawartość koszyka usuniesz czyszcząc dane witryny w przeglądarce.</p>
        <p className="text-steel text-sm">Treść demonstracyjna — nie stanowi porady prawnej.</p>
      </div>
    </Wrap>
  )
}
