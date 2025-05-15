// src/context/AuthContext.tsx
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { UserProfile } from "@/types"; // Assuming UserProfile type will be defined

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Fetch user profile from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          // const userDocSnap = await getDoc(userDocRef);
          // if (userDocSnap.exists()) {
          //   setUserProfile(userDocSnap.data() as UserProfile);
          // } else {
          //   // Potentially create a user profile document here if it doesn't exist
          //   // For now, setting it to null or a default structure
          //   setUserProfile(null);
          // }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
