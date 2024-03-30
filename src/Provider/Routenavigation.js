import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../Splash';
import Login from '../Login';
import Home from '../Home';
import Notification from '../Notification';
import Booking from '../Booking';
import Setting from '../Setting';
import My_Earning from '../My_Earning';
import Change_Password from '../Change_Password';
import Contact from '../Contact';
import Contentpage from '../Contentpage';
import Faqs from '../Faqs';
import Language from '../Language';
import Terms_about_policy from '../Terms_about_policy';
import Profile from '../Profile';
import Document from '../Document';
import Reviews from '../Reviews';
import Bookings_Details from '../Bookings_Details';
import Calender from '../Calender';
import Edit_Profile from '../Edit_Profile';
import Forgot from '../Forgot';
import Otp_verify from '../Otp_verify';
import New_password from '../New_password';

const Stack = createStackNavigator();

const Stacknav = navigation => {
  return (
    <Stack.Navigator initialRouteName={'Splash'}>
      {/* start from Splash */}
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
      {/* this is login */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
      {/* This is home */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
      {/* notification screen */}
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}></Stack.Screen>
      {/* booking screen */}
      <Stack.Screen
        name="Booking"
        component={Booking}
        options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
      {/* setting screen */}
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{headerShown: false}}></Stack.Screen>
      {/* This show your earning */}
      <Stack.Screen
        name="My_Earning"
        component={My_Earning}
        options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
      {/* Change your password */}
      <Stack.Screen
        name="Change_Password"
        component={Change_Password}
        options={{headerShown: false}}></Stack.Screen>
      {/* Constact us screen */}
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{headerShown: false}}></Stack.Screen>
      {/* Contentpage screen */}
      <Stack.Screen
        name="Contentpage"
        component={Contentpage}
        options={{headerShown: false}}></Stack.Screen>
      {/* Faqs questions page */}
      <Stack.Screen
        name="Faqs"
        component={Faqs}
        options={{headerShown: false}}></Stack.Screen>

      <Stack.Screen
        name="Language"
        component={Language}
        options={{headerShown: false}}></Stack.Screen>
      {/* terms and condition, about us,privacy policy screen */}
      <Stack.Screen
        name="Terms_about_policy"
        component={Terms_about_policy}
        options={{headerShown: false}}></Stack.Screen>
      {/* Your profile screen */}
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
      {/* to see your Document */}
      <Stack.Screen
        name="Document"
        component={Document}
        options={{headerShown: false}}></Stack.Screen>
      {/* give Reviews */}
      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{headerShown: false}}></Stack.Screen>
      {/* Bookings_Details page */}
      <Stack.Screen
        name="Bookings_Details"
        component={Bookings_Details}
        options={{headerShown: false}}></Stack.Screen>
      {/* Calender to your date */}
      <Stack.Screen
        name="Calender"
        component={Calender}
        options={{headerShown: false}}></Stack.Screen>
      {/* Edit your profile Profile */}
      <Stack.Screen
        name="Edit_Profile"
        component={Edit_Profile}
        options={{headerShown: false}}></Stack.Screen>
      {/* forgot your password */}
      <Stack.Screen
        name="Forgot"
        component={Forgot}
        options={{headerShown: false}}></Stack.Screen>
      {/*verify your otp */}
      <Stack.Screen
        name="Otp_verify"
        component={Otp_verify}
        options={{headerShown: false}}></Stack.Screen>
      {/* give new password screen */}
      <Stack.Screen
        name="New_password"
        component={New_password}
        options={{headerShown: false}}></Stack.Screen>
    </Stack.Navigator>
  );
};
export default Stacknav;
