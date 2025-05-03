import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  role: 'teacher' | 'parent' | 'student';
  name: string;
}

// Simulated user database
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'teacher@example.com',
    role: 'teacher',
    name: 'Demo Teacher'
  },
  {
    id: '2',
    email: 'parent@example.com',
    role: 'parent',
    name: 'Demo Parent'
  },
  {
    id: '3',
    email: 'student@example.com',
    role: 'student',
    name: 'Demo Student'
  }
];

export const signIn = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, you would verify the password here
  // For demo purposes, any password works
  
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const signUp = async (email: string, password: string, role: 'teacher' | 'parent' | 'student', name: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  if (DEMO_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: String(DEMO_USERS.length + 1),
    email,
    role,
    name
  };
  
  // In a real app, you would save this to a database
  DEMO_USERS.push(newUser);
  
  await AsyncStorage.setItem('user', JSON.stringify(newUser));
  return newUser;
};

export const signOut = async (): Promise<void> => {
  await AsyncStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userStr = await AsyncStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const resetPassword = async (email: string): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, you would send a password reset email
  console.log('Password reset requested for:', email);
}; 