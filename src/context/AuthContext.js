import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import { auth, database } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const roleRef = ref(database, `users/${firebaseUser.uid}/role`);
        const snapshot = await get(roleRef);
        setRole(snapshot.exists() ? snapshot.val() : 'user');
      } else {
        setRole('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      signUp: async (email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await set(ref(database, `users/${result.user.uid}`), {
          email,
          role: 'user',
          createdAt: Date.now(),
        });
        return result;
      },
      login: (email, password) => signInWithEmailAndPassword(auth, email, password),
      logout: () => signOut(auth),
    }),
    [loading, role, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
