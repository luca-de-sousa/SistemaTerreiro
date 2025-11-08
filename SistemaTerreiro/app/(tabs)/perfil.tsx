import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        setUsuario(JSON.parse(usuarioJSON));
      } else {
        router.replace("/login");
      }
    };
    carregarUsuario();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("usuario");
    router.replace("/login");
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{usuario.nome_terreiro}</Text>
      <Text style={styles.subtitle}>Bem-vindo(a), {usuario.nome}!</Text>
      <Text style={styles.info}>
        Você está logado como{" "}
        <Text style={styles.bold}>{usuario.tipo === "adm" ? "Administrador" : "Auxiliar"}</Text>
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações disponíveis</Text>

        {usuario.tipo === "adm" ? (
          <>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/estoque")}>
              <Text style={styles.buttonText}>Gerenciar Estoque</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/financas")}>
              <Text style={styles.buttonText}>Gerenciar Finanças</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("Em breve", "Área de Relatórios ainda será implementada.")}
            >
              <Text style={styles.buttonText}>Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("Em breve", "Gestão de Auxiliares ainda será implementada.")}
            >
              <Text style={styles.buttonText}>Gerenciar Auxiliares</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/estoque")}>
              <Text style={styles.buttonText}>Registrar Movimentação de Estoque</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(tabs)/financas")}
            >
              <Text style={styles.buttonText}>Consultar Finanças</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair do Aplicativo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F4F4F",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  info: {
    marginTop: 5,
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  section: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4A708B",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: "85%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#8B0000",
    marginTop: 50,
  },
});
