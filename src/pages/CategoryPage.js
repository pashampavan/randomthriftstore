import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import useSiteData, { normalizeProducts } from '../hooks/useSiteData';
import { useCart } from '../context/CartContext';

function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();
  const subRaw = searchParams.get('sub') || '';
  const subFilter = subRaw.trim().toLowerCase();
  const [sortBy, setSortBy] = useState('relevance');
  const { siteData } = useSiteData();
  const { addToCart } = useCart();

  const allProducts = normalizeProducts(siteData?.sections?.trending || []);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (categoryId !== 'all') {
      list = list.filter((item) => item.category === categoryId);
    }
    if (subFilter) {
      list = list.filter((item) => {
        const s = (item.subcategory || '').toLowerCase();
        return s === subFilter || s.includes(subFilter) || subFilter.includes(s);
      });
    }
    if (query) {
      list = list.filter((item) => {
        const blob = `${item.title} ${item.subtitle} ${item.brand} ${item.subcategory || ''}`.toLowerCase();
        if (blob.includes(query)) return true;
        const tags = item.tags || [];
        return tags.some((t) => t.includes(query) || query.includes(t));
      });
    }
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock') {
      list.sort((a, b) => b.stock - a.stock);
    }
    return list;
  }, [allProducts, categoryId, query, sortBy, subFilter]);

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="section">
        <div className="category-head">
          <div>
            <h1>{categoryId === 'all' ? 'All Products' : `${categoryId.toUpperCase()} Products`}</h1>
            {(subRaw || query) && (
              <p className="filter-chips">
                {subRaw ? <span className="chip">Subcategory: {subRaw}</span> : null}
                {query ? <span className="chip">Search: {query}</span> : null}
              </p>
            )}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="relevance">Sort: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Availability</option>
          </select>
        </div>

        {!filtered.length ? (
          <p>No products found for this filter.</p>
        ) : (
          <div className="card-grid">
            {filtered.map((item) => (
              <article className="card" key={item.id}>
                <Link to={`/product/${item.id}`} className="unstyled-link">
                  <img src={item.imageUrl} alt={item.title} />
                </Link>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <p>
                  <strong>{item.brand}</strong> | Stock: {item.stock}
                </p>
                <strong>Rs. {item.price}</strong>
                <button type="button" className="ghost-btn" onClick={() => addToCart(item)}>
                  Add to cart
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default CategoryPage;
