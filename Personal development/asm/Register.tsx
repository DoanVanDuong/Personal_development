import { Alert, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const Register = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [image, setImage] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !rePassword || !image) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== rePassword) {
            Alert.alert('Error', 'Passwords do not match!');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await addDoc(collection(db, 'users'), {
                email: email,
                name: name,
                image: image
            });

            Alert.alert('Success', 'Registration successful!');
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'An error occurred during registration.');
        }
    };

    const DangNhap = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFFFFF' />
            <Image source={require('./image/anh.png')} style={styles.logo} resizeMode='contain' />
            <Text style={styles.welcomeText}>Create New Account</Text>
            <TextInput onChangeText={setName} placeholder='Name' style={styles.input} placeholderTextColor='#606770' />
            <TextInput onChangeText={setEmail} placeholder='Email Address' style={styles.input} placeholderTextColor='#606770' />
            <TextInput onChangeText={setPassword} style={styles.input} placeholder='Password' placeholderTextColor='#606770' secureTextEntry={true} />
            <TextInput onChangeText={setRePassword} style={styles.input} placeholder='Re-type Password' placeholderTextColor='#606770' secureTextEntry={true} />
            <TextInput onChangeText={setImage} placeholder='Image Link' style={styles.input} placeholderTextColor='#606770' />
            <Pressable onPress={handleRegister} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable onPress={DangNhap}>
                    <Text style={styles.footerLink}>Login</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Register;

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
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#1877F2',
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
    registerButton: { 
        backgroundColor: '#1877F2', 
        width: '100%', 
        height: 50, 
        borderRadius: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 15 
    },
    registerButtonText: { 
        color: '#FFFFFF', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    footer: { 
        flexDirection: 'row', 
        marginTop: 20 
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
