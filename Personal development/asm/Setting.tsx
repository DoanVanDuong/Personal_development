import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#FFFFFF' barStyle='dark-content' />
      <View style={styles.header}>
        <Pressable onPress={() => navigateTo('Home')}>
          <Image source={require('./image/icpre.png')} style={styles.icon} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.option}>
        <Pressable style={styles.optionButton}>
          <Image source={require('./image/icmachine.png')} style={styles.optionIcon} />
        </Pressable>
        <Text style={styles.optionText}>History</Text>
        <Pressable onPress={() => navigateTo('History')}>
          <Image source={require('./image/icnext1.png')} style={styles.nextIcon} />
        </Pressable>
      </View>
      <View style={styles.option}>
        <Pressable style={styles.optionButton}>
          <Image source={require('./image/ichuman.png')} style={styles.optionIcon} />
        </Pressable>
        <Text style={styles.optionText}>Personal Details</Text>
        <Pressable onPress={() => navigateTo('PersonalDetail')}>
          <Image source={require('./image/icnext1.png')} style={styles.nextIcon} />
        </Pressable>
      </View>
      <View style={styles.option}>
        <Pressable style={styles.optionButton}>
          <Image source={require('./image/icabout.png')} style={styles.optionIcon} />
        </Pressable>
        <Text style={styles.optionText}>BMI</Text>
        <Pressable onPress={() => navigateTo('Bmi')}>
          <Image source={require('./image/icnext1.png')} style={styles.nextIcon} />
        </Pressable>
      </View>
      <View style={styles.option}>
        <Pressable style={styles.optionButton}>
          <Image source={require('./image/iclogout.png')} style={styles.optionIcon} />
        </Pressable>
        <Text style={styles.optionText}>Logout</Text>
        <Pressable onPress={() => navigateTo('Login')}>
          <Image source={require('./image/icnext1.png')} style={styles.nextIcon} />
        </Pressable>
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    paddingBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 20,
    flex: 1,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  optionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    width: 25,
    height: 25,
  },
  optionText: {
    fontSize: 18,
    color: '#333333',
    flex: 1,
    marginLeft: 15,
  },
  nextIcon: {
    width: 20,
    height: 20,
    tintColor: '#007BFF',
  },
});
