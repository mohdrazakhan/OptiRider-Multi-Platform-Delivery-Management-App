import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.brand}>OPTI-RIDER</Text>
      </View>
      <View style={{ height: 24 }} />
      <Text style={styles.tagline}>Gain total control of your Ride</Text>
      <Text style={styles.sub}>One App Solution for Your All Rides</Text>

      <View style={{ height: 40 }} />

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('SignUp' as never)}>
        <Text style={styles.primaryBtnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login' as never)}>
        <Text style={styles.secondaryBtnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const PURPLE = '#7C3AED';
const ORANGE = '#FDBF00';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  logo: { width: 140, height: 140, resizeMode: 'contain' },
  brand: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  tagline: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  sub: { fontSize: 12, textAlign: 'center', opacity: 0.8, marginTop: 6 },
  primaryBtn: {
    width: '100%',
    backgroundColor: PURPLE,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFF', fontWeight: '700' },
  secondaryBtn: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryBtnText: { color: '#111827', fontWeight: '700' },
});
