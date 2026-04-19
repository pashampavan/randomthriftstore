import { useState } from 'react';
import { Link } from 'react-router-dom';
import { push, ref } from 'firebase/database';
import Layout from '../components/Layout';
import useSiteData from '../hooks/useSiteData';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';

const initial = { name: '', email: '', phone: '', city: '', message: '' };

function JoinSellerPage() {
  const { siteData } = useSiteData();
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initial,
    email: user?.email || '',
    name: user?.displayName || '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await push(ref(database, 'sellerInquiries'), {
        ...form,
        userId: user?.uid || null,
        createdAt: Date.now(),
        source: 'join_seller_page',
      });
      setStatus('Thanks — we received your request. Our team will contact you soon.');
      setForm({ ...initial, email: user?.email || '', name: user?.displayName || '' });
    } catch (err) {
      setStatus(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="section join-seller-page">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span>Join as seller</span>
        </nav>
        <h1>Join as a seller</h1>
        <p className="muted join-lead">
          List your preloved pieces — we handle logistics and buyer support. Tell us a bit about you and we will reach
          out.
        </p>

        <form className="join-seller-form admin-card" onSubmit={handleSubmit}>
          <input required placeholder="Full name" value={form.name} onChange={handleChange('name')} />
          <input required type="email" placeholder="Email" value={form.email} onChange={handleChange('email')} />
          <input required placeholder="Phone (WhatsApp preferred)" value={form.phone} onChange={handleChange('phone')} />
          <input placeholder="City" value={form.city} onChange={handleChange('city')} />
          <textarea rows={4} placeholder="What do you want to sell? (optional)" value={form.message} onChange={handleChange('message')} />
          {status && <p className={status.startsWith('Thanks') ? 'success-text' : 'error-text'}>{status}</p>}
          <button type="submit" className="btn-primary-wide" disabled={loading}>
            {loading ? 'Sending…' : 'Submit application'}
          </button>
        </form>
        <p className="muted small-print">
          Submissions are stored in Firebase Realtime Database under <code>sellerInquiries</code>. Admins can review
          them in the Admin → Leads tab.
        </p>
      </section>
    </Layout>
  );
}

export default JoinSellerPage;
