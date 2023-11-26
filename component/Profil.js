import { View, Text, Button, StyleSheet } from "react-native";
import React, {useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

function infoReq(token) {
    const url = `https://mdljm.fr:8443/account/info?token=${encodeURI(token)}`
    return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}
   
const Profil = ({ navigation: { navigate, replace } }) => {
    const [prenom, setPrenom] = useState("Chargement en cours...")
    const [nom, setNom] = useState("Chargement en cours...")
    const [email, setEmail] = useState("Chargement en cours...")
    const [points, setPoints] = useState("Chargement en cours...")
    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token')
            if(value !== null) {
                infoReq(value).then(data => {
                    setPrenom(data.prenom)
                    setNom(data.nom)
                    setEmail(data.email)
                    setPoints(data.points)
                })
            } else {
                replace("Login")
            }
        } catch(e) {
            navigate("Login")
        }
    }
    getToken()
    return (
        <View style={styles.main_container}>
            <View  style={styles.text}>
                <Text>Nom: {nom}</Text>
                <Text>Prénom: {prenom}</Text>
                <Text>Email: {email}</Text>
                <Text>Points: {points}</Text>
            </View>
            <View style={styles.buttons}>
                <Button
                onPress={() => {
                    AsyncStorage.removeItem('token')
                    replace("Login")
                }}
                title="Se déconnecter"
                />
            </View>
        </View>
      )
    }

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    text: {
        margin: 10,
    },
    buttons: {
        marginTop: 30,
        flexDirection:'row',
        justifyContent:'space-evenly'
    }
})
    
    
export default Profil;