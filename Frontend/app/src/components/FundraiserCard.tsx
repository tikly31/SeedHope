import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { ProgressBar, MD3Colors } from 'react-native-paper';

interface FundraiserCardProps {
  title: string;
  progress: number; // Percentage
}


const FundraiserCard: React.FC<FundraiserCardProps> = ({ title, progress }) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/rockcms/2024-11/241109-gaza-05-aa-6f8a85.jpg' }}
      />
      <Text style={styles.title}>{title}</Text>
      <ProgressBar progress={0.5} color={MD3Colors.error50} />
      {/* <ProgressBarAndroid styleAttr="Horizontal" progress={progress / 100} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  image: {
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default FundraiserCard;
