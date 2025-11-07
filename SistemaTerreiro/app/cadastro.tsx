import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
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
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Cadastro</Text>

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Dados do Terreiro</Text>
      <TextInput placeholder="Nome do Terreiro" style={{ borderWidth: 1, padding: 8 }} onChangeText={(v) => handleChange("nome_terreiro", v)} />

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Administrador (Obrigatório)</Text>
      <TextInput placeholder="Nome" style={{ borderWidth: 1, padding: 8 }} onChangeText={(v) => handleChange("nome_adm", v)} />
      <TextInput placeholder="Usuário" style={{ borderWidth: 1, padding: 8, marginTop: 10 }} onChangeText={(v) => handleChange("usuario_adm", v)} />
      <TextInput placeholder="Senha" secureTextEntry style={{ borderWidth: 1, padding: 8, marginTop: 10 }} onChangeText={(v) => handleChange("senha_adm", v)} />

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Auxiliar (Opcional)</Text>
      <TextInput placeholder="Nome" style={{ borderWidth: 1, padding: 8 }} onChangeText={(v) => handleChange("nome_aux", v)} />
      <TextInput placeholder="Usuário" style={{ borderWidth: 1, padding: 8, marginTop: 10 }} onChangeText={(v) => handleChange("usuario_aux", v)} />
      <TextInput placeholder="Senha" secureTextEntry style={{ borderWidth: 1, padding: 8, marginTop: 10 }} onChangeText={(v) => handleChange("senha_aux", v)} />

      <TouchableOpacity onPress={handleCadastro} style={{ backgroundColor: "#333", padding: 15, marginTop: 30, borderRadius: 5 }}>
        <Text style={{ textAlign: "center", color: "#fff" }}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
