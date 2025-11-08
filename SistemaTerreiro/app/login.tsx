import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../src/services/api"; // se der erro, troque para "../../src/services/api"

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!usuario || !senha) return Alert.alert("Preencha todos os campos.");

    try {
      const response = await api.post("/login", { usuario, senha });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("usuario", JSON.stringify(response.data.usuario));

     router.replace("/(tabs)/perfil");


    } catch (error) {
      Alert.alert("Erro", "Usuário ou senha inválidos.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

     <TextInput
  placeholder="Usuário"
  style={styles.input}
  value={usuario}
  autoCapitalize="none"
  autoCorrect={false}
  onChangeText={text => setUsuario(text.trim())}
/>


     <TextInput
  placeholder="Senha"
  secureTextEntry
  style={styles.input}
  value={senha}
  autoCapitalize="none"
  autoCorrect={false}
  onChangeText={text => setSenha(text.trim())}
/>


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push("/cadastro")}>
  <Text style={styles.link}>Não possui cadastro? Criar conta</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30 },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 40, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginTop: 10 },
  button: { backgroundColor: "#2F4F4F", padding: 15, marginTop: 20, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  link: { marginTop: 25, textAlign: "center", color: "#007bff", fontWeight: "600" },
});
