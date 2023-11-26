import React, {useState} from 'react';
import { Text, ScrollView, View, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

function registerReq(prenom, nom, email, type, password) {
    const url = `https://mdljm.fr:8443/account/register?prenom=${encodeURI(prenom)}&nom=${encodeURI(nom)}&email=${encodeURI(email)}&type=${encodeURI(type)}&password=${encodeURI(password)}`
    return fetch(url)
      .then((response) => response.json())
      .catch((error) => console.error(error))
}

const register = ({navigation: {navigate, replace}}) =>{
  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState("")
  const [errorServer, setErrorServer] = useState("")
  const [radio, setRadio] = useState("")
  const [isLoading, setIsLoading] = useState(false)

    if(isLoading) {
        return <View style={styles.loading_container}><ActivityIndicator size='large' /></View>
    }


  return (
    <ScrollView style={styles.main_container}>
      <Text style={{fontSize: 17}}>Prénom:</Text>
      <TextInput
        textContentType={"username"}
        autoCorrect={false}
        autoCompleteType={"username"}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setPrenom(text)}
        value={prenom}
      />
      <Text style={{fontSize: 17, marginTop: 25}}>Nom:</Text>
      <TextInput
        textContentType={"username"}
        autoCorrect={false}
        autoCompleteType={"username"}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setNom(text)}
        value={nom}
      />
      <Text style={{fontSize: 17, marginTop: 25}}>Email:</Text>
      <TextInput
        textContentType={"emailAddress"}
        autoCorrect={false}
        autoCompleteType={"email"}
        keyboardType={"email-address"}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <Text style={{fontSize: 17, marginTop: 25}}>Mot de passe:</Text>
      <TextInput
        textContentType={"password"}
        secureTextEntry={true}
        autoCorrect={false}
        autoCompleteType={"password"}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text =>{
          setPassword(text)
          if(password2 != text){
            setError("Vos mots de passe sont différents")
          } else {
            setError("")
          }
        }}
        value={password}
      />
      <Text style={{fontSize : 17, marginTop: 25}}>Réécrivez le mot de passe:</Text>
      <TextInput
        textContentType={"password"}
        secureTextEntry={true}
        autoCorrect={false}
        autoCompleteType={"password"}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => {
          setPassword2(text)
          if(password != text){
            setError("Vos mots de passe sont différents")
          } else {
            setError("")
          }
        }}
        value={password2}
      />
      <RadioGroup
        onSelect = {(index, value) => setRadio(value)}
      >
        <RadioButton value={'eleve'} >
          <Text>Elève</Text>
        </RadioButton>

        <RadioButton value={'prof'}>
          <Text>Professeur</Text>
        </RadioButton>

        <RadioButton value={'personnel'}>
          <Text>Personnel</Text>
        </RadioButton>
      </RadioGroup>
      <View style={{marginTop: 25, flexDirection:'row', justifyContent:'space-evenly'}}>
        <Button
        title="Créer le compte"
        onPress={() =>{
          if(error === "" && radio != ""){
            setIsLoading(true)
            registerReq(prenom, nom, email, radio, password).then(data => {
              if(!data.token){
                  setErrorServer("Une erreur c'est produite. détails: " + data.error)
                  setIsLoading(false)
              } else {
                var _storeToken = async () => {
                  try {
                    await AsyncStorage.setItem(
                      'token',
                      `${data.token}`
                    );
                  } catch (error) {
                    setErrorServer(error)
                  }
                };
                _storeToken()
                replace("Profil")
              }
          })
          }
        }}
        />
      </View>
      <Text style={{color: 'red'}}>{error}</Text>
      <Text style={{color: 'red'}}>{errorServer}</Text>
      <Text style={{fontSize: 9}}>Aucunes données personnelles ne sont collectées sauf celles rentrées pendant l'inscription. En cliquant sur "créer le compte" vous acceptez que vos données rentrées soit stocké et encrypté dans notre base de données.</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex:1,
    textAlign:'center',
    marginRight: 10,
    marginLeft: 10
  },
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

export default register