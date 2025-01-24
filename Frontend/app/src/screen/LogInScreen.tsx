import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { colors } from "../utils/colors";
import MainScreen from "./MainScreen";
import { jwtDecode } from 'jwt-decode';
import {get_current_user} from '../utils/apiUtils';

import CONFIG from './config';
const API_BASE_URL = CONFIG.API_BASE_URL;

import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import AlertModal from '../components/AlertModal';


import AsyncStorage from '@react-native-async-storage/async-storage';



// web client id 853660126141-kn2kjcl3vq3t6c962u711p53p62qimlk.apps.googleusercontent.com
// ios client id 853660126141-12nj0532b9anqrsr5nbn1h3ntak0ijud.apps.googleusercontent.com
// android client id 853660126141-jtnrl3712kumek7ounntjjdlj8l3lkcd.apps.googleusercontent.com
const GOOGLE_ANDROID_CLIENT_ID = "853660126141-jtnrl3712kumek7ounntjjdlj8l3lkcd.apps.googleusercontent.com"
const GOOGLE_iOS_CLIENT_ID = "853660126141-12nj0532b9anqrsr5nbn1h3ntak0ijud.apps.googleusercontent.com"
const GOOGLE_WEB_CLIENT_ID = "853660126141-kn2kjcl3vq3t6c962u711p53p62qimlk.apps.googleusercontent.com"
WebBrowser.maybeCompleteAuthSession();


// const API_BASE_URL = 'http://192.168.0.106:8080';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);

const [validUsers, setValidUsers] = useState([]);


  // New state for AlertModal
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertType, setAlertType] = useState<"success" | "failure">("success")
    const [alertMessage, setAlertMessage] = useState("")

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users`);
      setValidUsers(response.data); // Assuming response.data is an array of users
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  fetchUsers();
}, []);


  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_iOS_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log("Google login success");
      const { id_token } = response.params;
      // console.log(id_token);

       // Decode the JWT to extract user data from the id_token
        const decoded = decodeJwtToken(id_token);
        console.log("decoded  : token");
        console.log(decoded);

        const user = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        };
        console.log("user");
    }
  }, [response]);


  const decodeJwtToken = (token) => {
    // Split the token into its three parts
    const parts = token.split('.');
  
    if (parts.length !== 3) {
      throw new Error("Invalid token");
    }
  
    // The payload is the second part (index 1)
    const payload = parts[1];
  
    // Base64 decode the payload
    const decodedPayload = atob(payload);
  
    // Parse the decoded string into a JSON object
    return JSON.parse(decodedPayload);
  };

     
  
  const handleSingInWithGoogle = async () => {
    console.log("Google login initiated");
    promptAsync();
  }



  
  const showAlert = (type: "success" | "failure", message: string) => {
    setAlertType(type)
    setAlertMessage(message)
    setAlertVisible(true)
  }

  

const handleLogin = async () => {
  if (!email || !password) {
    showAlert("failure", "Please fill all the fields!")
    // Alert.alert("Error", "Please enter both email and password.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+$/; // Simplified email regex
  if (!emailRegex.test(email)) {
    showAlert("failure", "Please enter a valid email address!")
    // Alert.alert("Error", "Please enter a valid email address.");
    return;
  }

  try {
    // clear AsyncStorage
    // await AsyncStorage.clear();
    
    console.log("Here is the email and password : " , email , password);
   
    // Make a POST request to the login endpoint
    const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    console.log("Here is the response : " , response);
    if (response.status === 200) {
      

      const responseBody = await response.text(); // Use .json() if the server returns JSON

      

      const token = responseBody;
      if(AsyncStorage.getItem("token") !== null){
        await AsyncStorage.removeItem("token");
      }


      // save the token in async storage
      await AsyncStorage.setItem("token", token);


      // // get the current user
      const user = await get_current_user();
      // await AsyncStorage.setItem("Id", user.id);
      console.log("Here is the user : " , user);
      if(user.name === null || user.name === undefined || user.picture === null || user.picture === undefined){
        showAlert("success", "Login successful! Please complete your profile.")
      } else {
        navigation.navigate("MainScreen");
      }


      // navigation.navigate("MainScreen");
      // Save the token in AsyncStorage
    } else {
      // Alert.alert("Error", "Invalid email or password. Please try again.");
      showAlert("failure", "Invalid email or password. Please try again!")
    }
  } catch (error) {
    console.error("Login error:", error);
    // Alert.alert("Error", "Unable to login. Please check your credentials and try again.");
    showAlert("failure", "Unable to login. Please check your credentials and try again!")
  }
};


  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSignup = () => {
    navigation.navigate("SignupScreen");
  };

  const handleAlertClose = () => {

    setAlertVisible(false);
    if (alertType === "success") {
      navigation.navigate("EditProfileScreen1");
    }
   

  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
            <SimpleLineIcons
              name={secureEntry ? "eye" : "eye-off"}
              size={20}
              color={colors.secondary}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}>or continue with</Text>
        <TouchableOpacity style={styles.googleButtonContainer}  onPress={handleSingInWithGoogle}>
          <Image
            source={require("../assets/google.png")}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AlertModal visible={alertVisible} type={alertType} message={alertMessage} onClose={handleAlertClose} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
  },
  signupText: {
    color: colors.primary,
  },
});
