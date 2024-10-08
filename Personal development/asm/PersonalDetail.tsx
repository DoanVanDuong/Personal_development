import React, { useState } from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, View, Modal, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from './redux/userSlice';

const PersonalDetail = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userId, username, email, image } = useSelector((state) => state.user);
  const [userData, setUserData] = useState({ username, email, image });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newImage, setNewImage] = useState(image);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const backHome = () => {
    navigation.navigate('Setting');
  };

  const handleSaveChanges = async () => {
    if (!newUsername) {
      Alert.alert('Validation Error', 'Username cannot be empty.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    Alert.alert(
      'Confirm Changes',
      'Are you sure you want to save these changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
              try {
                const userRef = doc(db, 'users', userId);

                const docSnap = await getDoc(userRef);
                if (!docSnap.exists()) {
                  throw new Error('No such document!');
                }

                await updateDoc(userRef, { name: newUsername, image: newImage });

                if (currentPassword && newPassword) {
                  if (newPassword === confirmPassword) {
                    const credential = EmailAuthProvider.credential(email, currentPassword);
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, newPassword);
                  } else {
                    Alert.alert('Validation Error', 'New passwords do not match.');
                    return;
                  }
                }

                dispatch(updateUser({ username: newUsername, email: email, image: newImage }));

                setUserData({ username: newUsername, email: email, image: newImage });
                setIsModalVisible(false);
                Alert.alert('Success', 'Details updated successfully.');
              } catch (error) {
                console.error("Error updating user details:", error);
                Alert.alert('Error', error.message || 'Failed to update user details.');
              }
            } else {
              Alert.alert('Error', 'No user is currently signed in.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFFFFF'} />
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={backHome}>
          <Image source={require('./image/icpre.png')} style={styles.icon} />
        </Pressable>
        <Text style={styles.title}>Personal Details</Text>
      </View>
      <Pressable onPress={() => setIsModalVisible(true)}>
        <Image source={{ uri: image }} style={styles.avatar} resizeMode='cover' />
      </Pressable>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{userData.username}</Text>
        <Text style={styles.infoText}>{userData.email}</Text>
      </View>
      <Pressable style={styles.editButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </Pressable>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="New Username"
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="New Image URL"
              value={newImage}
              onChangeText={setNewImage}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.buttonContainer}>
              <Button title="Save Changes" onPress={handleSaveChanges} />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#FF0000" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 142,
    height: 142,
    borderRadius: 71,
    marginTop: 50,
  },
  infoContainer: {
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
  },
  infoText: {
    paddingVertical: 15,
    letterSpacing: 0.5,
    color: '#252A32',
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    width: '100%',
    textAlign: 'center',
    borderRadius: 8,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  title: {
    color: '#252A32',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  editButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default PersonalDetail;
