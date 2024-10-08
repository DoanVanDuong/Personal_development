import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import coment from '../image/comment.png';
import share from '../image/share.png';
import tim from '../image/tim2.png';
import timDo from '../image/timdo.png';

const FriendPosts = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const { userId } = useSelector((state) => state.user);

    const fetchFriendPosts = async () => {
        try {
            const friendsQuery = query(collection(db, 'friends'), where('userId', '==', userId));
            const friendsSnapshot = await getDocs(friendsQuery);
            const friends = friendsSnapshot.docs.map(doc => doc.data().friendId);

            const postsQuery = query(collection(db, 'words'), where('userId', 'in', friends));
            const postsSnapshot = await getDocs(postsQuery);
            const friendPosts = await Promise.all(postsSnapshot.docs.map(async doc => {
                const postId = doc.id;
                const postData = doc.data();
                const likesQuery = query(collection(db, 'likes'), where('postId', '==', postId));
                const likesSnapshot = await getDocs(likesQuery);
                const likesCount = likesSnapshot.size;

                return {
                    id: postId,
                    words: postData.image,
                    name: postData.name,
                    nd: postData.nd,
                    userId: postData.userId,
                    likesCount: likesCount,
                    isLiked: likesSnapshot.docs.some(doc => doc.data().userId === userId),
                };
            }));
            setPosts(friendPosts);
        } catch (error) {
            console.error('Error fetching friend posts:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const likesQuery = query(collection(db, 'likes'), where('postId', '==', postId), where('userId', '==', userId));
            const likesSnapshot = await getDocs(likesQuery);

            if (likesSnapshot.empty) {
                await addDoc(collection(db, 'likes'), {
                    postId,
                    userId,
                });
            } else {
                const likeId = likesSnapshot.docs[0].id;
                await deleteDoc(doc(db, 'likes', likeId));
            }

            fetchFriendPosts(); // Fetch the posts again to update the like count
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    useEffect(() => {
        fetchFriendPosts();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={'#0C0F14'} />
            <View style={st.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={st.backButtonText}>Back</Text>
                </Pressable>
                <Text style={st.title}>Friend Posts</Text>
            </View>
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <View style={st.postContainer}>
                        <View style={st.profileSection}>
                            <Image source={{ uri: item.words }} style={st.profileImage} />
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
                                        source={item.isLiked ? timDo : tim}
                                        style={st.actionIcon}
                                    />
                                    <Text style={st.actionText}>
                                        {item.likesCount}
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
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const st = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#0C0F14',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    postContainer: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    username: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentSection: {
        marginBottom: 10,
    },
    postContent: {
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    actionText: {
        fontSize: 14,
    },
});

export default FriendPosts;
