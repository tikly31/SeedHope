import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const Footer = () => {
  return (
    // <View style={styles.container}>
    //   <TouchableOpacity>
    //     <Text>🏠 Home</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity>
    //     <Text>🔍 Explore</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity>
    //     <Text>➕ Add</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity>
    //     <Text>👤 Profile</Text>
    //   </TouchableOpacity>
    // </View>

    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <MaterialCommunityIcons name="home" size={24} color="black" />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <MaterialCommunityIcons name="compass" size={24} color="black" />
        <Text>Explore</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <MaterialCommunityIcons name="plus-circle" size={24} color="black" />
        <Text>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <MaterialCommunityIcons name="account" size={24} color="black" />
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-around',
  //     padding: 16,
  //     backgroundColor: '#f8f9fa',
  //   },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navItem: {
    alignItems: "center",
  },
});

export default Footer;
