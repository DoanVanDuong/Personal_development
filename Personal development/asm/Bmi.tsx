import { Alert, Image, Linking, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const PersonalDetail = () => {
  const navigation = useNavigation();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState('');
  const { userId, username,image } = useSelector((state) => state.user);

  const backHome = () => {
    navigation.navigate('Setting');
  };

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (!isNaN(heightInMeters) && !isNaN(weightInKg) && heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(2));
      let bmiStatus = '';
      if (bmiValue < 18.5) {
        bmiStatus = 'Underweight';
      } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
        bmiStatus = 'Normal weight';
      } else if (bmiValue >= 25 && bmiValue < 29.9) {
        bmiStatus = 'Overweight';
      } else {
        bmiStatus = 'Obesity';
      }
      setStatus(bmiStatus);
    } else {
      Alert.alert('Invalid input', 'Please enter valid height and weight.');
    }
  };

  const openDietGuide = async () => {
    const url = 'https://viendinhduongtphcm.org/vi/dinh-duong-co-ban/theo-doi-tinh-trang-dinh-duong-bang-chi-so-bmi.html'; 
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Unable to open URL');
    }
  };

  return (
    <View style={st.khung}>
      <StatusBar backgroundColor={'#0C0F14'} />
      <View style={st.header}>
        <Pressable style={st.backButton} onPress={backHome}>
          <Image source={require('./image/icpre.png')} style={st.anh1} />
        </Pressable>
        <Text style={st.txt1}>BMI</Text>
      </View>
      <Image source={{ uri: image }} style={st.anh} resizeMode='cover' />

      <View style={st.formContainer}>
        <TextInput
          placeholder='Chiều cao (cm)'
          style={st.input}
          placeholderTextColor='#B0B0B0'
          keyboardType='numeric'
          value={height}
          onChangeText={setHeight}
        />
        <TextInput
          placeholder='Cân nặng (kg)'
          style={st.input}
          placeholderTextColor='#B0B0B0'
          keyboardType='numeric'
          value={weight}
          onChangeText={setWeight}
        />
        <View style={st.resultContainer}>
          <Text style={st.resultText}>BMI: {bmi ? bmi : 'N/A'}</Text>
          <Text style={st.resultText}>Trạng Thái: {status || 'N/A'}</Text>
        </View>
        <Pressable style={st.btn1} onPress={calculateBMI}>
          <Text style={st.btnText}>Calculate BMI</Text>
        </Pressable>
        {status && (
          <Pressable style={st.dietGuideBtn} onPress={openDietGuide}>
            <Text style={st.dietGuideBtnText}>View Diet Guide</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default PersonalDetail;

const st = StyleSheet.create({
  khung: { 
    backgroundColor: '#FFFFFF', 
    flex: 1, 
    alignItems: 'center', 
    padding: 20 
  },
  header: { 
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  backButton: { 
    position: 'absolute', 
    left: 20 
  },
  anh: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    marginVertical: 20 
  },
  formContainer: { 
    width: '100%', 
    alignItems: 'center' 
  },
  input: { 
    width: '90%', 
    padding: 15, 
    marginVertical: 10, 
    borderColor: '#D1D1D1', 
    borderWidth: 1, 
    borderRadius: 10, 
    backgroundColor: '#F5F5F5', 
    fontSize: 16 
  },
  resultContainer: { 
    marginVertical: 20, 
    width: '90%' 
  },
  resultText: { 
    fontSize: 18, 
    color: '#333333', 
    marginVertical: 5 
  },
  btn1: { 
    backgroundColor: '#D17842', 
    width: '90%', 
    height: 50, 
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10 
  },
  btnText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  dietGuideBtn: { 
    backgroundColor: '#4CAF50', 
    width: '90%', 
    height: 50, 
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10 
  },
  dietGuideBtnText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  txt1: { 
    color: '#0C0F14', 
    fontSize: 26, 
    fontWeight: 'bold' 
  },
  anh1: { 
    width: 30, 
    height: 30, 
    borderRadius: 15 
  },
});
