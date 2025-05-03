import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signIn } from './utils/auth';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { role } = useLocalSearchParams(); // ✅ get role from params

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await signIn(email.trim(), password);
      router.replace({ pathname: '/(tabs)/home' });
    } catch (error: any) {
      setError(error.message || 'An error occurred during login.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Log in",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f4f4f9' },
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
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A0A0A0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          editable={!loading}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#A0A0A0"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push({ pathname: 'forgot-password' } as any)}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push({ pathname: 'signup' } as any)}>
          <Text style={styles.signUpLink}>
            Don't have an account? <Text style={styles.signUpText}>Sign up</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <View style={styles.socialButtonContent}>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
          <View style={styles.socialButtonContent}>
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f9' },
  content: { flex: 1, padding: 20, paddingTop: 40 },
  input: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontSize: 16,
  },
  passwordContainer: { position: 'relative', marginBottom: 16 },
  eyeIcon: { position: 'absolute', right: 16, top: 16 },
  loginButton: {
    backgroundColor: '#7B68EE',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  forgotPassword: {
    color: '#7B68EE',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  signUpLink: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#000000',
  },
  signUpText: { color: '#7B68EE', fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#E8E8E8' },
  orText: { color: '#A0A0A0', paddingHorizontal: 16, fontSize: 14 },
  socialButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  socialButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  socialButtonText: { color: '#000000', fontSize: 16, fontWeight: '500' },
  appleButton: { backgroundColor: '#000000', borderColor: '#000000' },
  appleButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '500' },
  backButton: {
    marginLeft: 16,
    padding: 8,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
