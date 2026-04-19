import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { push, ref } from 'firebase/database';
import Layout from '../components/Layout';
import useSiteData from '../hooks/useSiteData';
import { useCart } from '../context/CartContext';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';

function CheckoutPage() {
  const { siteData } = useSiteData();
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (!items.length) {
      setStatus('Cart is empty.');
      return;
    }

    await push(ref(database, 'orders'), {
      userId: user?.uid || 'guest',
      email: user?.email || 'guest',
      fullName,
      phone,
      pincode,
      items,
      address,
      instructions,
      paymentMethod: 'cod',
      status: 'Confirmed',
      total: cartTotal,
      createdAt: Date.now(),
    });
    clearCart();
    setStatus('Order placed successfully.');
    setTimeout(() => navigate('/'), 1400);
  };

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="section">
        <h1>Checkout</h1>
        <p>Order total: Rs. {cartTotal}</p>
        <p>Payment mode: Cash on Delivery</p>
        <form onSubmit={handlePlaceOrder} className="admin-card">
          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            minLength={10}
            required
          />
          <input
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
          <textarea
            rows={6}
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <textarea
            rows={3}
            placeholder="Delivery instructions (optional)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          <button type="submit">Place order</button>
        </form>
        {status && <p className="success-text">{status}</p>}
      </section>
    </Layout>
  );
}

export default CheckoutPage;
