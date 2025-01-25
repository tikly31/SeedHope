import type React from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient";

interface FundraiserCardProps {
  id: string
  title: string
  imageUri: string
  remainingAmount: number
  goalAmount: number
  raisedAmount: number
  onPress: (id: string) => void
}

const FundraiserCard: React.FC<FundraiserCardProps> = ({
  id,
  title,
  imageUri,
  remainingAmount,
  goalAmount,
  raisedAmount,
  onPress,
}) => {
  const progress = (raisedAmount / goalAmount) * 100

  const getProgressGradientColors = (progress: number) => {
    const progressColorStops = [
      { progress: 0, colors: ['#81C784', '#66BB6A', '#4CAF50'] },
      { progress: 33, colors: ['#66BB6A', '#43A047', '#388E3C'] },
      { progress: 66, colors: ['#43A047', '#2E7D32', '#1B5E20'] },
      { progress: 100, colors: ['#2E7D32', '#1B5E20', '#0A280A'] }
    ];

    let startStop = progressColorStops[0];
    let endStop = progressColorStops[1];

    for (let i = 0; i < progressColorStops.length - 1; i++) {
      if (progress >= progressColorStops[i].progress && progress <= progressColorStops[i + 1].progress) {
        startStop = progressColorStops[i];
        endStop = progressColorStops[i + 1];
        break;
      }
    }

    const factor = (progress - startStop.progress) / (endStop.progress - startStop.progress);

    const interpolateColor = (color1: string, color2: string, factor: number) => {
      const r1 = parseInt(color1.slice(1, 3), 16);
      const g1 = parseInt(color1.slice(3, 5), 16);
      const b1 = parseInt(color1.slice(5, 7), 16);
      
      const r2 = parseInt(color2.slice(1, 3), 16);
      const g2 = parseInt(color2.slice(3, 5), 16);
      const b2 = parseInt(color2.slice(5, 7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * factor);
      const g = Math.round(g1 + (g2 - g1) * factor);
      const b = Math.round(b1 + (b2 - b1) * factor);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    return [
      interpolateColor(startStop.colors[0], endStop.colors[0], factor),
      interpolateColor(startStop.colors[1], endStop.colors[1], factor),
      interpolateColor(startStop.colors[2], endStop.colors[2], factor),
    ];
  };

  const progressColors = getProgressGradientColors(progress);

  return (
    <TouchableOpacity 
      onPress={() => onPress(id)}
      activeOpacity={0.97}
    >
      <LinearGradient
        colors={['#F2F8F2', '#E8F3E8', '#DCE8DC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image 
          source={{ uri: imageUri }} 
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text 
              style={styles.cardTitle} 
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
          <Text style={styles.remainingAmount}>৳{remainingAmount.toLocaleString()} remaining</Text>
          <View style={styles.progressContainer}>
            <LinearGradient
              colors={progressColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { width: `${progress}%` }]}
            >
              <View style={styles.shine} />
            </LinearGradient>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.raisedAmount}>
              ৳{raisedAmount.toLocaleString()}
              <Text style={styles.raisedLabel}> raised</Text>
            </Text>
            <Text style={styles.goalAmount}>
              ৳{goalAmount.toLocaleString()}
              <Text style={styles.goalLabel}> goal</Text>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const { width } = Dimensions.get("window")
const cardWidth = width * 0.9

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 12,
    overflow: 'hidden',
    backgroundColor: '#fff', // Fallback color
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  titleContainer: {
    minHeight: 50,
    marginBottom: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 24,
    letterSpacing: 0.25,
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
    marginBottom: 16,
    letterSpacing: 0.15,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 4,
  },
  raisedAmount: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "700",
  },
  raisedLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  goalAmount: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  goalLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
})

export default FundraiserCard