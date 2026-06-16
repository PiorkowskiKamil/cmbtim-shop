import { useEffect, useLayoutEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation, useNavigationType } from 'react-router-dom'
import { Header } from './components'
import { Home, Category, Product, Cart, Checkout, Search, Privacy, Cookies } from './pages'

function ScrollManager() {
  const location = useLocation()
  const navType = useNavigationType()
  const positions = useRef<Map<string, number>>(new Map())

  // own scroll restoration ourselves — don't let the browser fight us
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // continuously record where the current history entry is scrolled
  useEffect(() => {
    const key = location.key
    const onScroll = () => positions.current.set(key, window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.key])

  // route change: restore on back/forward (POP), jump to top on a new nav (PUSH/REPLACE).
  // data is synchronous (bundled JSON) so page height is final here → restore lands correctly
  useLayoutEffect(() => {
    if (navType === 'POP') window.scrollTo(0, positions.current.get(location.key) ?? 0)
    else window.scrollTo(0, 0)
  }, [location.key, navType])

  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollManager />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kategoria/:slug" element={<Category />} />
          <Route path="/produkt/:id" element={<Product />} />
          <Route path="/koszyk" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/szukaj" element={<Search />} />
          <Route path="/polityka-prywatnosci" element={<Privacy />} />
          <Route path="/polityka-cookies" element={<Cookies />} />
        </Routes>
      </div>
      <footer className="bg-navy text-white mt-12">
        <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-display font-semibold text-gold mb-2">Adres</h3>
            <p className="text-white/70 leading-relaxed">
              CMB TIM S.C.
              <br />
              ul. Pucka 87
              <br />
              81-036 Gdynia
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-gold mb-2">E-mail</h3>
            <p className="text-white/70 leading-relaxed">
              <a href="mailto:cmbtim@wp.pl" className="hover:text-gold">
                cmbtim@wp.pl
              </a>
              <br />
              <a href="mailto:joanna.cmbtim@wp.pl" className="hover:text-gold">
                joanna.cmbtim@wp.pl
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-gold mb-2">Telefon</h3>
            <p className="text-white/70 leading-relaxed">
              <a href="tel:+48698663788" className="hover:text-gold">
                +48 698 663 788
              </a>
              <br />
              <a href="tel:+48533087556" className="hover:text-gold">
                +48 533 087 556
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-gold mb-2">Godziny otwarcia</h3>
            <p className="text-white/70 leading-relaxed">
              Pn – Pt: 7:00 – 16:00
              <br />
              So: 7:00 – 12:00
            </p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
            <span>© 2026 CMB TIM — demo sklepu</span>
            <span className="flex gap-3">
              <Link to="/polityka-prywatnosci" className="hover:text-gold underline">
                Polityka prywatności
              </Link>
              <span>/</span>
              <Link to="/polityka-cookies" className="hover:text-gold underline">
                Polityka Cookies
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
