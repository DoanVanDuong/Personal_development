import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import WebView from 'react-native-webview';

const Video = ({ route }) => {
    const navigation = useNavigation();
    const { uri, title, description } = route.params || {};

    const navigateToHome = () => {
        navigation.navigate('VideoList');
    };

    if (!uri) {
        return (
            <View style={styles.container}>
                <Pressable onPress={navigateToHome}>
                    <Image source={require('./image/icpre.png')} style={styles.icon} />
                </Pressable>
                <Text style={styles.error}>Video URL is not available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={navigateToHome}>
                    <Image source={require('./image/icpre.png')} style={styles.icon} />
                </Pressable>
                <Text style={styles.title}>{title || 'No Title'}</Text>
            </View>
            <Text style={styles.description}>{description || 'No Description'}</Text>
            <WebView
                source={{ uri }}
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        marginLeft:10,
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        marginBottom: 16,
    },
    webview: {
        flex: 1,
    },
    error: {
        fontSize: 16,
        color: 'red',
    },
    icon: { 
        width: 30, 
        height: 30,
        marginRight: 16, 
    },
});

export default Video;
