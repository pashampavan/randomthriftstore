import { useState } from 'react';
import { Link } from 'react-router-dom';
import { push, ref } from 'firebase/database';
import Layout from '../components/Layout';
import useSiteData, { normalizeProducts } from '../hooks/useSiteData';
import { useCart } from '../context/CartContext';
import { defaultSiteData } from '../data/defaultSiteData';
import { database } from '../firebase';
import { promoTileHref } from '../utils/promoTiles';

function HomePage() {
  const { siteData } = useSiteData();
  const { addToCart } = useCart();

  const trending = normalizeProducts(siteData?.sections?.trending || []);
  const brands = siteData?.sections?.brands || [];
  const faq = siteData?.sections?.faq || [];
  const blogs = siteData?.sections?.blogs || [];
  const promoTiles = siteData.promoTiles || defaultSiteData.promoTiles;
  const trustBar = siteData.trustBar || defaultSiteData.trustBar;
  const donation = siteData.donation || defaultSiteData.donation;

  const [whatsapp, setWhatsapp] = useState('');
  const [donationStatus, setDonationStatus] = useState('');
  const [donationLoading, setDonationLoading] = useState(false);

  const sendDonationLead = async (e) => {
    e.preventDefault();
    const num = whatsapp.trim();
    if (!num) {
      setDonationStatus('Please enter a WhatsApp number.');
      return;
    }
    setDonationLoading(true);
    setDonationStatus('');
    try {
      await push(ref(database, 'donationLeads'), {
        whatsapp: num,
        createdAt: Date.now(),
        source: 'homepage_donation',
      });
      setDonationStatus('Sent — we will contact you on WhatsApp.');
      setWhatsapp('');
    } catch (err) {
      setDonationStatus(err.message || 'Could not save. Check Firebase rules.');
    } finally {
      setDonationLoading(false);
    }
  };

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="hero" style={{ backgroundImage: `url(${siteData.hero?.imageUrl})` }}>
        <div className="hero-inner">
          <h1>{siteData.hero?.title}</h1>
          <p>{siteData.hero?.subtitle}</p>
          <Link to="/category/all" className="hero-cta">
            {siteData.hero?.ctaLabel || 'Shop now'}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="promo-tiles">
          {promoTiles.map((tile) => (
            <Link key={tile.label} to={promoTileHref(tile)} className="promo-tile">
              <img src={tile.imageUrl} alt={tile.label} />
              <div className="promo-tile-text">
                <strong>{tile.label}</strong>
                <span>{tile.discount}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="trust-bar">
        <div className="trust-inner section">
          {trustBar.map((line) => (
            <span key={line} className="trust-item">
              ✓ {line}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title-row">
          <h2>Trending Now</h2>
          <p className="muted">Preloved picks everyone&apos;s loving right now.</p>
        </div>
        <div className="card-grid">
          {trending.map((item) => (
            <article className="card" key={item.id}>
              <Link to={`/product/${item.id}`} className="unstyled-link">
                <img src={item.imageUrl} alt={item.title} />
              </Link>
              <h3>
                <Link to={`/product/${item.id}`} className="unstyled-link">
                  {item.title}
                </Link>
              </h3>
              <p className="muted">{item.subtitle}</p>
              <p className="stock-pill">{item.stock} in stock</p>
              <strong>Rs. {item.price}</strong>
              <button type="button" className="ghost-btn" onClick={() => addToCart(item)}>
                Add to cart
              </button>
            </article>
          ))}
        </div>
        <div className="section-cta-row">
          <Link to="/category/all" className="btn-link">
            View all
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-title-row center">
          <h2>Shop By Brand</h2>
        </div>
        <div className="brand-grid">
          {brands.map((brand) => (
            <article className="brand-card" key={`${brand.name}-${brand.imageUrl}`}>
              <img src={brand.imageUrl} alt={brand.name} />
              <p>{brand.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title-row">
          <h2>Our Journal</h2>
          <Link to="/blogs" className="btn-link">
            View all
          </Link>
        </div>
        <div className="blog-grid">
          {blogs.slice(0, 3).map((blog) => (
            <article key={blog.id || blog.title} className="blog-card">
              <img src={blog.imageUrl} alt={blog.title} />
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <Link to="/blogs" className="read-more">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="seller-banner section">
        <h2>{siteData.sellerBanner?.title}</h2>
        <p>{siteData.sellerBanner?.body}</p>
        <Link to="/join-seller" className="seller-cta">
          {siteData.sellerBanner?.ctaLabel}
        </Link>
      </section>

      <section className="section">
        <div className="donation-card">
          <p>{donation.description}</p>
          <form className="donation-row" onSubmit={sendDonationLead}>
            <input
              type="tel"
              placeholder={donation.placeholder}
              aria-label="WhatsApp number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <button type="submit" className="donation-send" disabled={donationLoading}>
              {donationLoading ? '…' : donation.buttonLabel}
            </button>
          </form>
          {donationStatus && (
            <p className={donationStatus.startsWith('Sent') ? 'success-text' : 'error-text'}>{donationStatus}</p>
          )}
        </div>
      </section>

      <section className="section">
        <h2>Frequently asked questions</h2>
        {faq.map((item) => (
          <details key={item.question || item.title} className="faq-item">
            <summary>{item.question || item.title}</summary>
            <p>{item.answer || item.subtitle}</p>
          </details>
        ))}
      </section>
    </Layout>
  );
}

export default HomePage;
