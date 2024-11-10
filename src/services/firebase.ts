import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  DocumentData,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

interface Content {
  id: string;
  title: string;
  content: string;
  type: string;
  category: string;
  status: 'draft' | 'published';
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Media {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}

export const FirestoreService = {
  // User Operations
  async createUser(userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userData.id!);
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  },

  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return { id: userDoc.id, ...userDoc.data() } as User;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now()
    });
  },

  // Content Operations
  async createContent(contentData: Partial<Content>): Promise<string> {
    const contentRef = doc(collection(db, 'content'));
    await setDoc(contentRef, {
      ...contentData,
      id: contentRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return contentRef.id;
  },

  async getContent(contentId: string): Promise<Content | null> {
    const contentDoc = await getDoc(doc(db, 'content', contentId));
    if (!contentDoc.exists()) return null;
    return { id: contentDoc.id, ...contentDoc.data() } as Content;
  },

  async getAllContent(filters: {
    category?: string;
    type?: string;
    status?: 'draft' | 'published';
    authorId?: string;
    limit?: number;
  } = {}): Promise<Content[]> {
    const constraints: QueryConstraint[] = [];
    
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.authorId) {
      constraints.push(where('authorId', '==', filters.authorId));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = query(collection(db, 'content'), ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Content));
  },

  async updateContent(contentId: string, contentData: Partial<Content>): Promise<void> {
    const contentRef = doc(db, 'content', contentId);
    await updateDoc(contentRef, {
      ...contentData,
      updatedAt: Timestamp.now()
    });
  },

  async deleteContent(contentId: string): Promise<void> {
    await deleteDoc(doc(db, 'content', contentId));
  },

  // Media Operations
  async createMedia(mediaData: Partial<Media>): Promise<string> {
    const mediaRef = doc(collection(db, 'media'));
    await setDoc(mediaRef, {
      ...mediaData,
      id: mediaRef.id,
      createdAt: Timestamp.now()
    });
    return mediaRef.id;
  },

  async getMedia(mediaId: string): Promise<Media | null> {
    const mediaDoc = await getDoc(doc(db, 'media', mediaId));
    if (!mediaDoc.exists()) return null;
    return { id: mediaDoc.id, ...mediaDoc.data() } as Media;
  },

  async deleteMedia(mediaId: string): Promise<void> {
    await deleteDoc(doc(db, 'media', mediaId));
  }
};