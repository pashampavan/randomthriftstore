import { useEffect, useState } from 'react';
import { onValue, ref, set } from 'firebase/database';
import { database } from '../firebase';
import { defaultSiteData } from '../data/defaultSiteData';

function parseTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeProducts(rawProducts = []) {
  return rawProducts.map((item, index) => ({
    id: item.id || `product-${index + 1}`,
    title: item.title || `Product ${index + 1}`,
    subtitle: item.subtitle || '',
    imageUrl: item.imageUrl || 'https://picsum.photos/seed/fallback/500/650',
    price: Number(item.price || 0),
    category: (item.category || 'men').toLowerCase(),
    subcategory: (item.subcategory || '').trim(),
    tags: parseTags(item.tags),
    brand: item.brand || 'Rewago',
    stock: Number(item.stock ?? 5),
    description:
      item.description ||
      'Preloved product curated for quality and value. Check product photos and details before purchase.',
  }));
}

export default function useSiteData() {
  const [siteData, setSiteData] = useState(defaultSiteData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const siteRef = ref(database, 'siteData');
    const unsubscribe = onValue(siteRef, async (snapshot) => {
      if (snapshot.exists()) {
        setSiteData(snapshot.val());
      } else {
        await set(siteRef, defaultSiteData);
        setSiteData(defaultSiteData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { siteData, setSiteData, loading };
}
