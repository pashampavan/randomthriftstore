import { useState } from 'react';
import { push, ref } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useJoinSeller } from '../context/JoinSellerContext';

function JoinSellerModal() {
  const { joinSellerOpen, closeJoinSeller } = useJoinSeller();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  if (!joinSellerOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus('');
    try {
      await push(ref(database, 'sellerLeads'), {
        type: 'join_seller',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
        userId: user?.uid || null,
        userEmail: user?.email || null,
        createdAt: Date.now(),
      });
      setStatus('Thank you — we received your request.');
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setTimeout(() => closeJoinSeller(), 1600);
    } catch (err) {
      setStatus(err.message || 'Could not save. Check Firebase rules.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={closeJoinSeller}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-seller-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="join-seller-title">Join as a seller</h2>
          <button type="button" className="modal-close" aria-label="Close" onClick={closeJoinSeller}>
            ×
          </button>
        </div>
        <p className="modal-lead">Tell us how to reach you. We will review and get back with next steps.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="admin-label">
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="admin-label">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="admin-label">
            Phone / WhatsApp
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required minLength={8} />
          </label>
          <label className="admin-label">
            What would you like to sell? (optional)
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          {status && <p className={status.startsWith('Thank') ? 'success-text' : 'error-text'}>{status}</p>}
          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={closeJoinSeller}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? 'Sending…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinSellerModal;
