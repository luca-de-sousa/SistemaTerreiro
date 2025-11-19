import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import api from "../src/services/api";

export default function Cadastro() {
  const router = useRouter();

  const [dados, setDados] = useState({
    nome_terreiro: "",
    nome_adm: "",
    usuario_adm: "",
    senha_adm: "",
    nome_aux: "",
    usuario_aux: "",
    senha_aux: "",
  });

  function handleChange(campo: string, valor: string) {
    setDados({ ...dados, [campo]: valor });
  }

  async function handleCadastro() {
    if (!dados.nome_terreiro || !dados.nome_adm || !dados.usuario_adm || !dados.senha_adm) {
      return Alert.alert("Preencha ao menos os campos obrigatórios!");
    }

    try {
      await api.post("/cadastro", dados);

      Alert.alert("Sucesso!", "Cadastro realizado.");
      router.push("/login"); // ✅ volta para login
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={ styles.header1 }>Cadastro</Text>

      <Text style={styles.header2}>Dados do Terreiro</Text>
      <TextInput placeholder="Nome do Terreiro" style={ styles.input } onChangeText={(v) => handleChange("nome_terreiro", v)} />

      <Text style={styles.header2}>Administrador (Obrigatório)</Text>
      <TextInput placeholder="Nome" style={ styles.input } onChangeText={(v) => handleChange("nome_adm", v)} />
      <TextInput placeholder="Usuário" style={ styles.input } onChangeText={(v) => handleChange("usuario_adm", v)} />
      <TextInput placeholder="Senha" secureTextEntry style={ styles.input } onChangeText={(v) => handleChange("senha_adm", v)} />

      <Text style={styles.header2}>Auxiliar (Opcional)</Text>
      <TextInput placeholder="Nome" style={ styles.input } onChangeText={(v) => handleChange("nome_aux", v)} />
      <TextInput placeholder="Usuário" style={ styles.input } onChangeText={(v) => handleChange("usuario_aux", v)} />
      <TextInput placeholder="Senha" secureTextEntry style={ styles.input } onChangeText={(v) => handleChange("senha_aux", v)} />

      <TouchableOpacity onPress={handleCadastro} style={ styles.botao }>
        <Text style={{ textAlign: "center", fontWeight: "600", color: "#fff" }}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#e1eeffff"
  },
  header1: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 50,
    textAlign: "center"
  },
  header2: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: 12,
    borderColor: "#868686ff",
    borderRadius: 8,
    marginTop: 10
  },
  botao: {
    backgroundColor: "#2f8682ff",
    padding: 15,
    marginTop: 30,
    borderRadius: 5
  }
})