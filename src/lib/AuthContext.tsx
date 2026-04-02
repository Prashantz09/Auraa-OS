import React, { createContext, useContext, useState, useEffect } from "react";
import { User, getUserById, setUserWithId } from "./db";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    login: (userId: string, password?: string) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => false,
    logout: () => { },
    refreshUser: async () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

    const refreshUser = async () => {
        if (!firebaseUid) return;
        const dbUser = await getUserById(firebaseUid);
        if (dbUser) setUser(dbUser);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setFirebaseUid(firebaseUser.uid);
                const dbUser = await getUserById(firebaseUser.uid);
                if (dbUser) {
                    setUser(dbUser);
                } else {
                    setUser(null);
                }
            } else {
                setFirebaseUid(null);
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (userId: string, password?: string) => {
        if (!password) return false;
        try {
            // Auraa uses `userId` (e.g. admin, editor). We convert it to a standard email domain for Firebase Auth
            const email = userId.includes('@') ? userId : `${userId}@auraa.control`;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            let dbUser = await getUserById(userCredential.user.uid);

            // If the user exists in Firebase Auth but is missing from Firestore, auto-provision their document!
            if (!dbUser && userId === "admin") {
                dbUser = await setUserWithId(userCredential.user.uid, {
                    name: "System Admin",
                    userId: "admin",
                    role: "admin",
                    avatar: "https://ui-avatars.com/api/?name=System+Admin&background=random"
                });
            }

            if (dbUser) {
                setUser(dbUser);
                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Login failed:", error);

            // Auto-setup admin account directly if this is the first time firing it up (Not in Auth at all)
            if (userId === "admin" && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
                try {
                    const email = `${userId}@auraa.control`;
                    const cred = await createUserWithEmailAndPassword(auth, email, password);
                    const newAdmin = await setUserWithId(cred.user.uid, {
                        name: "System Admin",
                        userId: "admin",
                        role: "admin",
                        avatar: "https://ui-avatars.com/api/?name=System+Admin&background=random"
                    });
                    setUser(newAdmin);
                    return true;
                } catch (seedError) {
                    console.error("Auto setup failed:", seedError);
                }
            }

            return false;
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
