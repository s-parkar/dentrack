'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'Doctor' | 'Receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  loginAs: (role: UserRole) => void;
  signup: (data: { name: string; email: string; password: string; role: UserRole }) => { success: boolean; error?: string };
  logout: () => void;
  hasAccess: (pathname: string) => boolean;
}

const DEFAULT_USERS: (User & { password?: string })[] = [
  {
    id: 'usr-doctor-1',
    name: 'Dr. Sarah Jenkins',
    email: 'doctor@dentrack.com',
    password: 'doctor123',
    role: 'Doctor',
    title: 'Lead Dentist & Surgeon',
  },
  {
    id: 'usr-doctor-2',
    name: 'Dr. Sneha Rao',
    email: 'sneha@dentrack.com',
    password: 'doctor123',
    role: 'Doctor',
    title: 'Senior Dentist & Endodontist',
  },
  {
    id: 'usr-doctor-3',
    name: 'Dr. Karan Malhotra',
    email: 'karan@dentrack.com',
    password: 'doctor123',
    role: 'Doctor',
    title: 'Orthodontic Specialist',
  },
  {
    id: 'usr-doctor-4',
    name: 'Dr. Meera Pillai',
    email: 'meera@dentrack.com',
    password: 'doctor123',
    role: 'Doctor',
    title: 'Pediatric & Cosmetic Dentist',
  },
  {
    id: 'usr-reception-1',
    name: 'Alex Rivers',
    email: 'receptionist@dentrack.com',
    password: 'reception123',
    role: 'Receptionist',
    title: 'Front Desk & Coordinator',
  },
];

const RECEPTIONIST_ALLOWED_PATHS = ['/', '/scheduler', '/lab-work', '/inventory', '/recalls'];

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_USER_KEY = 'dentrack_current_user_v1';
const STORAGE_USERS_LIST_KEY = 'dentrack_custom_users_v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState<(User & { password?: string })[]>(DEFAULT_USERS);
  const router = useRouter();

  useEffect(() => {
    // Load users list from public/users.json if available, plus localStorage
    async function loadUsers() {
      let baseUsers = DEFAULT_USERS;
      try {
        const backendBase = process.env.NEXT_PUBLIC_API_URL || '';
        const targetUrl = backendBase ? `${backendBase.replace(/\/$/, '')}/api/users` : '/api/users';
        const res = await fetch(targetUrl);
        if (res.ok) {
          const jsonUsers = await res.json();
          if (Array.isArray(jsonUsers) && jsonUsers.length > 0) {
            baseUsers = jsonUsers;
          }
        }
      } catch {
        /* fallback to default users */
      }

      try {
        const customUsersRaw = localStorage.getItem(STORAGE_USERS_LIST_KEY);
        if (customUsersRaw) {
          const customUsers = JSON.parse(customUsersRaw);
          setUsersList([...baseUsers, ...customUsers]);
        } else {
          setUsersList(baseUsers);
        }
      } catch {
        setUsersList(baseUsers);
      }

      // Restore session
      try {
        const savedUserRaw = localStorage.getItem(STORAGE_USER_KEY);
        if (savedUserRaw) {
          setUser(JSON.parse(savedUserRaw));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  const login = (email: string, pass: string) => {
    const found = usersList.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!found) {
      return { success: false, error: 'User with this email was not found.' };
    }

    if (found.password && found.password !== pass) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    const cleanUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      title: found.title || (found.role === 'Doctor' ? 'Dental Specialist' : 'Receptionist'),
    };

    setUser(cleanUser);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(cleanUser));
    } catch {
      /* ignore */
    }

    return { success: true };
  };

  const loginAs = (role: UserRole) => {
    const target = usersList.find((u) => u.role === role) || DEFAULT_USERS.find((u) => u.role === role);
    if (target) {
      const cleanUser: User = {
        id: target.id,
        name: target.name,
        email: target.email,
        role: target.role,
        title: target.title || (target.role === 'Doctor' ? 'Dental Specialist' : 'Receptionist'),
      };
      setUser(cleanUser);
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(cleanUser));
      } catch {
        /* ignore */
      }
      router.push('/');
    }
  };

  const signup = (data: { name: string; email: string; password: string; role: UserRole }) => {
    const existing = usersList.find(
      (u) => u.email.toLowerCase().trim() === data.email.toLowerCase().trim()
    );
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User & { password?: string } = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      title: data.role === 'Doctor' ? 'Dental Specialist' : 'Front Desk Coordinator',
    };

    const updatedList = [...usersList, newUser];
    setUsersList(updatedList);

    try {
      const customUsersRaw = localStorage.getItem(STORAGE_USERS_LIST_KEY);
      const customUsers = customUsersRaw ? JSON.parse(customUsersRaw) : [];
      customUsers.push(newUser);
      localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(customUsers));
    } catch {
      /* ignore */
    }

    const cleanUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      title: newUser.title,
    };

    setUser(cleanUser);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(cleanUser));
    } catch {
      /* ignore */
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      /* ignore */
    }
    router.push('/login');
  };

  const hasAccess = (pathname: string): boolean => {
    if (!user) return false;
    if (user.role === 'Doctor') return true;
    // Receptionist check
    return RECEPTIONIST_ALLOWED_PATHS.includes(pathname);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAs,
        signup,
        logout,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
