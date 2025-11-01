import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Optional: Update profile with name in future
    } catch (e: any) {
      setError(e?.message ?? 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.primaryBtn} onPress={onSignUp} disabled={loading}>
        <Text style={styles.primaryBtnText}>{loading ? 'Please wait…' : 'Create Account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Login' as never)}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const PURPLE = '#7C3AED';
const ORANGE = '#FDBF00';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORANGE, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  input: { backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 },
  primaryBtn: { backgroundColor: PURPLE, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#FFF', fontWeight: '700' },
  linkBtn: { alignItems: 'center', marginTop: 12 },
  link: { color: '#111827', fontWeight: '600' },
  error: { color: '#EF4444', marginBottom: 6, textAlign: 'center' }
});
