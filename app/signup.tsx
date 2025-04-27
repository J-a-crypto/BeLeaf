import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Image, Modal, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from './configuration';

const firestore = getFirestore();

const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
const roles = ['Teacher', 'Parent', 'Student'];

const SignUpScreen = () => {
  const [title, setTitle] = useState('Ms.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Teacher');
  const [loading, setLoading] = useState(false);
  
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  const router = useRouter();

  const handleSignUp = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      console.error('Please enter your full name');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      // Use a Firestore-safe document ID
      const safeEmail = email.trim().replace(/[.@]/g, '_');
      await setDoc(
        doc(firestore, 'users', safeEmail),
        {
          title,
          firstName,
          lastName,
          email: email.trim(),
          role,
          createdAt: new Date().toISOString(),
        }
      );

      router.replace({ pathname: 'land' } as any);
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign up.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (items: string[], selectedValue: string, onSelect: (value: string) => void, onClose: () => void) => (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <ScrollView>
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.dropdownItem,
                  selectedValue === item && styles.selectedItem
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedValue === item && styles.selectedItemText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Sign up",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#7B68EE" />
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
      <View style={styles.content}>
        <Image
          source={require('./assets/teacher.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Create Account</Text>
        
        <TouchableOpacity onPress={() => router.push({ pathname: 'login' } as any)}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.loginText}>Log in</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowTitleDropdown(true)}
        >
          <Text>{title}</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="#A0A0A0"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor="#A0A0A0"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A0A0A0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowRoleDropdown(true)}
        >
          <Text>{role}</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By signing up, you agree to BeLeaf's{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

        <TouchableOpacity 
          style={[styles.signUpButton, loading && styles.signUpButtonDisabled]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>

        {showTitleDropdown && renderDropdown(titles, title, setTitle, () => setShowTitleDropdown(false))}
        {showRoleDropdown && renderDropdown(roles, role, setRole, () => setShowRoleDropdown(false))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mascot: {
    width: 60,
    height: 60,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  loginLink: {
    fontSize: 14,
    color: '#000',
    marginBottom: 24,
  },
  loginText: {
    color: '#7B68EE',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    width: '100%',
  },
  placeholderText: {
    color: '#A0A0A0',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  link: {
    color: '#7B68EE',
  },
  signUpButton: {
    backgroundColor: '#7B68EE',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#7B68EE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    padding: 20,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  selectedItemText: {
    color: '#7B68EE',
    fontWeight: '600',
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default SignUpScreen; 