import { View, ScrollView , Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";

function dataReq() {
  const url = `https://mdljm.fr:8443/data/getData`
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

const HomeScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    dataReq().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return <View style={styles.loading_container}><ActivityIndicator size='large' /></View>
  } else {
    return (
      <ScrollView style={{ flex: 1, margin: 20 }}>
        <Text style={{fontSize: 25}}>Comment jouer ?</Text>
        <Text style={{fontSize: 17}}>{data.howtoplay}</Text>
        <Text style={{fontSize: 25}}>Tranche de gagnant :</Text>
        <Text style={{fontSize: 17, marginBottom: 8}}>{data.prize}</Text>
        <Text style={{fontSize: 25 }}>Règlement :</Text>
        <Text style={{fontSize: 15}}>{data.rules}</Text>
        <Text style={{marginTop: 40}}>Site web développé par Eliott Bregere</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default HomeScreen;