import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";

const Header = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search fundraisers or causes..."
      />
      <TouchableOpacity style={styles.notification}>
        <Text>🔔</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  search: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e9ecef",
  },
  notification: {
    marginLeft: 10,
    padding: 8,
  },
});

export default Header;
