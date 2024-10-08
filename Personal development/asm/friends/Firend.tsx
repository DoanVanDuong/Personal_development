import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { getDocs, query, where, collection, addDoc, doc, writeBatch } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

const Friend = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const { userId } = useSelector((state) => state.user);
  const navigation = useNavigation();

  const searchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), where('name', '>=', search), where('name', '<=', search + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(users);
    } catch (error) {
      Alert.alert('Error', 'Failed to search users');
      console.error('Error searching users: ', error);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      await addDoc(collection(db, 'friendRequests'), {
        senderId: userId,
        receiverId: friendId,
        status: 'pending',
      });
      Alert.alert('Success', 'Friend request sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
      console.error('Error sending friend request: ', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const q = query(collection(db, 'friendRequests'), where('receiverId', '==', userId), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const friendRequests = await Promise.all(querySnapshot.docs.map(async doc => {
        const senderId = doc.data().senderId;
        const userSnapshot = await getDocs(query(collection(db, 'users'), where('__name__', '==', senderId)));
        const senderData = userSnapshot.docs[0].data();
        return { id: doc.id, senderId, senderName: senderData.name, senderImage: senderData.image, ...doc.data() };
      }));
      setRequests(friendRequests);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch friend requests');
      console.error('Error fetching friend requests: ', error);
    }
  };

  const acceptFriendRequest = async (id, senderId) => {
    try {
      const batch = writeBatch(db);
      const friendRequestRef = doc(db, 'friendRequests', id);

      batch.update(friendRequestRef, { status: 'accepted' });
      batch.set(doc(collection(db, 'friends')), { userId, friendId: senderId });
      batch.set(doc(collection(db, 'friends')), { userId: senderId, friendId: userId });

      await batch.commit();

      Alert.alert('Success', 'Friend request accepted');
      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      Alert.alert('Error', 'Failed to accept friend request');
      console.error('Error accepting friend request: ', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const q = query(collection(db, 'friends'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const friendList = await Promise.all(querySnapshot.docs.map(async doc => {
        const friendData = await getDocs(query(collection(db, 'users'), where('__name__', '==', doc.data().friendId)));
        return { id: doc.id, ...friendData.docs[0].data() };
      }));
      setFriends(friendList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch friends');
      console.error('Error fetching friends: ', error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../image/icpre.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Search for friends"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchUsers}>
          <Image source={require('../image/icfind.png')} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Image source={{ uri: item.image }} style={styles.profileImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={() => sendFriendRequest(item.id)}>
                  <Text style={styles.addButton}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friend Requests</Text>
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Image source={{ uri: item.senderImage }} style={styles.profileImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.requestText}>{item.senderName}</Text>
                <Button  title="Accept" onPress={() => acceptFriendRequest(item.id, item.senderId)} color="#007AFF" />
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends List</Text>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Image source={{ uri: item.image }} style={styles.profileImage} />
              <View style={styles.friendTextContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FriendsPost', { friendId: item.id })}>
                  <Text style={styles.viewPostsButton}>View Posts</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon: {
    width: 30,
    height: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchSection: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    color: '#333',
  },
  searchButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  requestText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  viewPostsButton: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  unfriendButton: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});

export default Friend;
