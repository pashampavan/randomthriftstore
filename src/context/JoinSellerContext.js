import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import JoinSellerModal from '../components/JoinSellerModal';

const JoinSellerContext = createContext(null);

export function JoinSellerProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openJoinSeller = useCallback(() => setOpen(true), []);
  const closeJoinSeller = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      openJoinSeller,
      closeJoinSeller,
      joinSellerOpen: open,
    }),
    [closeJoinSeller, open, openJoinSeller]
  );

  return (
    <JoinSellerContext.Provider value={value}>
      {children}
      <JoinSellerModal />
    </JoinSellerContext.Provider>
  );
}

export function useJoinSeller() {
  const ctx = useContext(JoinSellerContext);
  if (!ctx) {
    throw new Error('useJoinSeller must be used within JoinSellerProvider');
  }
  return ctx;
}
