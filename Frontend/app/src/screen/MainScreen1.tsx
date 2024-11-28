import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Header from '../components/Header';
import Categories from '../components/Categories';
import FundraiserCard from '../components/FundraiserCard';
import Footer from '../components/Footer';

const MainScreen1 = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <Categories />
        <View style={styles.featured}>
            <FundraiserCard title="Save the Rainforest" progress={70} />
            <FundraiserCard title="Education for All" progress={50} />
            <FundraiserCard title="Help the Homeless" progress={30} />
            <FundraiserCard title="Feed the Hungry" progress={90} />
            <FundraiserCard title="Clean Water for All" progress={40} />
            <FundraiserCard title="Save the Bees" progress={60} />
            <FundraiserCard title="Support the Elderly" progress={80} />
            <FundraiserCard title="Protect the Oceans" progress={20} />
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  featured: { padding: 16 },
});

export default MainScreen1;