import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../../src/services/api";

export default function GerenciarAuxiliar() {
  const [usuario, setUsuario] = useState<any>(null);
  const [auxiliar, setAuxiliar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    usuario: "",
    senha: "",
  });

  useEffect(() => {
    carregarUsuario();
  }, []);

 async function carregarUsuario() {
  try {
    const userData = await AsyncStorage.getItem("usuario");
    if (userData) {
      const user = JSON.parse(userData);
      // 🔁 Garante compatibilidade: converte id_usuario → id
      const usuarioNormalizado = {
        ...user,
        id: user.id ?? user.id_usuario,
      };

      setUsuario(usuarioNormalizado);
      console.log("Usuário logado:", usuarioNormalizado);
      await carregarAuxiliar(usuarioNormalizado);
    }
  } catch (error) {
    console.log("Erro ao carregar usuário:", error);
  } finally {
    setLoading(false);
  }
}


  async function carregarAuxiliar(user: any) {
  try {
    const response = await api.get("/usuarios", {
      params: { id_usuario: user.id }, // ✅ usa o id real do usuário
    });

    const auxiliarEncontrado = response.data.find(
      (u: any) => u.tipo === "auxiliar"
    );

    setAuxiliar(auxiliarEncontrado || null);
  } catch (error) {
    console.log("Erro ao carregar auxiliar:", error);
  }
}


    async function salvarAuxiliar() {
    if (!form.nome || !form.usuario || (!auxiliar && !form.senha)) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
    }

    try {
      setLoading(true);

      if (auxiliar) {
        // Atualiza auxiliar existente
       await api.put(`/usuarios/${auxiliar.id}`, {
  id_usuario: usuario.id, // ✅ garante consistência
  nome: form.nome,
  usuario: form.usuario,
  senha: form.senha || undefined,
});


        Alert.alert("Sucesso", "Auxiliar atualizado com sucesso!");
      } else {
        // Cria novo auxiliar
       await api.post("/usuarios", {
  id_usuario: usuario.id, // ✅ mesmo ajuste
  nome: form.nome,
  usuario: form.usuario,
  senha: form.senha,
  tipo: "auxiliar",
});


        Alert.alert("Sucesso", "Auxiliar cadastrado com sucesso!");
      }

      setEditando(false);
      setForm({ nome: "", usuario: "", senha: "" });
      await carregarAuxiliar(usuario);
    } catch (error: any) {
      console.log(error.response?.data || error);
      Alert.alert(
        "Erro",
        error.response?.data?.erro || "Não foi possível salvar o auxiliar."
      );
    } finally {
      setLoading(false);
    }
  }

  async function excluirAuxiliar() {
    Alert.alert("Confirmação", "Deseja realmente remover este auxiliar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        onPress: async () => {
          try {
            setLoading(true);
            // ✅ Envia o id_usuario como query param explicitamente
           await api.delete(`/usuarios/${auxiliar.id}?id_usuario=${usuario.id}`);

            Alert.alert("Sucesso", "Auxiliar removido com sucesso!");
            setAuxiliar(null);
          } catch (error: any) {
            console.log("Erro ao remover:", error.response?.data || error);
            Alert.alert(
              "Erro",
              error.response?.data?.erro || "Não foi possível remover o auxiliar."
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2F4F4F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Gerenciar Auxiliar</Text>

        {auxiliar && !editando ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{auxiliar.nome}</Text>
            <Text style={styles.cardText}>Usuário: {auxiliar.usuario}</Text>
            <Text style={styles.cardText}>Senha: ********</Text>

            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#4A708B" }]}
                onPress={() => {
                  setEditando(true);
                  setForm({
                    nome: auxiliar.nome,
                    usuario: auxiliar.usuario,
                    senha: "",
                  });
                }}
              >
                <Text style={styles.smallButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#8B0000" }]}
                onPress={excluirAuxiliar}
              >
                <Text style={styles.smallButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do auxiliar"
              value={form.nome}
              onChangeText={(t) => setForm({ ...form, nome: t })}
            />

            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuário de login"
              value={form.usuario}
              onChangeText={(t) => setForm({ ...form, usuario: t })}
            />

            <Text style={styles.label}>
              {auxiliar ? "Nova Senha (opcional)" : "Senha"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={form.senha}
              onChangeText={(t) => setForm({ ...form, senha: t })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={salvarAuxiliar}>
              <Text style={styles.saveText}>
                {auxiliar ? "Salvar Alterações" : "Cadastrar Auxiliar"}
              </Text>
            </TouchableOpacity>

            {editando && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditando(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2F4F4F",
  },
  card: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  smallButton: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F4F4F",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#2F4F4F",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#999",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
