/**
 * Category mega-menu schema (inspired by thrift storefront nav patterns).
 * Legacy format: { men: ['A','B'], ... } — migrated to columns on read.
 */

const GENDER_KEYS = ['men', 'women', 'kids', 'luxury'];

export function isLegacyCategories(categories) {
  if (!categories || typeof categories !== 'object') return true;
  const sample = categories.men ?? categories.women ?? categories.kids ?? categories.luxury;
  if (!Array.isArray(sample) || sample.length === 0) return false;
  return typeof sample[0] === 'string';
}

/** @returns {Record<string, Array<{heading?: string, sections: Array<{title: string, items: string[]}>}>>} */
export function migrateCategoriesToColumns(categories) {
  if (!categories || typeof categories !== 'object') return getEmptyCategories();
  if (!isLegacyCategories(categories)) {
    return normalizeCategoryColumns(categories);
  }
  const out = {};
  GENDER_KEYS.forEach((key) => {
    const arr = Array.isArray(categories[key]) ? categories[key] : [];
    out[key] =
      arr.length > 0
        ? [{ heading: 'Shop', sections: [{ title: 'All', items: [...arr] }] }]
        : [];
  });
  return out;
}

function getEmptyCategories() {
  return { men: [], women: [], kids: [], luxury: [] };
}

function normalizeCategoryColumns(categories) {
  const out = { ...getEmptyCategories(), ...categories };
  GENDER_KEYS.forEach((key) => {
    const cols = Array.isArray(out[key]) ? out[key] : [];
    out[key] = cols.map((col) => ({
      heading: col.heading || col.title || '',
      sections: Array.isArray(col.sections)
        ? col.sections.map((sec) => ({
            title: sec.title || sec.name || 'Shop',
            items: Array.isArray(sec.items)
              ? sec.items.map(String)
              : typeof sec.items === 'string'
                ? sec.items
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
          }))
        : [],
    }));
  });
  return out;
}

/** All leaf labels for one gender — for admin product subcategory <select> */
export function flattenSubcategoryLabels(categories, genderKey) {
  const cols = migrateCategoriesToColumns(categories)[genderKey] || [];
  const labels = new Set();
  cols.forEach((col) => {
    (col.sections || []).forEach((sec) => {
      (sec.items || []).forEach((item) => {
        if (item && String(item).trim()) labels.add(String(item).trim());
      });
      if (sec.title && (!sec.items || sec.items.length === 0)) {
        labels.add(sec.title.trim());
      }
    });
    if (col.heading && (!col.sections || col.sections.length === 0)) {
      labels.add(col.heading.trim());
    }
  });
  return Array.from(labels).sort((a, b) => a.localeCompare(b));
}
