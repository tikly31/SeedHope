import React, { useState } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, FlatList } from "react-native"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import BottomNavBar from "../components/BottomNavBar"
import ProfileFundraiserCard from "../components/ProfileFundraiserCard"
import profile from "../assets/profile.jpg"

const { width } = Dimensions.get("window")
const PROFILE_IMAGE_SIZE = 80

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("fundraisers")
  const [username, setUsername] = useState("rahman_ajij")
  const [name, setName] = useState("Ajij Rahman")
  const [bio, setBio] = useState("Helping others through fundraising")
  const navigation = useNavigation()

  const fundraisers = [
    { id: "1", title: "Medical Fund", amount: "৳50,000", imageUri: "https://example.com/image1.jpg" },
    { id: "2", title: "Education Support", amount: "৳30,000", imageUri: "https://example.com/image2.jpg" },
    { id: "3", title: "Emergency Aid", amount: "৳25,000", imageUri: "https://example.com/image3.jpg" },
    { id: "4", title: "Community Project", amount: "৳40,000", imageUri: "https://example.com/image4.jpg" },
    { id: "5", title: "Environmental Cause", amount: "৳35,000", imageUri: "https://example.com/image5.jpg" },
    { id: "6", title: "Animal Welfare", amount: "৳20,000", imageUri: "https://example.com/image6.jpg" },
  ]

  const donations = [
    { id: '7', title: 'Local Food Bank', amount: '৳15,000', imageUri: 'https://example.com/image7.jpg' },
    { id: '8', title: 'Children\'s Hospital', amount: '৳250', imageUri: 'https://example.com/image8.jpg' },
    { id: '9', title: 'Disaster Relief', amount: '৳30,000', imageUri: 'https://example.com/image9.jpg' },
  ];

  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen1")
  }

  const handleMenu = () => {
    navigation.navigate("LogoutScreen")
  }

  const handlePlus = () => {
    navigation.navigate("CreateFundraiser")
  }

  const handlePressFundraiser = (fundId) => {
    // console.log('Navigating with fundId:', fundId);
    navigation.navigate('FundraiserDetailsScreen', { fundId });
  }

  const renderItem = ({ item }) => (
    <ProfileFundraiserCard
      id={item.id}
      title={item.title}
      amount={item.amount}
      imageUri={item.imageUri}
      onPress={handlePressFundraiser}
    />
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.usernameContainer}>
          <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handlePlus}>
            <Feather name="plus-square" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleMenu}>
            <Feather name="log-out" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.profileImageContainer}>
          <Image source={profile} style={styles.profileImage} />
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Fundraisers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>৳150K</Text>
            <Text style={styles.statLabel}>Raised</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Donated</Text>
          </View>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bioText}>{bio}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "fundraisers" && styles.activeTab]}
          onPress={() => setActiveTab("fundraisers")}
        >
          <MaterialCommunityIcons
            name="hand-heart"
            size={24}
            color={activeTab === "fundraisers" ? "#007AFF" : "#666"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "donations" && styles.activeTab]}
          onPress={() => setActiveTab("donations")}
        >
          <MaterialCommunityIcons
            name="gift-outline"
            size={24}
            color={activeTab === "donations" ? "#007AFF" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {activeTab === "fundraisers" ? (
        <FlatList
          data={fundraisers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <FlatList
          data={donations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
      )}

      <BottomNavBar navigation={navigation} activeScreen="Home" isAdmin={true} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  headerActions: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 15,
    marginTop: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  bioContainer: {
    padding: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 15,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    padding: 15,
    margin: 10,
  },
  editButtonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#dbdbdb",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
    marginBottom: 10,
  },
})

