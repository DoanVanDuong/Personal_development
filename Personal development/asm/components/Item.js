import { FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
const Item = ({ title }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (title.title === 'Words Of Gratitude') {
      navigation.navigate('Word');
    }else  if (title.title === 'Meal') {
      navigation.navigate('Meal');
    }else  if (title.title === 'Video') {
      navigation.navigate('VideoList');
    }else  if (title.title === 'My Friend') {
      navigation.navigate('Friend');
    }
  };
  
    console.log(title);
    return (
      <View style={{padding:10}}>
        <View style={st.khung3}>
       <Pressable onPress={handlePress} style={{ width: 51, height: 51,borderRadius:51,backgroundColor:'white',marginBottom:25,alignItems:'center',justifyContent:'center' }}>
       <Image source={title.icon}  />
       </Pressable>
        <Text style={st.txt4}>{title.title}</Text>
      </View>
      </View>
    )
  }
  export default Item
  const st = StyleSheet.create({
  
    txt4: { color: 'black', marginLeft:10,fontSize: 13, fontFamily: 'TimeNewRoman', fontVariant: ['oldstyle-nums'], fontWeight: 'bold', letterSpacing: 0.5, marginTop: 10 },
    khung3: {
        backgroundColor: '#E9FFE3',
        overflow: 'hidden',
        marginEnd: 10,
        width:130,
        height: 150,
        borderTopRightRadius: 80,
        borderRadius:20,
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }
  })   