import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { onValue, ref, set } from 'firebase/database';
import Layout from '../components/Layout';
import { database } from '../firebase';
import useSiteData from '../hooks/useSiteData';
import { flattenSubcategoryLabels, migrateCategoriesToColumns } from '../utils/categorySchema';

const tabs = [
  'menu',
  'categories',
  'promoTiles',
  'hero',
  'products',
  'brands',
  'blogs',
  'faq',
  'sellerBanner',
  'leads',
  'json',
];
const categoryKeys = ['men', 'women', 'kids', 'luxury'];
const genderOptions = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
  { value: 'luxury', label: 'Luxury Brands' },
];

const catalogScopeOptions = [
  { value: 'all', label: 'All catalog' },
  { value: 'men', label: 'Men only' },
  { value: 'women', label: 'Women only' },
  { value: 'kids', label: 'Kids only' },
  { value: 'luxury', label: 'Luxury only' },
];

function AdminPage() {
  const { siteData, setSiteData } = useSiteData();
  const [activeTab, setActiveTab] = useState('categories');
  const [status, setStatus] = useState('');
  const [jsonValue, setJsonValue] = useState('');
  const [sellerLeads, setSellerLeads] = useState([]);
  const [donationLeads, setDonationLeads] = useState([]);

  const data = useMemo(() => siteData || {}, [siteData]);

  const writeSiteData = async (nextData, message) => {
    await set(ref(database, 'siteData'), nextData);
    setSiteData(nextData);
    setStatus(message);
  };

  const updateNested = (path, value) => {
    setSiteData((prev) => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        cur[path[i]] = { ...(cur[path[i]] || {}) };
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateArrayItem = (section, index, field, value) => {
    const next = [...(data.sections?.[section] || [])];
    next[index] = { ...next[index], [field]: value };
    updateNested(['sections', section], next);
  };

  const removeArrayItem = (section, index) => {
    const next = (data.sections?.[section] || []).filter((_, idx) => idx !== index);
    updateNested(['sections', section], next);
  };

  const addArrayItem = (section, template) => {
    const next = [...(data.sections?.[section] || []), template];
    updateNested(['sections', section], next);
  };

  const saveActive = async (name) => writeSiteData(data, `${name} saved successfully.`);

  const categoryColumns = useMemo(
    () => migrateCategoriesToColumns(data.sections?.categories || {}),
    [data.sections?.categories]
  );

  const setCategoryColumnsForGender = (gender, cols) => {
    const merged = { ...categoryColumns, [gender]: cols };
    updateNested(['sections', 'categories'], merged);
  };

  useEffect(() => {
    if (activeTab !== 'leads') return undefined;
    const sellerRef = ref(database, 'sellerInquiries');
    const donationRef = ref(database, 'donationLeads');
    const unsubSeller = onValue(sellerRef, (snap) => {
      if (!snap.exists()) {
        setSellerLeads([]);
        return;
      }
      const rows = Object.entries(snap.val()).map(([id, value]) => ({ id, ...value }));
      rows.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setSellerLeads(rows);
    });
    const unsubDonation = onValue(donationRef, (snap) => {
      if (!snap.exists()) {
        setDonationLeads([]);
        return;
      }
      const rows = Object.entries(snap.val()).map(([id, value]) => ({ id, ...value }));
      rows.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setDonationLeads(rows);
    });
    return () => {
      unsubSeller();
      unsubDonation();
    };
  }, [activeTab]);

  const updatePromoTile = (index, field, value) => {
    const next = [...(data.promoTiles || [])];
    next[index] = { ...next[index], [field]: value };
    updateNested(['promoTiles'], next);
  };

  const removePromoTile = (index) => {
    const next = (data.promoTiles || []).filter((_, i) => i !== index);
    updateNested(['promoTiles'], next);
  };

  const addPromoTile = () => {
    const next = [
      ...(data.promoTiles || []),
      { label: '', discount: '', imageUrl: '', searchQuery: '', categoryId: 'all' },
    ];
    updateNested(['promoTiles'], next);
  };

  return (
    <Layout menu={data.menu || []} categories={data?.sections?.categories}>
      <section className="section admin-wrap">
        <div className="admin-head">
          <h1>Admin Dashboard</h1>
          <p>Professional content management for store, categories, and blogs.</p>
        </div>
        {status && <p className="success-text">{status}</p>}

        <div className="tab-row">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'tab-active' : ''}`}
              onClick={() => {
                if (tab === 'json') {
                  setJsonValue(JSON.stringify(data, null, 2));
                }
                setActiveTab(tab);
              }}
            >
              {tab === 'products' ? 'Products' : tab === 'promoTiles' ? 'Wear tiles' : tab === 'leads' ? 'Leads' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'menu' && (
          <section className="admin-card">
            <h3>Main Navbar</h3>
            <p>Use ids: men, women, kids, luxury for category routing.</p>
            {(data.menu || []).map((item, index) => (
              <div key={`${item.id}-${index}`} className="admin-list-item">
                <input
                  value={item.id || ''}
                  onChange={(e) => {
                    const next = [...(data.menu || [])];
                    next[index] = { ...next[index], id: e.target.value.toLowerCase() };
                    updateNested(['menu'], next);
                  }}
                  placeholder="menu id"
                />
                <input
                  value={item.label || ''}
                  onChange={(e) => {
                    const next = [...(data.menu || [])];
                    next[index] = { ...next[index], label: e.target.value };
                    updateNested(['menu'], next);
                  }}
                  placeholder="menu label"
                />
              </div>
            ))}
            <button type="button" onClick={() => updateNested(['menu'], [...(data.menu || []), { id: '', label: '' }])}>
              Add Navbar Item
            </button>
            <button type="button" onClick={() => saveActive('Navbar')}>
              Save Navbar
            </button>
          </section>
        )}

        {activeTab === 'categories' && (
          <section className="admin-card admin-categories">
            <h3>Navbar mega menu (columns)</h3>
            <p>
              Each gender has columns. Inside a column, add sections (e.g. Clothing) and list sub-links one per line.
              This drives the storefront dropdown and the product subcategory list.
            </p>
            {categoryKeys.map((gender) => {
              const cols = categoryColumns[gender] || [];
              return (
                <div key={gender} className="admin-gender-block">
                  <div className="admin-gender-head">
                    <strong>{gender.toUpperCase()}</strong>
                    <button
                      type="button"
                      className="ghost-btn small-btn"
                      onClick={() =>
                        setCategoryColumnsForGender(gender, [
                          ...cols,
                          { heading: '', sections: [{ title: 'New section', items: [] }] },
                        ])
                      }
                    >
                      + Column
                    </button>
                  </div>
                  {cols.length === 0 && (
                    <button
                      type="button"
                      className="ghost-btn small-btn"
                      onClick={() =>
                        setCategoryColumnsForGender(gender, [
                          { heading: '', sections: [{ title: 'Section', items: [] }] },
                        ])
                      }
                    >
                      Add first column
                    </button>
                  )}
                  {cols.map((col, colIndex) => (
                    <div key={`${gender}-col-${colIndex}`} className="admin-column-card">
                      <div className="admin-column-head">
                        <input
                          value={col.heading || ''}
                          placeholder="Column heading (e.g. NEW ARRIVAL)"
                          onChange={(e) => {
                            const next = cols.map((c, i) => (i === colIndex ? { ...c, heading: e.target.value } : c));
                            setCategoryColumnsForGender(gender, next);
                          }}
                        />
                        <button
                          type="button"
                          className="ghost-btn small-btn"
                          onClick={() => setCategoryColumnsForGender(gender, cols.filter((_, i) => i !== colIndex))}
                        >
                          Remove column
                        </button>
                      </div>
                      {(col.sections || []).map((sec, secIndex) => (
                        <div key={`${gender}-sec-${colIndex}-${secIndex}`} className="admin-section-card">
                          <div className="admin-section-head">
                            <input
                              value={sec.title || ''}
                              placeholder="Section title (e.g. Clothing)"
                              onChange={(e) => {
                                const nextCols = cols.map((c, ci) => {
                                  if (ci !== colIndex) return c;
                                  const sections = (c.sections || []).map((s, si) =>
                                    si === secIndex ? { ...s, title: e.target.value } : s
                                  );
                                  return { ...c, sections };
                                });
                                setCategoryColumnsForGender(gender, nextCols);
                              }}
                            />
                            <button
                              type="button"
                              className="ghost-btn small-btn"
                              onClick={() => {
                                const nextCols = cols.map((c, ci) => {
                                  if (ci !== colIndex) return c;
                                  return {
                                    ...c,
                                    sections: (c.sections || []).filter((_, si) => si !== secIndex),
                                  };
                                });
                                setCategoryColumnsForGender(gender, nextCols);
                              }}
                            >
                              Remove section
                            </button>
                          </div>
                          <label className="admin-label">Subcategory links (one per line)</label>
                          <textarea
                            rows={4}
                            value={(sec.items || []).join('\n')}
                            onChange={(e) => {
                              const items = e.target.value
                                .split('\n')
                                .map((line) => line.trim())
                                .filter(Boolean);
                              const nextCols = cols.map((c, ci) => {
                                if (ci !== colIndex) return c;
                                const sections = (c.sections || []).map((s, si) =>
                                  si === secIndex ? { ...s, items } : s
                                );
                                return { ...c, sections };
                              });
                              setCategoryColumnsForGender(gender, nextCols);
                            }}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        className="ghost-btn small-btn"
                        onClick={() => {
                          const nextCols = cols.map((c, ci) =>
                            ci === colIndex
                              ? { ...c, sections: [...(c.sections || []), { title: 'Section', items: [] }] }
                              : c
                          );
                          setCategoryColumnsForGender(gender, nextCols);
                        }}
                      >
                        + Section in this column
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            <button type="button" onClick={() => saveActive('Categories')}>
              Save categories to Firebase
            </button>
          </section>
        )}

        {activeTab === 'promoTiles' && (
          <section className="admin-card">
            <h3>Wear tiles (Casual, Party, Formal, …)</h3>
            <p className="muted">
              Each tile needs a label, discount text, image URL, a short <strong>search keyword</strong> (matched
              against product title and comma-separated <strong>tags</strong> on products), and which catalog scope to
              open.
            </p>
            {(data.promoTiles || []).map((tile, index) => (
              <div className="admin-list-item" key={`${tile.label}-${index}`}>
                <input
                  value={tile.label || ''}
                  placeholder="Label (e.g. Casual Wear)"
                  onChange={(e) => updatePromoTile(index, 'label', e.target.value)}
                />
                <input
                  value={tile.discount || ''}
                  placeholder="Discount text (e.g. 75-85% OFF)"
                  onChange={(e) => updatePromoTile(index, 'discount', e.target.value)}
                />
                <input
                  value={tile.imageUrl || ''}
                  placeholder="Image URL"
                  onChange={(e) => updatePromoTile(index, 'imageUrl', e.target.value)}
                />
                <input
                  value={tile.searchQuery || ''}
                  placeholder="Search keyword (e.g. casual, party, formal)"
                  onChange={(e) => updatePromoTile(index, 'searchQuery', e.target.value)}
                />
                <label className="admin-label">
                  Open catalog
                  <select
                    value={tile.categoryId || 'all'}
                    onChange={(e) => updatePromoTile(index, 'categoryId', e.target.value)}
                  >
                    {catalogScopeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" className="ghost-btn small-btn" onClick={() => removePromoTile(index)}>
                  Remove tile
                </button>
              </div>
            ))}
            <button type="button" className="ghost-btn small-btn" onClick={addPromoTile}>
              Add wear tile
            </button>
            <button type="button" onClick={() => saveActive('Wear tiles')}>
              Save wear tiles to Firebase
            </button>
          </section>
        )}

        {activeTab === 'hero' && (
          <section className="admin-card">
            <h3>Hero</h3>
            <input value={data.hero?.title || ''} onChange={(e) => updateNested(['hero', 'title'], e.target.value)} placeholder="Title" />
            <input value={data.hero?.subtitle || ''} onChange={(e) => updateNested(['hero', 'subtitle'], e.target.value)} placeholder="Subtitle" />
            <input value={data.hero?.imageUrl || ''} onChange={(e) => updateNested(['hero', 'imageUrl'], e.target.value)} placeholder="Image URL" />
            <input value={data.hero?.ctaLabel || ''} onChange={(e) => updateNested(['hero', 'ctaLabel'], e.target.value)} placeholder="CTA label" />
            <button type="button" onClick={() => saveActive('Hero')}>
              Save Hero
            </button>
          </section>
        )}

        {activeTab === 'products' && (
          <section className="admin-card">
            <h3>Products</h3>
            {(data.sections?.trending || []).map((item, index) => (
              <div className="admin-list-item" key={`${item.id || item.title}-${index}`}>
                <input value={item.id || ''} placeholder="id" onChange={(e) => updateArrayItem('trending', index, 'id', e.target.value)} />
                <input value={item.title || ''} placeholder="title" onChange={(e) => updateArrayItem('trending', index, 'title', e.target.value)} />
                <input value={item.subtitle || ''} placeholder="subtitle" onChange={(e) => updateArrayItem('trending', index, 'subtitle', e.target.value)} />
                <div className="admin-inline-two">
                  <label className="admin-label">
                    Gender / top category
                    <select
                      value={(item.category || 'men').toLowerCase()}
                      onChange={(e) => {
                        const cat = e.target.value.toLowerCase();
                        const next = [...(data.sections?.trending || [])];
                        next[index] = { ...next[index], category: cat, subcategory: '' };
                        updateNested(['sections', 'trending'], next);
                      }}
                    >
                      {genderOptions.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-label">
                    Subcategory (from mega menu)
                    <select
                      value={item.subcategory || ''}
                      onChange={(e) => updateArrayItem('trending', index, 'subcategory', e.target.value)}
                    >
                      <option value="">Select subcategory</option>
                      {flattenSubcategoryLabels(data.sections?.categories, (item.category || 'men').toLowerCase()).map(
                        (label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                </div>
                <input value={item.brand || ''} placeholder="brand" onChange={(e) => updateArrayItem('trending', index, 'brand', e.target.value)} />
                <input value={item.imageUrl || ''} placeholder="imageUrl" onChange={(e) => updateArrayItem('trending', index, 'imageUrl', e.target.value)} />
                <input value={item.price || 0} placeholder="price" onChange={(e) => updateArrayItem('trending', index, 'price', Number(e.target.value))} />
                <input value={item.stock || 0} placeholder="stock" onChange={(e) => updateArrayItem('trending', index, 'stock', Number(e.target.value))} />
                <textarea rows={3} value={item.description || ''} placeholder="description" onChange={(e) => updateArrayItem('trending', index, 'description', e.target.value)} />
                <input
                  value={typeof item.tags === 'string' ? item.tags : (item.tags || []).join(', ')}
                  placeholder="Tags: casual, party wear, formal (comma-separated — used by wear tiles search)"
                  onChange={(e) => updateArrayItem('trending', index, 'tags', e.target.value)}
                />
                <button type="button" className="ghost-btn" onClick={() => removeArrayItem('trending', index)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem('trending', {
                  id: `product-${Date.now()}`,
                  title: '',
                  subtitle: '',
                  category: 'men',
                  subcategory: '',
                  brand: '',
                  imageUrl: '',
                  price: 0,
                  stock: 0,
                  description: '',
                  tags: '',
                })
              }
            >
              Add Product
            </button>
            <button type="button" onClick={() => saveActive('Products')}>
              Save Products
            </button>
          </section>
        )}

        {activeTab === 'brands' && (
          <section className="admin-card">
            <h3>Brands</h3>
            {(data.sections?.brands || []).map((item, index) => (
              <div className="admin-list-item" key={`${item.name}-${index}`}>
                <input value={item.name || ''} placeholder="name" onChange={(e) => updateArrayItem('brands', index, 'name', e.target.value)} />
                <input value={item.imageUrl || ''} placeholder="imageUrl" onChange={(e) => updateArrayItem('brands', index, 'imageUrl', e.target.value)} />
                <button type="button" className="ghost-btn" onClick={() => removeArrayItem('brands', index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('brands', { name: '', imageUrl: '' })}>
              Add Brand
            </button>
            <button type="button" onClick={() => saveActive('Brands')}>
              Save Brands
            </button>
          </section>
        )}

        {activeTab === 'blogs' && (
          <section className="admin-card">
            <h3>Blog Management</h3>
            {(data.sections?.blogs || []).map((item, index) => (
              <div className="admin-list-item" key={`${item.id || item.title}-${index}`}>
                <input value={item.id || ''} placeholder="blog id" onChange={(e) => updateArrayItem('blogs', index, 'id', e.target.value)} />
                <input value={item.title || ''} placeholder="title" onChange={(e) => updateArrayItem('blogs', index, 'title', e.target.value)} />
                <input value={item.author || ''} placeholder="author" onChange={(e) => updateArrayItem('blogs', index, 'author', e.target.value)} />
                <input value={item.imageUrl || ''} placeholder="cover image URL" onChange={(e) => updateArrayItem('blogs', index, 'imageUrl', e.target.value)} />
                <textarea rows={3} value={item.excerpt || ''} placeholder="excerpt" onChange={(e) => updateArrayItem('blogs', index, 'excerpt', e.target.value)} />
                <button type="button" className="ghost-btn" onClick={() => removeArrayItem('blogs', index)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem('blogs', {
                  id: `blog-${Date.now()}`,
                  title: '',
                  author: '',
                  imageUrl: '',
                  excerpt: '',
                })
              }
            >
              Add Blog
            </button>
            <button type="button" onClick={() => saveActive('Blogs')}>
              Save Blogs
            </button>
          </section>
        )}

        {activeTab === 'faq' && (
          <section className="admin-card">
            <h3>FAQ</h3>
            {(data.sections?.faq || []).map((item, index) => (
              <div className="admin-list-item" key={`${item.question}-${index}`}>
                <input value={item.question || ''} placeholder="question" onChange={(e) => updateArrayItem('faq', index, 'question', e.target.value)} />
                <textarea rows={3} value={item.answer || ''} placeholder="answer" onChange={(e) => updateArrayItem('faq', index, 'answer', e.target.value)} />
                <button type="button" className="ghost-btn" onClick={() => removeArrayItem('faq', index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('faq', { question: '', answer: '' })}>
              Add FAQ
            </button>
            <button type="button" onClick={() => saveActive('FAQ')}>
              Save FAQ
            </button>
          </section>
        )}

        {activeTab === 'sellerBanner' && (
          <section className="admin-card">
            <h3>Seller Banner</h3>
            <input value={data.sellerBanner?.title || ''} onChange={(e) => updateNested(['sellerBanner', 'title'], e.target.value)} placeholder="title" />
            <textarea rows={3} value={data.sellerBanner?.body || ''} onChange={(e) => updateNested(['sellerBanner', 'body'], e.target.value)} placeholder="description" />
            <input value={data.sellerBanner?.ctaLabel || ''} onChange={(e) => updateNested(['sellerBanner', 'ctaLabel'], e.target.value)} placeholder="CTA label" />
            <p className="muted">
              The CTA opens the <Link to="/join-seller">Join as seller</Link> page. Applications are stored under{' '}
              <code>sellerInquiries</code> in Firebase.
            </p>
            <button type="button" onClick={() => saveActive('Seller banner')}>
              Save Seller Banner
            </button>
          </section>
        )}

        {activeTab === 'leads' && (
          <section className="admin-card">
            <h3>Leads (Firebase)</h3>
            <p className="muted">
              Seller applications: <code>sellerInquiries</code>. Donation WhatsApp captures: <code>donationLeads</code>.
            </p>
            <h4>Seller inquiries ({sellerLeads.length})</h4>
            <div className="lead-grid">
              {sellerLeads.length === 0 && <p className="muted">No submissions yet.</p>}
              {sellerLeads.map((row) => (
                <article key={row.id} className="lead-card">
                  <strong>{row.name || '—'}</strong>
                  <div>Email: {row.email || '—'}</div>
                  <div>Phone: {row.phone || '—'}</div>
                  <div>City: {row.city || '—'}</div>
                  {row.message ? <div>Message: {row.message}</div> : null}
                  <div className="muted">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : ''} · ID: {row.id.slice(0, 8)}…
                  </div>
                </article>
              ))}
            </div>
            <h4 style={{ marginTop: '24px' }}>Donation WhatsApp ({donationLeads.length})</h4>
            <div className="lead-grid">
              {donationLeads.length === 0 && <p className="muted">No donation leads yet.</p>}
              {donationLeads.map((row) => (
                <article key={row.id} className="lead-card">
                  <strong>WhatsApp</strong>
                  <div>{row.whatsapp || '—'}</div>
                  <div className="muted">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : ''} · ID: {row.id.slice(0, 8)}…
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'json' && (
          <section className="admin-card">
            <h3>Advanced JSON</h3>
            <textarea rows={20} value={jsonValue} onChange={(e) => setJsonValue(e.target.value)} />
            <button
              type="button"
              onClick={async () => {
                try {
                  const parsed = JSON.parse(jsonValue);
                  await writeSiteData(parsed, 'JSON saved successfully.');
                } catch (error) {
                  setStatus(`Invalid JSON: ${error.message}`);
                }
              }}
            >
              Save JSON
            </button>
          </section>
        )}
      </section>
    </Layout>
  );
}

export default AdminPage;
