import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Pressable, Image, Button, Alert, TextInput, Modal, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDocs, addDoc, deleteDoc, doc, updateDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useSelector } from 'react-redux';

const VideoList = () => {
    const navigation = useNavigation();
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState({ title: '', url: '', description: '', image: '', idUser: '' });
    const [editingVideo, setEditingVideo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { userId } = useSelector((state) => state.user);

    const fetchVideos = async () => {
        const querySnapshot = await getDocs(collection(db, 'videos'));
        const videoList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVideos(videoList);
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const addVideo = async () => {
        if (userId === "3") {
            await addDoc(collection(db, 'videos'), { ...newVideo, idUser: userId });
            setNewVideo({ title: '', url: '', description: '', image: '', idUser: userId });
            setIsModalVisible(false);
            fetchVideos();
        } else {
            Alert.alert('Permission denied', 'You must be an admin to add videos.');
        }
    };

    const deleteVideo = async (id) => {
        if (userId === "3") {
            await deleteDoc(doc(db, 'videos', id));
            fetchVideos();
        } else {
            Alert.alert('Permission denied', 'You must be an admin to delete videos.');
        }
    };

    const updateVideo = async () => {
        if (userId === "3") {
            await updateDoc(doc(db, 'videos', editingVideo.id), editingVideo);
            setEditingVideo(null);
            setIsModalVisible(false);
            fetchVideos();
        } else {
            Alert.alert('Permission denied', 'You must be an admin to update videos.');
        }
    };

    const navigateToHome = () => {
        navigation.navigate('Home');
    };

    const openModal = (video = null) => {
        if (video) {
            setEditingVideo(video);
        } else {
            setEditingVideo(null);
            setNewVideo({ title: '', url: '', description: '', image: '', idUser: userId });
        }
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={navigateToHome}>
                    <Image source={require('./image/icpre.png')} style={styles.icon} />
                </Pressable>
                <Text style={styles.title1}>Video</Text>
                {userId === "3" && (
                    <Button title="Add Video" onPress={() => openModal()} />
                )}
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search by title"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlatList
                data={filteredVideos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity
                            style={styles.itemContent}
                            onPress={() => navigation.navigate('Video', { uri: item.url, title: item.title, description: item.description })}
                        >
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                        {userId === "3" && (
                            <>
                                <TouchableOpacity onPress={() => deleteVideo(item.id)}>
                                    <Text style={styles.deleteButton}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => openModal(item)}>
                                    <Text style={styles.editButton}>Edit</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            />

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={editingVideo ? editingVideo.title : newVideo.title}
                            onChangeText={(text) => editingVideo ? setEditingVideo({ ...editingVideo, title: text }) : setNewVideo({ ...newVideo, title: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="URL"
                            value={editingVideo ? editingVideo.url : newVideo.url}
                            onChangeText={(text) => editingVideo ? setEditingVideo({ ...editingVideo, url: text }) : setNewVideo({ ...newVideo, url: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={editingVideo ? editingVideo.description : newVideo.description}
                            onChangeText={(text) => editingVideo ? setEditingVideo({ ...editingVideo, description: text }) : setNewVideo({ ...newVideo, description: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Image URL"
                            value={editingVideo ? editingVideo.image : newVideo.image}
                            onChangeText={(text) => editingVideo ? setEditingVideo({ ...editingVideo, image: text }) : setNewVideo({ ...newVideo, image: text })}
                        />
                        <View style={styles.buttonContainer}>
                            {editingVideo ? (
                                <Button title="Update Video" onPress={updateVideo} />
                            ) : (
                                <Button title="Add Video" onPress={addVideo} />
                            )}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Close" onPress={closeModal} />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
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
        padding: 15,
        backgroundColor: '#F5F5F5',
    },
    icon: {
        width: 30,
        height: 30,
    },
    title1: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    form: {
        marginBottom: 16,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 8,
        padding: 8,
    },
    searchInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 16,
        padding: 8,
        marginHorizontal: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemContent: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    itemImage: {
        width: 100,
        height: 100,
        marginRight: 16,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 5,
    },
    deleteButton: {
        color: 'red',
        marginLeft: 16,
    },
    editButton: {
        color: 'blue',
        marginLeft: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonContainer: {
        marginVertical: 5,
    },
});

export default VideoList;
