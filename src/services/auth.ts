import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirestoreService } from './firebase';

interface AuthError {
  code: string;
  message: string;
}

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await FirestoreService.getUser(userCredential.user.uid);
      
      if (!user) {
        // Create user document if it doesn't exist
        await FirestoreService.createUser({
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          name: userCredential.user.displayName || email.split('@')[0],
          role: email === 'admin@jmefit.com' ? 'admin' : 'user'
        });
      }
      
      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user document
      await FirestoreService.createUser({
        id: userCredential.user.uid,
        email,
        name,
        role: 'user'
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  },

  handleAuthError(error: AuthError) {
    let message = 'An error occurred during authentication.';
    
    switch (error.code) {
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account already exists with this email.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
    }

    return new Error(message);
  }
};