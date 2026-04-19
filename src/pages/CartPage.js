import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import useSiteData from '../hooks/useSiteData';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { siteData } = useSiteData();
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="section">
        <h1>Cart</h1>
        {!items.length ? (
          <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.imageUrl} alt={item.title} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>Rs. {item.price}</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  />
                  <button type="button" className="ghost-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
            <h3>Total: Rs. {cartTotal}</h3>
            <p>Payment method available: Cash on Delivery (COD)</p>
            <Link to="/checkout" className="btn-link inline-btn">
              Proceed to checkout
            </Link>
          </>
        )}
      </section>
    </Layout>
  );
}

export default CartPage;
