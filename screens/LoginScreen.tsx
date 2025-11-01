import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.primaryBtn} onPress={onLogin} disabled={loading}>
        <Text style={styles.primaryBtnText}>{loading ? 'Please wait…' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('SignUp' as never)}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
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
