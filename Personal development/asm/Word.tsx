import { FlatList, Image, Modal, Pressable, StatusBar, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import awata from './image/anh1.png';
import coment from './image/comment.png';
import share from './image/share.png';
import tim from './image/tim2.png';
import timDo from './image/timdo.png';

const Word = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [words, setWords] = useState([]);
    const [newNd, setNewNd] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const { userId, username, image } = useSelector((state) => state.user);

    const navigateToHome = () => {
        navigation.navigate('Home');
    };

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            const q = query(collection(db, 'words'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const fetchedWords = [];
            for (const docSnap of querySnapshot.docs) {
                const { nd, image, name } = docSnap.data();
                const likesSnap = await getDocs(query(collection(db, 'likes'), where('postId', '==', docSnap.id)));
                const likes = likesSnap.docs.map(likeDoc => likeDoc.data().userId);
                fetchedWords.push({ id: docSnap.id, nd, image, name, likes });
            }
            setWords(fetchedWords);
        } catch (error) {
            console.error('Error fetching words:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const likeQuery = query(collection(db, 'likes'), where('postId', '==', postId), where('userId', '==', userId));
            const likeSnap = await getDocs(likeQuery);

            if (!likeSnap.empty) {
                const likeDocId = likeSnap.docs[0].id;
                await deleteDoc(doc(db, 'likes', likeDocId));
            } else {
                await addDoc(collection(db, 'likes'), { postId, userId });
            }

            // Fetch updated likes for the post
            const updatedLikesSnap = await getDocs(query(collection(db, 'likes'), where('postId', '==', postId)));
            const updatedLikes = updatedLikesSnap.docs.map(likeDoc => likeDoc.data().userId);

            setWords(prevWords =>
                prevWords.map(word =>
                    word.id === postId
                        ? { ...word, likes: updatedLikes }
                        : word
                )
            );
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleAdd = async () => {
        if (!userId) {
            Alert.alert('Error', 'User not logged in');
            return;
        }

        if (newNd.trim() === '') {
            Alert.alert('Validation Error', 'Please enter all values');
            return;
        }

        Alert.alert(
            'Confirm Add',
            'Are you sure you want to add this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        try {
                            await addDoc(collection(db, 'words'), { nd: newNd, userId, image: image, name: username });
                            setNewNd('');
                            setIsModalVisible(false);
                            fetchWords(userId);
                            Alert.alert('Success', 'Item added successfully');
                        } catch (error) {
                            console.error('Error adding document: ', error);
                            Alert.alert('Error', 'Failed to add item');
                        }
                    }
                }
            ]
        );
    };

    const handleUpdate = async () => {
        if (editValue.trim() === '') {
            Alert.alert('Validation Error', 'Please enter all values');
            return;
        }

        Alert.alert(
            'Confirm Update',
            'Are you sure you want to update this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        try {
                            const wordDoc = doc(db, 'words', editingId);
                            await updateDoc(wordDoc, { nd: editValue, image: image, name: username });
                            setEditValue('');
                            setEditingId(null);
                            setIsModalVisible(false);
                            fetchWords(userId);
                            Alert.alert('Success', 'Item updated successfully');
                        } catch (error) {
                            console.error('Error updating document: ', error);
                            Alert.alert('Error', 'Failed to update item');
                        }
                    }
                }
            ]
        );
    };

    const handleDelete = async (id) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'words', id));
                            fetchWords(userId);
                            Alert.alert('Success', 'Item deleted successfully');
                        } catch (error) {
                            console.error('Error deleting document: ', error);
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    const openAddModal = () => {
        setModalTitle('Add New Item');
        setEditingId(null);
        setNewNd('');
        setIsModalVisible(true);
    };

    const openEditModal = (item) => {
        setModalTitle('Update Item');
        setEditingId(item.id);
        setEditValue(item.nd);
        setIsModalVisible(true);
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={'#0C0F14'} />
            <View style={st.header}>
                <Pressable onPress={navigateToHome}>
                    <Image source={require('./image/icpre.png')} style={st.icon} />
                </Pressable>
                <Text style={st.title}>Words Of Gratitude</Text>
                <Pressable>
                    <Image source={{ uri: image }} style={st.profileImage} />
                </Pressable>
            </View>
            <FlatList
                data={words}
                renderItem={({ item }) => (
                    <View style={st.postContainer}>
                        <View style={st.profileSection}>
                            <Image source={{ uri: item.image }} style={st.profileImage} />
                            <Text style={st.username}>{item.name}</Text>
                        </View>
                        <View style={st.contentSection}>
                            <Text style={st.postContent}>{item.nd}</Text>
                            <View style={st.actions}>
                                <Pressable
                                    style={st.actionButton}
                                    onPress={() => handleLike(item.id)}
                                >
                                    <Image
                                        source={item.likes.includes(userId) ? timDo : tim}
                                        style={st.actionIcon}
                                    />
                                    <Text style={st.actionText}>
                                        {item.likes.length}
                                    </Text>
                                </Pressable>
                                <Pressable style={st.actionButton}>
                                    <Image source={coment} style={st.actionIcon} />
                                    <Text style={st.actionText}>Comment</Text>
                                </Pressable>
                                <Pressable style={st.actionButton}>
                                    <Image source={share} style={st.actionIcon} />
                                    <Text style={st.actionText}>Share</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', paddingVertical: 5, width: 200, justifyContent: 'space-around' }}>
                            <Pressable style={st.deleteButton} onPress={() => handleDelete(item.id)}>
                                <Text style={st.deleteButtonText}>Delete</Text>
                            </Pressable>
                            <Pressable style={st.deleteButton} onPress={() => openEditModal(item)}>
                                <Text style={st.deleteButtonText}>Update</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <Pressable style={st.addButton} onPress={openAddModal}>
                <Text style={st.addButtonText}>Add New Word</Text>
            </Pressable>
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={st.modalOverlay}>
                    <View style={st.modalContainer}>
                        <Text style={st.modalTitle}>{modalTitle}</Text>
                        <TextInput
                            style={st.modalInput}
                            placeholder="Enter content"
                            value={editingId ? editValue : newNd}
                            onChangeText={editingId ? setEditValue : setNewNd}
                        />
                        <Pressable style={st.modalButton} onPress={editingId ? handleUpdate : handleAdd}>
                            <Text style={st.modalButtonText}>{editingId ? 'Update' : 'Add'}</Text>
                        </Pressable>
                        <Pressable style={st.modalButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={st.modalButtonText}>Cancel</Text>
                    </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const st = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#0C0F14',
    },
    icon: {
        width: 20,
        height: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    postContainer: {
        backgroundColor: '#1E1F26',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    profileSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    username: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentSection: {
        marginBottom: 5,
    },
    postContent: {
        color: '#E4E6EB',
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    actionIcon: {
        width: 20,
        height: 20,
        tintColor: '#E4E6EB',
    },
    actionText: {
        color: '#E4E6EB',
        marginLeft: 5,
    },
    deleteButton: {
        backgroundColor: '#FF1744',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginBottom:5,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Word;
