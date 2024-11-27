import React, { useState } from "react";
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

import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import jwtDecode from "jwt-decode";




// web client id 853660126141-kn2kjcl3vq3t6c962u711p53p62qimlk.apps.googleusercontent.com
// ios client id 853660126141-12nj0532b9anqrsr5nbn1h3ntak0ijud.apps.googleusercontent.com
// android client id 853660126141-jtnrl3712kumek7ounntjjdlj8l3lkcd.apps.googleusercontent.com
const GOOGLE_ANDROID_CLIENT_ID = "853660126141-jtnrl3712kumek7ounntjjdlj8l3lkcd.apps.googleusercontent.com"
const GOOGLE_iOS_CLIENT_ID = "853660126141-12nj0532b9anqrsr5nbn1h3ntak0ijud.apps.googleusercontent.com"
const GOOGLE_WEB_CLIENT_ID = "853660126141-kn2kjcl3vq3t6c962u711p53p62qimlk.apps.googleusercontent.com"
WebBrowser.maybeCompleteAuthSession();




const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);

  const validUsers = [
    { email: "test1@example.com", password: "password123" },
    { email: "test2@example.com", password: "securePass456" },
    { email: "test3@example.com", password: "mySecret789" },
    { email: "user@example.com", password: "password123" },
    { email: "admin@example.com", password: "adminAccess!" },
  ];


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


  
  


 
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    const user = validUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      Alert.alert("Success", "Login successful!");
      // Navigate to the next screen, e.g., a dashboard
      // navigation.navigate("DASHBOARD");
    } else {
      Alert.alert("Error", "Invalid email or password. Please try again.");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
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
