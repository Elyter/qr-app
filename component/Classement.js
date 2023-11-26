import { Text, View, StyleSheet, FlatList, ActivityIndicator, ScrollView, Button } from "react-native";
import {useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';


function classementReq() {
  const url = `https://mdljm.fr:8443/qrcode/classement`
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

const getClassement = async () => {
  const token = await AsyncStorage.getItem('token')
  const url = `https://mdljm.fr:8443/account/getClassement?token=${encodeURI(token)}`
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

const ClassementItem = (props) =>{
  if (props.position === 1) {
    return (
      <View style={{flexDirection: 'row', margin: 10, backgroundColor: '#d4ac0d'}}>
        <Text style={{fontSize: 15}}>{props.position}.  </Text>
        <Text style={{fontSize: 15, marginRight: 10}}>{props.prenom} {props.nom} 👑</Text>
        <Text style={{fontSize: 15, marginLeft: 'auto'}}>{props.points} Points</Text>
      </View>
    )
  } else if (props.position === 2 || props.position === 3) {
    return (
      <View style={{flexDirection: 'row', margin: 10, backgroundColor: '#aab7b8'}}>
        <Text style={{fontSize: 15}}>{props.position}.  </Text>
        <Text style={{fontSize: 15, marginRight: 10}}>{props.prenom} {props.nom}</Text>
        <Text style={{fontSize: 15, marginLeft: 'auto'}}>{props.points} Points</Text>
      </View>
    )
  } else if (props.position > 3 && props.position <= 15) {
    return (
      <View style={{flexDirection: 'row', margin: 10, backgroundColor: '#e59866'}}>
        <Text style={{fontSize: 15}}>{props.position}.  </Text>
        <Text style={{fontSize: 15, marginRight: 10}}>{props.prenom} {props.nom}</Text>
        <Text style={{fontSize: 15, marginLeft: 'auto'}}>{props.points} Points</Text>
      </View>
    )
  } else {
    return (
      <View style={{flexDirection: 'row', margin: 10}}>
        <Text style={{fontSize: 15}}>{props.position}.  </Text>
        <Text style={{fontSize: 15, marginRight: 10}}>{props.prenom} {props.nom}</Text>
        <Text style={{fontSize: 15, marginLeft: 'auto'}}>{props.points} Points</Text>
      </View>
    )
  }
}

const Classement = ({ navigation: { navigate, replace } }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [rank, setRank] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
    let eventDate = new Date("2022-04-08T06:00:00.000Z");
    let difference = eventDate - new Date();
    if(difference < 1) {
      setTimeUp(true);
    } else {
      let days = Math.floor(difference / (1000 * 60 * 60 * 24));
      let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((difference / 1000 / 60) % 60);
      let seconds = Math.floor((difference / 1000) % 60);
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }
    }, 1000);
  }, []);
  if (timeUp) {
    if(isLoading){
      classementReq().then(data => {
        setData(data.classement)
      })
      getClassement().then(data => {
        setRank(data.rank)
      })
      setIsLoading(false)
      return <View style={styles.loading_container}><ActivityIndicator size='large' /></View>
    } else {
      return (
        <ScrollView style={styles.classement}>
          
          <View style={styles.buttons}>
          <Text>Votre rang est: {rank}</Text>
                <Button
                onPress={() => {
                  setIsLoading(true)
                }}
                title="🔁"
                />
            </View>
          <FlatList data={data} renderItem={({ item }) => <ClassementItem position={item.position} prenom={item.prenom} nom={item.nom} points={item.points}/>}/>
        </ScrollView>
      );
    }
  } else {
  return(
    <View style={styles.main_container}>
        <Text style={{marginBottom: 10}}>Bientôt ! 😉</Text>
        <Text>{days} Jours {hours} Heures {minutes} minutes {seconds} secondes</Text>
    </View>
  )
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
  },
  main_container: {
    flex:1,
    textAlign:'center',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttons: {
    marginTop: 30,
    flexDirection:'row',
    justifyContent:'space-evenly'
  }
})

export default Classement;