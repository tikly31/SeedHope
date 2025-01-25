import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import CONFIG from "../screen/config";
const API_BASE_URL = CONFIG.API_BASE_URL;

interface DonationCardProps {
  title: string;
  onPress: () => void;
  currentAmount: number;
  totalAmount: number;
  dueDate: string;
}

const DonationCard = ({
  title,
  onPress,
  currentAmount,
  totalAmount,
  dueDate,
}: DonationCardProps) => {
  const progress = (currentAmount / totalAmount) * 100;

  // Calculate the number of days until the due date
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);
  const timeDifference = dueDateObj.getTime() - currentDate.getTime();
  const daysUntilDue = Math.ceil(timeDifference / (1000 * 3600 * 24));

  // Determine if the due date is within 3 days
  const isEmergency = daysUntilDue <= 3;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity style={styles.donateButton}>
          <Text style={styles.donateButtonText}>Donate</Text>
        </TouchableOpacity>
      </View>
      {isEmergency && <View style={styles.emergencyDot} />}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>
          ${currentAmount.toLocaleString()} raised of $
          {totalAmount.toLocaleString()}
        </Text>
        <Text style={styles.dueDateText}>Due by: {dueDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DonationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardContent: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    flex: 1,
    marginRight: 12,
  },
  emergencyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    alignSelf: "left",
    marginLeft: 20,
  },
  donateButton: {
    backgroundColor: "#3182CE",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 20,
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#48BB78",
  },
  cardFooter: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontSize: 14,
    color: "#2D3748",
  },
  dueDateText: {
    fontSize: 14,
    color: "#718096",
  },
});
