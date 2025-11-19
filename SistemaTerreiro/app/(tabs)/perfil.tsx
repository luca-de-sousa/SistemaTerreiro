import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
              <Text style={styles.buttonText}><Entypo name="box" size={24} color="white" /> Gerenciar Estoque</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/financas")}>
              <Text style={styles.buttonText}><MaterialIcons name="attach-money" size={24} color="white" /> Gerenciar Finanças</Text>
            </TouchableOpacity>

           <TouchableOpacity
  style={styles.button}
  onPress={() => router.push("/(tabs)/relatorios")}
>
  <Text style={styles.buttonText}><Entypo name="bar-graph" size={24} color="white" /> Relatórios</Text>
</TouchableOpacity>


          <TouchableOpacity
  style={styles.button}
  onPress={() => router.push("/(tabs)/gerenciarAuxiliar")}
>
  <Text style={styles.buttonText}><Entypo name="users" size={24} color="white" /> Gerenciar Auxiliar</Text>
</TouchableOpacity>

          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/estoque")}>
              <Text style={styles.buttonText}><Entypo name="box" size={24} color="white" /> Registrar Movimentação de Estoque</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(tabs)/financas")}
            >
              <Text style={styles.buttonText}><MaterialIcons name="attach-money" size={24} color="white" /> Consultar Finanças</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}><FontAwesome5 name="door-open" size={24} color="white" /> Sair do Aplicativo</Text>
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
    backgroundColor: "#e1eeffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F4F4F",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    color: "#20753dff",
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
    backgroundColor: "#356999ff",
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
