import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
const Iteam2 = ({ coment, tim, share,awata, title }) => {
  return (
    <View style={st.khung}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Image source={awata} style={st.anh1} />
        <View style={{ marginLeft: 10 }} >
          <Text style={st.txt1}>{title.ten}</Text>
          <Text>{title.email}</Text>
        </View>
      </View>
      <Text style={st.txt2}>{title.nd}</Text>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={st.txt3}>20</Text>
          <Pressable>
            <Image source={share} />
          </Pressable>
        </View>
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={st.txt3}>20</Text>
            <Pressable>
              <Image source={coment} />
            </Pressable>
            <View style={{ display: 'flex',marginLeft:20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={st.txt3}>20</Text>
              <Pressable>
                <Image source={tim} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Iteam2

const st = StyleSheet.create({
  khung: { backgroundColor: '#EFE7F7', margin: 10, borderRadius: 40, padding: 15 },
  anh1: { width: 40, height: 40, borderRadius: 30 },
  txt1: { color: 'black', fontSize: 16, fontFamily: 'TimeNewRoman', fontVariant: ['oldstyle-nums'], fontWeight: 'bold', letterSpacing: 1 },
  txt2: { color: '#A52020', marginTop: 20 },
  txt3:{marginEnd:5}
})