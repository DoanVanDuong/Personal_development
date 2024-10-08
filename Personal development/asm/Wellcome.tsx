import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    return () => {
      clearTimeout(timer);
    }
  }, [navigation]);

  return (
    <View style={st.container}>
      <StatusBar backgroundColor={'#4267B2'} barStyle="light-content" />
      <View style={st.imageContainer}>
        <Image source={require('./image/anh2.png')} style={st.image} />
      </View>
      <View style={st.textContainer}>
        <Text style={st.title}>Welcome to</Text>
        <Text style={st.subtitle}>Personal Development</Text>
        <Text style={st.description}>There are many variations of passages</Text>
        <Text style={st.description}>of Lorem Ipsum available, but the majority</Text>
      </View>
    </View>
  );
};

export default Welcome;

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover', 
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4267B2',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4267B2',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#606770',
    textAlign: 'center',
    marginBottom: 10,
  },
});
