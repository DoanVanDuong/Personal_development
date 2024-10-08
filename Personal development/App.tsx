import { StyleSheet, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './asm/redux/store'; // Import your Redux store

import Wellcome from './asm/Wellcome';
import Login from './asm/Login';
import Register from './asm/Register';
import Home from './asm/Home';
import Bmi from './asm/Bmi';
import Setting from './asm/Setting';
import PersonalDetail from './asm/PersonalDetail';
import Word from './asm/Word';
import Meal from './asm/Meal';
import Video from './asm/Video';
import VideoList from './asm/VideoList';
import Friend from './asm/friends/Firend';
import FriendPost from './asm/friends/FriendPost';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen
            name="Welcome"
            component={Wellcome}
            options={{ title: 'Welcome', headerShown: false }}
          />
         
          <Stack.Screen name="FriendsPost" component={FriendPost} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Login', headerShown: false }}
          />
          <Stack.Screen
            name="Friend"
            component={Friend}
            options={{ title: 'Friend', headerShown: false }}
          />
          <Stack.Screen
            name="VideoList"
            component={VideoList}
            options={{ title: 'VideoList', headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ title: 'Register', headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home', headerShown: false }}
          />
          <Stack.Screen
            name="Word"
            component={Word}
            options={{ title: 'Word', headerShown: false }}
          />
          <Stack.Screen
            name="Meal"
            component={Meal}
            options={{ title: 'Meal', headerShown: false }}
          />
          <Stack.Screen
            name="Bmi"
            component={Bmi}
            options={{ title: 'Bmi', headerShown: false }}
          />
          <Stack.Screen
            name="Video"
            component={Video}
            options={{ title: 'Video', headerShown: false }}
          />
          <Stack.Screen
            name="PersonalDetail"
            component={PersonalDetail}
            options={{ title: 'PersonalDetail', headerShown: false }}
          />
          <Stack.Screen
            name="Setting"
            component={Setting}
            options={{ title: 'Setting', headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
