import { useEffect, useState } from 'react';
import { onValue, query, ref, orderByChild, equalTo } from 'firebase/database';
import Layout from '../components/Layout';
import { database } from '../firebase';
import useSiteData from '../hooks/useSiteData';
import { useAuth } from '../context/AuthContext';

function OrdersPage() {
  const { user } = useAuth();
  const { siteData } = useSiteData();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }
    const ordersQuery = query(ref(database, 'orders'), orderByChild('userId'), equalTo(user.uid));
    const unsubscribe = onValue(ordersQuery, (snapshot) => {
      if (!snapshot.exists()) {
        setOrders([]);
        return;
      }
      const mapped = Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value }));
      mapped.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(mapped);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="section">
        <h1>My Orders</h1>
        {!orders.length ? (
          <p>No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="admin-card">
                <h3>Order #{order.id.slice(-6).toUpperCase()}</h3>
                <p>Payment: Cash on Delivery</p>
                <p>Status: {order.status || 'Confirmed'}</p>
                <p>Total: Rs. {order.total}</p>
                <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Address: {order.address}</p>
                <p>Items: {(order.items || []).map((item) => item.title).join(', ')}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default OrdersPage;
