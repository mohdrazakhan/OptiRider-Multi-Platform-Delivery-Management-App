import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- FIREBASE CONFIGURATION FROM ENVIRONMENT VARIABLES ---
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
// -----------------------------------------------------------

// Placeholder variables (simulating the Canvas environment variables)
const appId = firebaseConfig.projectId || 'default-app-id';
// NOTE: We cannot use __initial_auth_token in a local React Native build.
// We will rely purely on Anonymous Sign-In for simplicity in this MVP.

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- MOCK DATA & HELPERS ---
const platforms = [
  { id: 'swiggy', name: 'Swiggy', color: '#F16041' },
  { id: 'zomato', name: 'Zomato', color: '#E23744' },
  { id: 'uber', name: 'Uber Eats', color: '#000000' },
  { id: 'blinkit', name: 'Blinkit', color: '#00704A' },
];

const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    // Adjust to local time format for clarity
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// --- COMPONENTS ---

// 1. Dashboard (Control Tab)
const Dashboard = ({ riderData }) => {
    const [activeToggle, setActiveToggle] = useState('all'); // 'all', 'today', 'week', 'month'
    
    // Calculate Earnings Per Hour (EPH)
    const totalDurationHours = (riderData.totalDurationMinutes || 0) / 60;
    const eph = totalDurationHours > 0 
        ? (parseFloat(riderData.totalEarnings || 0) / totalDurationHours).toFixed(2)
        : '0.00';
    
    // Calculate average per trip
    const avgPerTrip = riderData.tripCount > 0 
        ? (parseFloat(riderData.totalEarnings || 0) / riderData.tripCount).toFixed(2)
        : '0.00';
    
    // Platform breakdown
    const platformData = riderData.platformBreakdown || {};
    const topPlatform = Object.keys(platformData).reduce((a, b) => 
        (platformData[a]?.earnings || 0) > (platformData[b]?.earnings || 0) ? a : b, 
        Object.keys(platformData)[0] || 'N/A'
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header Stats Summary */}
            <View style={styles.headerCard}>
                <Text style={styles.headerTitle}>Today's Performance</Text>
                <View style={styles.headerStats}>
                    <View style={styles.headerStat}>
                        <Text style={styles.headerStatValue}>₹{riderData?.totalEarnings || '0'}</Text>
                        <Text style={styles.headerStatLabel}>Total Earned</Text>
                    </View>
                    <View style={styles.headerDivider} />
                    <View style={styles.headerStat}>
                        <Text style={styles.headerStatValue}>{riderData?.tripCount || '0'}</Text>
                        <Text style={styles.headerStatLabel}>Trips</Text>
                    </View>
                    <View style={styles.headerDivider} />
                    <View style={styles.headerStat}>
                        <Text style={styles.headerStatValue}>₹{eph}</Text>
                        <Text style={styles.headerStatLabel}>Per Hour</Text>
                    </View>
                </View>
            </View>

            {/* Control Toggles */}
            <View style={styles.controlCard}>
                <View style={styles.controlHeader}>
                    <MaterialCommunityIcons name="shield-check" size={24} color="#4F46E5" />
                    <Text style={styles.controlTitle}>Platform Control</Text>
                </View>
                <Text style={styles.controlSubtitle}>Unified status management (Phase 2 feature preview)</Text>
                
                <View style={styles.toggleContainer}>
                    <TouchableOpacity 
                        style={[styles.toggleButton, styles.toggleOnline]} 
                        onPress={() => {
                            console.log('Mock: GO ONLINE ALL');
                            alert('Phase 2 Feature\n\nThis will automatically toggle you online across all platforms: Swiggy, Zomato, Uber Eats, and Blinkit.');
                        }}
                    >
                        <Feather name="power" size={20} color="#FFF" />
                        <Text style={styles.toggleText}>GO ONLINE ALL</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.toggleButton, styles.toggleOffline]} 
                        onPress={() => {
                            console.log('Mock: GO OFFLINE ALL');
                            alert('Phase 2 Feature\n\nThis will automatically toggle you offline across all platforms.');
                        }}
                    >
                        <Feather name="pause-circle" size={20} color="#FFF" />
                        <Text style={styles.toggleText}>GO OFFLINE ALL</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.platformStatusContainer}>
                    <Text style={styles.platformStatusTitle}>Platform Status</Text>
                    {platforms.map((platform) => (
                        <View key={platform.id} style={styles.platformStatusRow}>
                            <View style={[styles.platformDot, { backgroundColor: platform.color }]} />
                            <Text style={styles.platformStatusName}>{platform.name}</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusBadgeText}>Ready</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Key Metrics */}
            <View style={styles.metricsCard}>
                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="chart-line" size={20} color="#1F2937" /> Key Metrics
                </Text>
                
                <View style={[styles.metricBox, { backgroundColor: '#EEF2FF' }]}>
                    <View style={styles.metricIcon}>
                        <AntDesign name="wallet" size={24} color="#4F46E5" />
                    </View>
                    <View style={styles.metricContent}>
                        <Text style={styles.metricLabel}>Total Earnings</Text>
                        <Text style={styles.metricValue}>₹ {riderData?.totalEarnings || '0.00'}</Text>
                        <Text style={styles.metricSubtext}>From {riderData?.tripCount || 0} trips</Text>
                    </View>
                </View>

                <View style={[styles.metricBox, { backgroundColor: '#DCFCE7' }]}>
                    <View style={styles.metricIcon}>
                        <MaterialCommunityIcons name="speedometer" size={24} color="#16A34A" />
                    </View>
                    <View style={styles.metricContent}>
                        <Text style={styles.metricLabel}>Earnings Per Hour (EPH)</Text>
                        <Text style={[styles.metricValue, { color: '#16A34A' }]}>₹ {eph}</Text>
                        <Text style={styles.metricSubtext}>
                            {totalDurationHours > 0 ? `${totalDurationHours.toFixed(1)} hours worked` : 'No trips yet'}
                        </Text>
                    </View>
                </View>

                <View style={[styles.metricBox, { backgroundColor: '#FEF3C7' }]}>
                    <View style={styles.metricIcon}>
                        <AntDesign name="car" size={24} color="#F59E0B" />
                    </View>
                    <View style={styles.metricContent}>
                        <Text style={styles.metricLabel}>Average Per Trip</Text>
                        <Text style={[styles.metricValue, { color: '#F59E0B' }]}>₹ {avgPerTrip}</Text>
                        <Text style={styles.metricSubtext}>Across all platforms</Text>
                    </View>
                </View>
            </View>

            {/* Platform Breakdown */}
            <View style={styles.breakdownCard}>
                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="chart-pie" size={20} color="#1F2937" /> Platform Breakdown
                </Text>
                {platforms.map((platform) => {
                    const data = platformData[platform.name] || { earnings: 0, trips: 0 };
                    const percentage = riderData.totalEarnings > 0 
                        ? ((data.earnings / parseFloat(riderData.totalEarnings)) * 100).toFixed(1)
                        : '0';
                    
                    return (
                        <View key={platform.id} style={styles.platformRow}>
                            <View style={[styles.platformColorBar, { backgroundColor: platform.color }]} />
                            <View style={styles.platformInfo}>
                                <Text style={styles.platformName}>{platform.name}</Text>
                                <Text style={styles.platformStats}>
                                    {data.trips} trips • ₹{data.earnings.toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.platformPercentage}>
                                <Text style={[styles.percentageText, { color: platform.color }]}>
                                    {percentage}%
                                </Text>
                            </View>
                        </View>
                    );
                })}
                {Object.keys(platformData).length === 0 && (
                    <Text style={styles.emptyStateText}>
                        No platform data yet. Start logging trips in the Ledger tab!
                    </Text>
                )}
            </View>

            {/* Insights Card */}
            <View style={styles.insightsCard}>
                <Text style={styles.sectionTitle}>
                    <Feather name="trending-up" size={20} color="#1F2937" /> Smart Insights
                </Text>
                <View style={styles.insightItem}>
                    <View style={styles.insightIcon}>
                        <Feather name="award" size={18} color="#F59E0B" />
                    </View>
                    <Text style={styles.insightText}>
                        {topPlatform !== 'N/A' 
                            ? `${topPlatform} is your top earning platform`
                            : 'Start logging trips to see insights'}
                    </Text>
                </View>
                {eph > 200 && (
                    <View style={styles.insightItem}>
                        <View style={styles.insightIcon}>
                            <Feather name="zap" size={18} color="#16A34A" />
                        </View>
                        <Text style={styles.insightText}>
                            Great EPH! You're earning above ₹200/hour
                        </Text>
                    </View>
                )}
                {riderData.tripCount >= 10 && (
                    <View style={styles.insightItem}>
                        <View style={styles.insightIcon}>
                            <Feather name="target" size={18} color="#4F46E5" />
                        </View>
                        <Text style={styles.insightText}>
                            Milestone reached: {riderData.tripCount} trips completed!
                        </Text>
                    </View>
                )}
            </View>

            <Text style={styles.footerNote}>
                All data synced in real-time from your Ledger
            </Text>
        </ScrollView>
    );
};

// 2. Ledger (Data Entry Tab)
const Ledger = ({ db, userId, appId }) => {
    const [trip, setTrip] = useState({
        platform: platforms[0].name,
        earnings: '',
        durationMinutes: '',
    });
    const [status, setStatus] = useState('');
    const [recentTrips, setRecentTrips] = useState([]);

    // Data Fetch/Display Logic (Recent Trips)
    useEffect(() => {
        if (!db || !userId) return;

        const tripCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/trips`);
        // We use orderBy and limit to fetch the most recent data
        const tripQuery = query(tripCollectionRef, orderBy("timestamp", "desc"), limit(5));

        // Listen for real-time updates
        const unsubscribe = onSnapshot(tripQuery, (snapshot) => {
            const trips = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).map(t => ({
                ...t,
                // Ensure earnings is formatted correctly if coming from Firestore
                earnings: typeof t.earnings === 'number' ? t.earnings : parseFloat(t.earnings) || 0
            }));
            setRecentTrips(trips);
        }, (error) => {
            console.error("Error fetching recent trips:", error);
        });

        return () => unsubscribe(); // Cleanup listener
    }, [db, userId, appId]);

    const handleSubmit = async () => {
        if (!db || !userId) {
            setStatus('Error: User not authenticated.');
            return;
        }

        if (trip.earnings === '' || trip.durationMinutes === '') {
            setStatus('Error: Please fill all fields.');
            return;
        }
        
        const payload = {
            ...trip,
            earnings: parseFloat(trip.earnings),
            durationMinutes: parseInt(trip.durationMinutes, 10),
            timestamp: new Date().toISOString(),
            userId: userId,
        };

        try {
            const tripCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/trips`);
            await addDoc(tripCollectionRef, payload);
            setStatus('Trip logged successfully!');
            // Reset form
            setTrip({ platform: platforms[0].name, earnings: '', durationMinutes: '' });
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus(`Error logging trip: ${error.message}`);
        }
        // Clear status after 3 seconds
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Log a New Trip</Text>
                <Text style={styles.mockStatusText}>Manually enter trip data to build your earnings history.</Text>

                {/* Platform Select (using Picker in React Native is complex, using simple buttons for MVP) */}
                <Text style={styles.label}>Platform</Text>
                <View style={styles.platformSelector}>
                    {platforms.map(p => (
                        <TouchableOpacity
                            key={p.id}
                            style={[
                                styles.platformButton,
                                { backgroundColor: trip.platform === p.name ? p.color : '#E5E7EB' }
                            ]}
                            onPress={() => setTrip(prev => ({ ...prev, platform: p.name }))}
                        >
                            <Text style={[styles.platformButtonText, { color: trip.platform === p.name ? '#FFF' : '#4B5563' }]}>
                                {p.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Earnings Input */}
                <Text style={styles.label}>Earnings (₹)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="e.g., 120.50"
                    value={trip.earnings}
                    onChangeText={(value) => setTrip(prev => ({ ...prev, earnings: value }))}
                />

                {/* Duration Input */}
                <Text style={styles.label}>Duration (Minutes)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="e.g., 25"
                    value={trip.durationMinutes}
                    onChangeText={(value) => setTrip(prev => ({ ...prev, durationMinutes: value }))}
                />

                <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 20 }]} onPress={handleSubmit}>
                    <AntDesign name="plus" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Log Trip</Text>
                </TouchableOpacity>

                {status ? (
                    <Text style={[styles.statusText, { color: status.startsWith('Error') ? '#EF4444' : '#10B981' }]}>
                        {status}
                    </Text>
                ) : null}
            </View>

            <View style={[styles.card, { marginTop: 15 }]}>
                <Text style={styles.sectionTitle}>Recent Trips (Last 5)</Text>
                {recentTrips.length > 0 ? (
                    recentTrips.map((t) => (
                        <View key={t.id} style={styles.tripItem}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.tripItemPlatform}>{t.platform}</Text>
                                <Text style={styles.tripItemTime}>Logged at {formatTime(t.timestamp)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.tripItemEarnings}>₹ {t.earnings.toFixed(2)}</Text>
                                <Text style={styles.tripItemDuration}>{t.durationMinutes} min</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noteText}>No trips logged yet. Start logging!</Text>
                )}
            </View>
        </ScrollView>
    );
};

// 3. Integrations (Settings Tab)
const Integrations = ({ userId }) => {
    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
        } catch (e) {
            console.error('Logout failed', e);
            alert(`Logout failed: ${e?.message || 'Unknown error'}`);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
             <View style={styles.card}>
                <Text style={styles.sectionTitle}>Deep Control Integration (Android Only)</Text>
                <View style={styles.warningBox}>
                    <Feather name="alert-triangle" size={20} color="#D97706" style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.warningTitle}>Phase 2: Automation Setup</Text>
                        <Text style={styles.warningText}>OptiRider's automation will require **Accessibility Permission** to monitor and control linked apps.</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.disabledButton} disabled>
                    <Text style={styles.disabledButtonText}>Permission Access (Disabled in MVP)</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Rider ID</Text>
                <Text style={styles.riderIdText}>{userId || 'Authenticating...'}</Text>
            </View>
            <View style={[styles.card, { marginTop: 10 }]}> 
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.buttonPrimary, { backgroundColor: '#EF4444' }]}
                >
                    <Feather name="log-out" size={18} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// 4. Main App Container
const OptiRiderApp = () => {
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [riderData, setRiderData] = useState({});
    const [firebaseError, setFirebaseError] = useState(null);

    // Load Inter font for better mobile aesthetics
    const [fontsLoaded] = useFonts({
        Inter_900Black,
    });
    
    // 1. Firebase Initialization and Authentication
    useEffect(() => {
        let authInstance;
        try {
            // Check if essential config is present
            if (!firebaseConfig || !firebaseConfig.apiKey) {
                throw new Error("Firebase config is missing.");
            }
            
            const app = initializeApp(firebaseConfig);
            const dbInstance = getFirestore(app);
            
            // Try to get existing auth instance or initialize with persistence
            try {
                authInstance = getAuth(app);
            } catch {
                authInstance = initializeAuth(app, {
                    persistence: getReactNativePersistence(AsyncStorage)
                });
            }
            
            setDb(dbInstance);

            // Auth Listener
            const unsubscribeAuth = onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    console.log('User authenticated:', user.uid);
                    setUserId(user.uid);
                } else {
                    console.log('No user - showing auth screens');
                    setUserId(null);
                }
                setIsAuthReady(true);
            });

            return () => unsubscribeAuth();
        } catch (e) {
            console.error("Firebase setup error:", e);
            setFirebaseError(`Setup Failed. Check config. Error: ${e.message}`);
            setIsAuthReady(true); 
        }
    }, []);

    // 2. Data Listener (onSnapshot) - Aggregating Trip Data for Dashboard
    useEffect(() => {
        if (db && userId && !firebaseError) {
            const tripCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/trips`);
            const unsubscribeData = onSnapshot(tripCollectionRef, (snapshot) => {
                let totalEarnings = 0;
                let totalDurationMinutes = 0;
                let tripCount = 0;
                const platformBreakdown = {};
                
                snapshot.forEach((doc) => {
                    const trip = doc.data();
                    const earnings = trip.earnings || 0;
                    const duration = trip.durationMinutes || 0;
                    const platform = trip.platform || 'Unknown';
                    
                    totalEarnings += earnings;
                    totalDurationMinutes += duration;
                    tripCount += 1;
                    
                    // Platform breakdown
                    if (!platformBreakdown[platform]) {
                        platformBreakdown[platform] = { earnings: 0, trips: 0, duration: 0 };
                    }
                    platformBreakdown[platform].earnings += earnings;
                    platformBreakdown[platform].trips += 1;
                    platformBreakdown[platform].duration += duration;
                });

                setRiderData({
                    totalEarnings: totalEarnings.toFixed(2),
                    totalDurationMinutes: totalDurationMinutes,
                    tripCount: tripCount,
                    platformBreakdown: platformBreakdown,
                });
            }, (error) => {
                console.error("Firestore trip snapshot error:", error);
            });

            return () => unsubscribeData();
        }
    }, [db, userId, firebaseError]); 

    // Debug rerender on auth changes (must be declared before any early returns)
    useEffect(() => {
        console.log('Auth state updated - isAuthReady:', isAuthReady, 'userId:', userId);
    }, [isAuthReady, userId]);

    // Don't block on fonts; show UI as soon as auth is ready
    if (!isAuthReady) {
        return (
             <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading OptiRider...</Text>
            </View>
        );
    }
    // Non-blocking error: we'll render the app UI and surface auth issues within screens instead
    // console.warn('OptiRider auth warning:', firebaseError);
    return (
        <NavigationContainer independent={true} key={userId ? 'app' : 'auth'}>
            {userId ? (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerStyle: styles.header,
                    headerTitleStyle: styles.headerTitle,
                    tabBarActiveTintColor: '#4F46E5', // Indigo-600
                    tabBarInactiveTintColor: '#6B7280', // Gray-500
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabBarLabel,
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Control') {
                            iconName = 'zap';
                            return <Feather name={iconName} size={size} color={color} />;
                        } else if (route.name === 'Ledger') {
                            iconName = 'book';
                            return <Feather name={iconName} size={size} color={color} />;
                        } else if (route.name === 'Optimization') {
                            iconName = 'navigation';
                            return <Feather name={iconName} size={size} color={color} />;
                        } else if (route.name === 'Integrations') {
                            iconName = 'settings';
                            return <Feather name={iconName} size={size} color={color} />;
                        }
                    },
                })}
            >
                <Tab.Screen name="Control" options={{ title: 'Control' }}>
                    {() => <Dashboard riderData={riderData} />}
                </Tab.Screen>
                <Tab.Screen name="Ledger" options={{ title: 'Ledger' }}>
                    {() => <Ledger db={db} userId={userId} appId={appId} />}
                </Tab.Screen>
                <Tab.Screen name="Optimization" options={{ title: 'Route' }}>
                    {() => <View style={styles.emptyScreen}><Text style={styles.emptyScreenText}>Optimization (Phase 3)</Text></View>}
                </Tab.Screen>
                <Tab.Screen name="Integrations" options={{ title: 'Settings' }}>
                    {() => <Integrations userId={userId} />}
                </Tab.Screen>
            </Tab.Navigator>
            ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" getComponent={() => require('./screens/WelcomeScreen').default} />
                <Stack.Screen name="Login" getComponent={() => require('./screens/LoginScreen').default} />
                <Stack.Screen name="SignUp" getComponent={() => require('./screens/SignUpScreen').default} />
            </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

// --- STYLESHEET (React Native) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Gray-50
    },
    contentContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    loadingText: {
        fontSize: 18,
        color: '#6B7280',
    },
    header: {
        backgroundColor: '#4F46E5', // Indigo-600
        height: 60,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Inter_900Black',
    },
    tabBar: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 5,
        height: Platform.OS === 'ios' ? 90 : 60, // Account for notch on iOS
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFF',
        padding: 20,
        marginHorizontal: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937', // Gray-800
        marginBottom: 8,
    },
    mockStatusText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Data Card Styles
    dataCard: {
        paddingVertical: 15,
    },
    metricBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    metricLabel: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 2,
    },
    noteText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 10,
    },
    // Ledger Styles
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#FFF',
    },
    platformSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    platformButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        width: '48%', 
        marginBottom: 8,
        alignItems: 'center',
    },
    platformButtonText: {
        fontWeight: 'bold',
    },
    statusText: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    tripItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tripItemPlatform: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    tripItemTime: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    tripItemEarnings: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    tripItemDuration: {
        fontSize: 13,
        color: '#4B5563',
    },
    // Integrations/Settings Styles
    warningBox: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FEF3C7', // Yellow-100
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B', // Yellow-600
        marginBottom: 15,
    },
    warningTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400E', // Amber-800
    },
    warningText: {
        fontSize: 12,
        color: '#92400E',
        marginTop: 4,
    },
    disabledButton: {
        backgroundColor: '#D1D5DB', // Gray-300
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButtonText: {
        color: '#6B7280',
        fontWeight: 'bold',
    },
    riderIdText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 10,
        backgroundColor: '#F3F4F6',
        padding: 8,
        borderRadius: 6,
        overflow: 'hidden',
    },
    emptyScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyScreenText: {
        fontSize: 16,
        color: '#6B7280',
    },
    // Enhanced Dashboard Styles
    headerCard: {
        backgroundColor: '#4F46E5',
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        opacity: 0.9,
    },
    headerStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerStat: {
        flex: 1,
        alignItems: 'center',
    },
    headerStatValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    headerStatLabel: {
        color: '#FFF',
        fontSize: 11,
        opacity: 0.8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    headerDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#FFF',
        opacity: 0.2,
    },
    controlCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 10,
        marginBottom: 15,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    controlHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    controlTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    controlSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    toggleOnline: {
        backgroundColor: '#10B981',
    },
    toggleOffline: {
        backgroundColor: '#EF4444',
    },
    toggleText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 8,
    },
    platformStatusContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    platformStatusTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
    },
    platformStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    platformDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    platformStatusName: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    statusBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: '#16A34A',
        fontSize: 11,
        fontWeight: '600',
    },
    metricsCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 10,
        marginBottom: 15,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    metricBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    metricIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    metricContent: {
        flex: 1,
    },
    metricLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 2,
    },
    metricSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    breakdownCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 10,
        marginBottom: 15,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    platformRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    platformColorBar: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 12,
    },
    platformInfo: {
        flex: 1,
    },
    platformName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    platformStats: {
        fontSize: 12,
        color: '#6B7280',
    },
    platformPercentage: {
        alignItems: 'flex-end',
    },
    percentageText: {
        fontSize: 18,
        fontWeight: '700',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingVertical: 20,
        fontStyle: 'italic',
    },
    insightsCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 10,
        marginBottom: 15,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        marginBottom: 10,
    },
    insightIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    insightText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    footerNote: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        marginVertical: 16,
        fontStyle: 'italic',
    },
});

export default OptiRiderApp;
