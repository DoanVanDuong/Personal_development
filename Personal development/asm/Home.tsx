import { FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Item from './components/Item'
import penIcon from './image/pen.png';
import runIcon from './image/run.png';
import albumIcon from './image/album.png';
import friendIcon from './image/friend.png';
import topIcon from './image/rank.png';
import mealIcon from './image/meal.png';
import talkIcon from './image/talk.png';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const data = [
  { id: '1', title: 'Words Of Gratitude', icon: penIcon },
  { id: '2', title: 'Run', icon: runIcon },
  { id: '3', title: 'Video', icon: albumIcon },
  { id: '4', title: 'Meal', icon: mealIcon }
];
const data2 = [
  { id: '1', title: 'Top Rank', icon: topIcon },
  { id: '2', title: 'My Friend', icon: friendIcon },
  { id: '3', title: 'Talk To Expert', icon: talkIcon }
];
const Home = () => {
  const navigation = useNavigation();
  const Seting = () => {
    navigation.navigate('Setting');
};
const { userId, username,image } = useSelector((state) => state.user);

 
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <StatusBar backgroundColor={'#0C0F14'}></StatusBar>
      <View style={st.khung2}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={Seting}  >
            <Image source={require('./image/ichome.png')} style={st.anh} />
          </Pressable>
          <Text style={st.txt1}>Home</Text></View>
        <Pressable >
          <Image source={{ uri: image }} style={st.anh1} />
        </Pressable>
      </View>
      <View style={st.khung}>
        <Image style={st.img} source={require('./image/baner.jpg')} />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
        <Text style={{ color: 'black', fontSize: 24, fontFamily: 'TimeNewRoman', fontVariant: ['oldstyle-nums'], fontWeight: 'bold', letterSpacing: 1 }}>Work</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Pressable style={{ marginEnd: 10 }}>
            <Image source={require('./image/fillter.png')} style={st.anh} />
          </Pressable>
          <Pressable style={{ backgroundColor: '#242424', width: 60, borderRadius: 10, height: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={st.txt2}>Add</Text>
          </Pressable>
        </View>
      </View>
      <FlatList horizontal={true} style={{ height: 80 }}
        data={data}
        renderItem={({ item }) => <Item title={item} />}
        keyExtractor={item => item.id}
      />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
        <Text style={{ color: 'black', fontSize: 24, fontFamily: 'TimeNewRoman', fontVariant: ['oldstyle-nums'], fontWeight: 'bold', letterSpacing: 1 }}>Friend</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Pressable style={{ marginEnd: 10 }}>
            <Image source={require('./image/fillter.png')} style={st.anh} />
          </Pressable>
          <Pressable style={{ backgroundColor: '#242424', width: 60, borderRadius: 10, height: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={st.txt2}>Add</Text>
          </Pressable>
        </View>

      </View>
      <FlatList horizontal={true} style={{ height: 200 }}
        data={data2}
        renderItem={({ item }) => <Item title={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default Home

const st = StyleSheet.create({
  khung2: { width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  txt1: { color: 'black', marginLeft: 20, fontSize: 24, fontFamily: 'TimeNewRoman', fontVariant: ['oldstyle-nums'], fontWeight: 'bold', letterSpacing: 1 },
  txt2: { color: 'white', fontSize: 16, fontFamily: 'TimeNewRoman', fontVariant: ['oldstyle-nums'], fontWeight: 'bold', letterSpacing: 1 },
  anh: { width: 30, height: 30 },
  anh1: { width: 30, height: 30, borderRadius: 30 },
  khung: {
    margin: 10,
    padding: 10,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  img: {
    width: '100%', height: 100
  }
})