import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../src/services/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function handleCadastro() {
    try {
      await api.post("/usuarios", {
        nome,
        usuario,
        senha,
        tipo: "auxiliar"
      });

      Alert.alert("Auxiliar cadastrado com sucesso!");
      setNome(""); setUsuario(""); setSenha("");
    } catch (error) {
      Alert.alert("Erro ao cadastrar", "Esse terreiro já possui um auxiliar.");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28 }}>Cadastrar Auxiliar</Text>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ borderWidth: 1, padding: 10, marginTop: 20 }} />
      <TextInput placeholder="Usuário" value={usuario} onChangeText={setUsuario} style={{ borderWidth: 1, padding: 10, marginTop: 10 }} />
      <TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={{ borderWidth: 1, padding: 10, marginTop: 10 }} />

      <TouchableOpacity onPress={handleCadastro} style={{ backgroundColor: "#333", padding: 15, marginTop: 20 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
