/** Build catalog URL for a homepage promo tile (wear type row). */
export function promoTileHref(tile) {
  const cat = tile?.categoryId && tile.categoryId !== 'all' ? tile.categoryId : 'all';
  const q = (tile?.searchQuery || tile?.label || '').trim();
  return `/category/${cat}?q=${encodeURIComponent(q)}`;
}
