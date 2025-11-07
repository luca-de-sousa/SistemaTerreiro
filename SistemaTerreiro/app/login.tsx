import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../src/services/api";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!usuario || !senha) {
      return Alert.alert("Preencha todos os campos.");
    }

    try {
      const response = await api.post("/login", { usuario, senha });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      router.push("/home"); // ✅ AGORA FUNCIONA

    } catch (error) {
      Alert.alert("Erro no login", "Usuário ou senha incorretos.");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        style={{ borderWidth: 1, padding: 10, marginTop: 20 }}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "#333", padding: 15, marginTop: 20, borderRadius: 5 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/cadastro")} style={{ marginTop: 25 }}>
        <Text style={{ textAlign: "center", color: "#007bff", fontSize: 15 }}>
          Não é cadastrado? <Text style={{ fontWeight: "bold" }}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
