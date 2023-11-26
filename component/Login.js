import { Text, View, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

function loginReq(email, password) {
  const url = `https://mdljm.fr:8443/account/login?email=${encodeURI(email)}&password=${encodeURI(password)}`
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

const Login = ({ navigation: { navigate, replace }}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    if(isLoading) {
        return <View style={styles.loading_container}><ActivityIndicator size='large' /></View>
    }
    
    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token')
            if(value !== null) {
              replace("Profil")
            }
        } catch(e) {
            // error reading value
        }
    }
    getToken()
    return (
        <View style={styles.main_container}>
          <Text style={{fontSize: 17}}>Email:</Text>
          <TextInput
            textContentType={"emailAddress"}
            autoCorrect={false}
            autoCompleteType={"email"}
            keyboardType={"email-address"}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => setEmail(text)}
            value={email}
          />
          <Text style={{fontSize: 17}}>Mot de passe:</Text>
          <TextInput
            textContentType={"password"}
            secureTextEntry={true}
            autoCorrect={false}
            autoCompleteType={"password"}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <View style={styles.buttons}>
            <Button
              onPress={() => {
                setIsLoading(true)
                  loginReq(email, password).then(data => {
                    console.log(data)
                    if(!data.token){
                        setError("Erreur: vos identifiants ne fonctionnent pas.")
                        setIsLoading(false)
                    } else {
                      var _storeToken = async () => {
                        try {
                          await AsyncStorage.setItem(
                            'token',
                            `${data.token}`
                          );
                        } catch (error) {
                          setError(error)
                        }
                      };
                      _storeToken()
                      setIsLoading(false)
                      navigate("Porfil")
                    }
                  })
              }}
              title="Se connecter"
            />
            <Button
              onPress={() => {
                navigate("Register")
              }}
              title="Créer un compte ?"
            />
          </View>
          <Text>{error}</Text>
        </View>
      ) 
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
    margin: 10
  },
  buttons: {
    marginTop: 30,
    flexDirection:'row',
    justifyContent:'space-evenly'
  }
})

export default Login;