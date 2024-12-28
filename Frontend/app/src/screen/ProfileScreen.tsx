import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';

type MetricBoxProps = {
  value: string | number;
  label: string;
  icon: any; // In a real app, you'd want to type this properly
}

const MetricBox = ({ value, label, icon }: MetricBoxProps) => (
  <View style={styles.metricBox}>
    <Image source={icon} style={styles.metricIcon} />
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

type FundCardProps = {
  title: string;
  amount: string;
  image: string;
}

const FundCard = ({ title, amount, image }: FundCardProps) => (
  <View style={styles.fundCard}>
    <Image 
      source={{ uri: image }} 
      style={styles.fundImage}
    />
    <View style={styles.fundInfo}>
      <Text style={styles.fundTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.fundAmount}>{amount}</Text>
    </View>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;

  const funds = [
    {
      title: "Education Fund",
      amount: "$5,000",
      image: "https://placeholder.com/150",
    },
    {
      title: "Healthcare Initiative",
      amount: "$3,200",
      image: "https://placeholder.com/150",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.leafLeft} />
          <View style={styles.leafRight} />
          <Image
            source={{ uri: 'https://placeholder.com/100' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>Tanzim Bro</Text>
      </View>

      {/* Metrics Section */}
      <View style={styles.metricsContainer}>
        <MetricBox
          value={7}
          label="Lives Saved"
          icon={require('../assets/logo.png')}
        />
        <MetricBox
          value="$2,000"
          label="Total Donation"
          icon={require('../assets/logo.png')}
        />
        <MetricBox
          value={25}
          label="Impact Points"
          icon={require('../assets/logo.png')}
        />
      </View>

      {/* My Funds Section */}
      <View style={styles.fundsSection}>
        <Text style={styles.sectionTitle}>My Funds</Text>
        <View style={styles.fundsGrid}>
          {funds.map((fund, index) => (
            <FundCard
              key={index}
              title={fund.title}
              amount={fund.amount}
              image={fund.image}
            />
          ))}
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => {
          // Handle edit profile
          navigation.navigate('EditProfileScreen');
        }}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
    <BottomNavBar navigation={navigation} activeScreen="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  leafLeft: {
    position: 'absolute',
    left: -15,
    top: '40%',
    width: 30,
    height: 30,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#4CAF50',
    transform: [{ rotate: '45deg' }],
    zIndex: 1,
  },
  leafRight: {
    position: 'absolute',
    right: -15,
    top: '40%',
    width: 30,
    height: 30,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#4CAF50',
    transform: [{ rotate: '-45deg' }],
    zIndex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fundsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  fundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fundCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  fundImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  fundInfo: {
    padding: 12,
  },
  fundTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fundAmount: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});