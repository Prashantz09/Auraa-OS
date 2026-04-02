

export type Role = 'admin' | 'manager' | 'editor';

export interface User {
  id: string;
  name: string;
  userId: string;
  password?: string; // Omit sending to frontend sometimes, but needed for login checks
  role: Role;
  avatar: string;
  createdAt: number;
}

export interface Client {
  id: string;
  clientName: string;
  services: string[];
  email?: string;
  phone?: string;
  createdAt: number;
}

export type ServiceType =
  | 'YouTube Video'
  | 'Reels'
  | 'Graphics'
  | 'Thumbnail'
  | 'Podcast'
  | 'Trailer Only';

export type ProjectStatus = 'Working' | 'Completed';

export interface Project {
  id: string;
  projectName: string;
  clientId: string;
  serviceType: ServiceType;
  assignedEditorId: string | null;
  projectDate: number;
  status: ProjectStatus;
  deadline?: number;
  budget?: number;
  progress?: number;
  createdBy: string; // User ID
  createdDate: number;
}

export interface Notification {
  id: string;
  message: string;
  createdBy: string | 'system';
  createdAt: number;
  readStatus: boolean;
}

export type NoticeType = 'Update' | 'Holiday' | 'Project' | 'Client';

export interface Notice {
  id: string;
  title: string;
  message: string;
  type: NoticeType;
  createdAt: number;
  createdBy: string;
}

export type ActivityType = 'ClientAdded' | 'ProjectCreated' | 'DeadlineUpdated' | 'ProjectCompleted' | 'General';

export interface Activity {
  id: string;
  description: string;
  type: ActivityType;
  createdAt: number;
  createdBy: string;
}

import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from './firebase';

export const initializeDB = async () => {
  // Initialization of Auth users is handled directly in AuthContext or setup scripts.
  // We don't auto-seed here because Firebase Auth requires specific API calls.
};

const getCollectionData = async <T>(collName: string, orderField?: string): Promise<T[]> => {
  try {
    let q: any = collection(db, collName);
    if (orderField) {
      q = query(q, orderBy(orderField, 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as unknown as T));
  } catch (err) {
    console.error(`Error fetching collection ${collName}:`, err);
    return [];
  }
};

// --- Users ---
export const getUsers = async (): Promise<User[]> => getCollectionData<User>('users', 'createdAt');

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const snap = await getDoc(doc(db, 'users', id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as User) : undefined;
  } catch (err) {
    console.error("Error fetching user:", err);
    return undefined;
  }
};

export const addUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const email = user.userId.includes('@') ? user.userId : `${user.userId}@auraa.control`;

  // 1. Initialize a secondary Firebase app to create the user without logging out the current Admin
  const secondaryApp = initializeApp(firebaseConfig, "SecondaryAppForCreation" + Date.now());
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, user.password || "password");
    await signOut(secondaryAuth); // Sign out the newly created user from the secondary app instance

    // 2. Create the document in the primary firestore
    const userDoc = { ...(user as any), createdAt: Date.now() };
    await setDoc(doc(db, 'users', cred.user.uid), userDoc);

    return { id: cred.user.uid, ...userDoc } as User;
  } catch (error) {
    console.error("Failed to create user in Firebase Auth:", error);
    throw error;
  }
};

// If we need to set a user with a specific ID (like Firebase Auth UID)
export const setUserWithId = async (id: string, user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const userDoc = { ...(user as any), createdAt: Date.now() };
  await setDoc(doc(db, 'users', id), userDoc);
  return { id, ...userDoc } as User;
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
  await updateDoc(doc(db, 'users', id), updates);
};

export const deleteUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', id));
};

// --- Clients ---
export const getClients = async (): Promise<Client[]> => getCollectionData<Client>('clients', 'createdAt');

export const getClient = async (id: string): Promise<Client | undefined> => {
  try {
    const snap = await getDoc(doc(db, 'clients', id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Client) : undefined;
  } catch (err) {
    console.error("Error fetching client:", err);
    return undefined;
  }
};

export const addClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
  const docData = { ...(client as any), createdAt: Date.now() };
  const docRef = await addDoc(collection(db, 'clients'), docData);
  return { id: docRef.id, ...docData } as Client;
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
  await updateDoc(doc(db, 'clients', id), updates);
};

export const deleteClient = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'clients', id));
};

// --- Projects ---
export const getProjects = async (): Promise<Project[]> => getCollectionData<Project>('projects', 'projectDate');

export const addProject = async (project: Omit<Project, 'id' | 'createdDate'>): Promise<Project> => {
  const docData = { ...(project as any), createdDate: Date.now() };
  const docRef = await addDoc(collection(db, 'projects'), docData);
  await addNotification(`New project "${project.projectName}" added!`, project.createdBy);
  return { id: docRef.id, ...docData } as Project;
};

export const updateProject = async (id: string, updates: Partial<Project>, updaterId?: string): Promise<void> => {
  await updateDoc(doc(db, 'projects', id), updates);
  if (updaterId && updates.projectName) {
    await addNotification(`Project "${updates.projectName}" was updated.`, updaterId);
  } else if (updaterId) {
    await addNotification(`A project was updated.`, updaterId);
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'projects', id));
};

// --- Notifications ---
export const getNotifications = async (): Promise<Notification[]> => getCollectionData<Notification>('notifications', 'createdAt');

export const addNotification = async (message: string, createdBy: string = 'system'): Promise<Notification> => {
  const docData = { message, createdBy, createdAt: Date.now(), readStatus: false };
  const docRef = await addDoc(collection(db, 'notifications'), docData);
  return { id: docRef.id, ...docData } as Notification;
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', id), { readStatus: true });
};

export const markAllNotificationsRead = async (): Promise<void> => {
  const notifs = await getNotifications();
  const unread = notifs.filter(n => !n.readStatus);
  const promises = unread.map(n => updateDoc(doc(db, 'notifications', n.id), { readStatus: true }));
  await Promise.all(promises);
};

// --- Notices (Admin Notice Board) ---
export const getNotices = async (): Promise<Notice[]> => getCollectionData<Notice>('notices', 'createdAt');

export const addNotice = async (notice: Omit<Notice, 'id' | 'createdAt'>): Promise<Notice> => {
  const docData = { ...(notice as any), createdAt: Date.now() };
  const docRef = await addDoc(collection(db, 'notices'), docData);
  return { id: docRef.id, ...docData } as Notice;
};

export const deleteNotice = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'notices', id));
};

// --- Activities (Recent Activity Feed) ---
export const getActivities = async (): Promise<Activity[]> => getCollectionData<Activity>('activities', 'createdAt');

export const addActivity = async (description: string, type: ActivityType, createdBy: string = 'system'): Promise<Activity> => {
  const docData = { description, type, createdBy, createdAt: Date.now() };
  const docRef = await addDoc(collection(db, 'activities'), docData);
  return { id: docRef.id, ...docData } as Activity;
};

// --- Kudos & Shoutouts ---
export interface Kudos {
  id: string;
  text: string;
  fromUser: string;
  toUser?: string;
  themeColor: string; // e.g., 'bg-yellow-200' 
  createdAt: number;
}

import { onSnapshot, limit, where } from 'firebase/firestore';

export const addKudos = async (kudosData: Omit<Kudos, 'id' | 'createdAt'>): Promise<void> => {
  await addDoc(collection(db, 'kudos'), {
    ...kudosData,
    createdAt: Date.now(),
  });

  // Check for @mentions in the text
  const mentionRegex = /@([a-zA-Z0-9_\-]+)/g;
  const match = mentionRegex.exec(kudosData.text);

  if (match && match[1]) {
    // We send a system notification indicating the tag
    await addNotification(`You were mentioned in a Kudos by ${kudosData.fromUser}!`, 'system');
  } else if (kudosData.toUser) {
    // If not using @ but has targeted user
    await addNotification(`${kudosData.fromUser} gave a Kudos shoutout to ${kudosData.toUser}!`, 'system');
  }
};

export const onKudos = (callback: (kudosList: Kudos[]) => void): (() => void) => {
  const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000); // 5 days in ms
  const q = query(
    collection(db, 'kudos'),
    where('createdAt', '>=', fiveDaysAgo),
    orderBy('createdAt', 'desc'), // show newest first
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Kudos));
    callback(list);
  });
};

