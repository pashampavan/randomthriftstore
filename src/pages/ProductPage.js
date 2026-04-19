import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import useSiteData, { normalizeProducts } from '../hooks/useSiteData';
import { useCart } from '../context/CartContext';

function ProductPage() {
  const { productId } = useParams();
  const { siteData } = useSiteData();
  const { addToCart } = useCart();
  const products = normalizeProducts(siteData?.sections?.trending || []);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
        <section className="section">
          <h2>Product not found</h2>
          <Link to="/">Go back to homepage</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="section product-layout">
        <img src={product.imageUrl} alt={product.title} className="product-image" />
        <div>
          <h1>{product.title}</h1>
          <p>{product.subtitle}</p>
          <h3>Rs. {product.price}</h3>
          <p>
            Brand: <strong>{product.brand}</strong> | Stock left: {product.stock}
          </p>
          {product.subcategory ? (
            <p>
              Category: <strong>{product.category}</strong> · {product.subcategory}{' '}
              <Link to={`/category/${product.category}?sub=${encodeURIComponent(product.subcategory)}`}>
                Browse similar
              </Link>
            </p>
          ) : (
            <p>
              Category: <strong>{product.category}</strong>
            </p>
          )}
          <p>{product.description}</p>
          <button type="button" onClick={() => addToCart(product)}>
            Add to cart
          </button>
          <Link to="/cart" className="btn-link inline-btn">
            Go to cart
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export default ProductPage;
