import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError as FirebaseAuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            const userData = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              role: firebaseUser.email === 'admin@jmefit.com' ? 'admin' : 'user',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            
            try {
              await setDoc(userDocRef, userData);
              
              setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: userData.name,
                role: userData.role
              });
            } catch (err) {
              console.error('Error creating user document:', err);
              setCurrentUser(null);
              setError('Failed to create user profile');
            }
          } else {
            const userData = userDoc.data();
            
            // Update last login
            try {
              await setDoc(userDocRef, {
                ...userData,
                lastLogin: new Date().toISOString()
              }, { merge: true });

              setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: userData.name || firebaseUser.displayName,
                role: userData.role
              });
            } catch (err) {
              console.error('Error updating last login:', err);
              // Don't block the auth flow for this error
              setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: userData.name || firebaseUser.displayName,
                role: userData.role
              });
            }
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setCurrentUser(null);
        setError('Authentication error occurred');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: FirebaseAuthError): string => {
    console.error('Auth error:', error);
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/popup-closed-by-user':
        return 'Authentication window was closed. Please try again.';
      case 'auth/operation-not-allowed':
        return 'This login method is not enabled. Please contact support.';
      case 'auth/requires-recent-login':
        return 'Please log in again to continue.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify user document exists
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: userCredential.user.email,
            name: userCredential.user.displayName || email.split('@')[0],
            role: email === 'admin@jmefit.com' ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        } catch (err) {
          console.error('Error creating user document during login:', err);
          throw new Error('Failed to create user profile');
        }
      } else {
        // Update last login
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.error('Error updating last login:', err);
          // Don't block the login flow for this error
        }
      }
    } catch (err) {
      const error = err as FirebaseAuthError;
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      if (!email || !password || !name) {
        throw new Error('Please fill in all required fields');
      }

      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          name,
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error creating user document during signup:', err);
        // If we fail to create the user document, delete the auth user
        await userCredential.user.delete();
        throw new Error('Failed to create user profile');
      }
    } catch (err) {
      const error = err as FirebaseAuthError;
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out');
      throw new Error('Failed to log out');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, signUp, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};