import type React from "react"
import { View, Text, Image, StyleSheet } from "react-native"

interface DonationItemProps {
  title: string
  donatedAmount: number
  status: "SUCCESS" | "FAIL"
  imageUrl: string
}

const DonationItem: React.FC<DonationItemProps> = ({ title, donatedAmount, status, imageUrl }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>Donated: ৳{donatedAmount.toLocaleString()}</Text>
        <Text style={[styles.status, status === "SUCCESS" ? styles.successStatus : styles.failureStatus]}>
          {status === "SUCCESS" ? "Success" : "Failure"}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  amount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  successStatus: {
    color: "#4CAF50",
  },
  failureStatus: {
    color: "#F44336",
  },
})

export default DonationItem

