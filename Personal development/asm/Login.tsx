import { Alert, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useDispatch } from 'react-redux';
import { setUserId, setUsername, setEmail1, setImage } from './redux/userSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleLogin = async () => {
        const auth = getAuth(app);
        const db = getFirestore(app);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            const q = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            let userId = null;
            let username = null;
            let email1 = null;
            let image=null;
            querySnapshot.forEach((doc) => {
                userId = doc.id;
                username = doc.data().name;
                email1 = doc.data().email;
                image=doc.data().image;
                dispatch(setUserId(userId));
                dispatch(setUsername(username));
                dispatch(setEmail1(email1));
                dispatch(setImage(image))
            });

            if (userId) {
                Alert.alert('Login Successful');
                console.log('User ID:', userId);
                navigation.navigate('Home');
            } else {
                Alert.alert('User not found');
            }

        } catch (error) {
            Alert.alert('Login Failed', error.message);
        }
    };

    const DangKy = () => {
        navigation.navigate('Register');
    };

    const resetFields = () => {
        setEmail('');
        setPass('');
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFFFFF' />
            <Image source={require('./image/anh.png')} style={styles.logo} resizeMode='contain' />
            <Text style={styles.welcomeText}>Personal development </Text>
            <Text style={styles.subtitle}>Login to Continue</Text>
            <TextInput
                value={email}
                placeholder='Email Address'
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor='#888888'
                keyboardType='email-address'
                autoCapitalize='none'
            />
            <TextInput
                value={pass}
                style={styles.input}
                placeholder='Password'
                onChangeText={setPass}
                placeholderTextColor='#888888'
                secureTextEntry
            />
            <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Sign In</Text>
            </Pressable>
            <Pressable style={styles.googleButton}>
                <Image style={styles.googleIcon} source={require('./image/gogole.png')} resizeMode='contain' />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </Pressable>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don’t have an account? </Text>
                <Pressable onPress={DangKy}>
                    <Text style={styles.footerLink}>Register</Text>
                </Pressable>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Forgot Password? </Text>
                <Pressable>
                    <Text onPress={resetFields} style={styles.footerLink}>Reset</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1877F2',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        color: '#606770',
        marginBottom: 30
    },
    input: {
        padding: 15,
        borderColor: '#DDDDDD',
        borderWidth: 1.5,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: '#F5F5F5',
        width: '100%',
        marginBottom: 15
    },
    loginButton: {
        backgroundColor: '#1877F2',
        width: '100%',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#DDDDDD',
        borderWidth: 1.5,
        borderRadius: 5,
        width: '100%',
        height: 50,
        paddingLeft: 15,
        marginBottom: 30
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10
    },
    googleButtonText: {
        fontSize: 16,
        color: '#333333'
    },
    footer: {
        flexDirection: 'row',
        marginTop: 10
    },
    footerText: {
        fontSize: 14,
        color: '#606770'
    },
    footerLink: {
        fontSize: 14,
        color: '#1877F2',
        fontWeight: 'bold'
    }
});
