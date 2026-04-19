import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { migrateCategoriesToColumns } from '../utils/categorySchema';

function Layout({ children, menu = [], categories = {} }) {
  const { user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const [activeMenu, setActiveMenu] = useState('');
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const hideSellerTab = location.pathname.startsWith('/admin');

  const navCategories = useMemo(() => migrateCategoriesToColumns(categories), [categories]);
  const categoryKeys = useMemo(() => Object.keys(navCategories || {}), [navCategories]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/category/all?q=${encodeURIComponent(query)}` : '/category/all');
    setMobileOpen(false);
  };

  const goSub = (genderId, label) => {
    if (!label) return;
    navigate(`/category/${genderId}?sub=${encodeURIComponent(label)}`);
    setActiveMenu('');
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!activeMenu) return undefined;
    const close = () => setActiveMenu('');
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [activeMenu]);

  return (
    <div className="layout-root">
      <header className="topbar">
        <div className="topbar-left">
          <button
            type="button"
            className="icon-btn mobile-only"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            ☰
          </button>
          <Link to="/" className="brand">
            REWAGO
          </Link>
        </div>

        <nav
          className="menu desktop-only"
          onMouseLeave={() => setActiveMenu('')}
        >
          {menu.map((item) => (
            <div
              key={item.id || item.label}
              className="menu-item-wrap"
              onMouseEnter={() => setActiveMenu(item.id)}
            >
              <NavLink
                to={`/category/${item.id}`}
                className={({ isActive }) => `menu-item ${isActive ? 'menu-active' : ''}`}
              >
                {item.label}
                {categoryKeys.includes(item.id) ? <span className="menu-chevron">▾</span> : null}
              </NavLink>
              {activeMenu === item.id && categoryKeys.includes(item.id) && (
                <div className="mega-panel" role="navigation" aria-label={`${item.label} submenu`}>
                  {(navCategories[item.id] || []).map((col, ci) => (
                    <div className="mega-col" key={`col-${ci}`}>
                      {col.heading ? <div className="mega-heading">{col.heading}</div> : null}
                      {(col.sections || []).map((sec, si) => (
                        <div className="mega-section" key={`sec-${ci}-${si}`}>
                          <div className="mega-section-title">{sec.title}</div>
                          {(sec.items || []).length > 0 ? (
                            <ul className="mega-links">
                              {(sec.items || []).map((leaf) => (
                                <li key={leaf}>
                                  <button type="button" className="mega-link-btn" onClick={() => goSub(item.id, leaf)}>
                                    {leaf}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <button type="button" className="mega-link-btn mega-link-single" onClick={() => goSub(item.id, sec.title)}>
                              {sec.title}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <NavLink to="/blogs" className="menu-item">
            JOURNAL
          </NavLink>
        </nav>

        <form onSubmit={handleSearch} className="search-wrap desktop-only">
          <input
            placeholder="Search catalog"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            aria-label="Search"
          />
          <button type="submit" className="search-submit" aria-label="Submit search">
            ⌕
          </button>
        </form>

        <div className="auth-actions">
          {user ? (
            <>
              {role === 'admin' && (
                <NavLink to="/admin" className="btn-link">
                  Admin
                </NavLink>
              )}
              <NavLink to="/cart" className="btn-link">
                Cart ({cartCount})
              </NavLink>
              <NavLink to="/orders" className="btn-link">
                Orders
              </NavLink>
              <button type="button" onClick={logout} className="btn-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/cart" className="btn-link">
                Cart ({cartCount})
              </NavLink>
              <NavLink to="/login" className="btn-link">
                Login
              </NavLink>
              <NavLink to="/signup" className="btn-link">
                Signup
              </NavLink>
            </>
          )}
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-drawer-backdrop" role="presentation" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer-head">
          <strong>Menu</strong>
          <button type="button" className="icon-btn" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            ×
          </button>
        </div>
        <form onSubmit={handleSearch} className="mobile-search">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-link">
            Search
          </button>
        </form>
        {menu.map((item) => (
          <div key={item.id || item.label} className="mobile-menu-block">
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileExpanded((prev) => (prev === item.id ? '' : item.id))}
            >
              {item.label}
              <span>{mobileExpanded === item.id ? '▾' : '▸'}</span>
            </button>
            {mobileExpanded === item.id && categoryKeys.includes(item.id) && (
              <div className="mobile-submenu">
                {(navCategories[item.id] || []).map((col, ci) => (
                  <div key={`m-${ci}`}>
                    {col.heading ? <div className="mega-heading">{col.heading}</div> : null}
                    {(col.sections || []).map((sec, si) => (
                      <div key={`ms-${ci}-${si}`}>
                        <div className="mega-section-title">{sec.title}</div>
                        {(sec.items || []).length > 0 ? (
                          (sec.items || []).map((leaf) => (
                            <button
                              type="button"
                              key={leaf}
                              className="mobile-link-btn"
                              onClick={() => goSub(item.id, leaf)}
                            >
                              {leaf}
                            </button>
                          ))
                        ) : (
                          <button type="button" className="mobile-link-btn" onClick={() => goSub(item.id, sec.title)}>
                            {sec.title}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <Link to={`/category/${item.id}`} className="mobile-all" onClick={() => setMobileOpen(false)}>
                  All {item.label}
                </Link>
              </div>
            )}
          </div>
        ))}
        <Link to="/blogs" className="mobile-link-btn journal-link" onClick={() => setMobileOpen(false)}>
          Journal
        </Link>
      </aside>

      <main>{children}</main>

      {!hideSellerTab && (
        <Link to="/join-seller" className="join-seller-tab" title="Join as seller">
          JOIN AS SELLER
        </Link>
      )}

      <footer className="site-footer">
        <div className="footer-grid section">
          <div>
            <div className="brand footer-brand">REWAGO</div>
            <p className="footer-tag">THE GO-TO FOR THRIFTED STYLES AT LOW PRICE</p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/category/all">All Products</Link>
            <Link to="/blogs">Journal</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link to="/">FAQs</Link>
            <Link to="/">Contact</Link>
            <Link to="/join-seller">Join as seller</Link>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/category/women">Women</Link>
            <Link to="/category/men">Men</Link>
            <Link to="/category/kids">Kids</Link>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Rewago-style demo storefront</div>
      </footer>
    </div>
  );
}

export default Layout;
