import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../src/services/api";

export default function Financas() {
    const [editando, setEditando] = useState<any>(null);
const baseURL = api.defaults?.baseURL?.replace('/api', '') ?? '';

  const [financas, setFinancas] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data: "",
    anexo: null as any,
  });

  useEffect(() => {
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (usuario) carregarFinancas();
  }, [usuario]);

  async function carregarUsuario() {
    const userData = await AsyncStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }

  async function carregarFinancas() {
    try {
      const response = await api.get("/financas", {
        params: { id_usuario: usuario.id },
      });
      setFinancas(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar as finanças.");
    }
  }

  function formatarDataBR(data: Date) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataISO(data: string) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  async function escolherAnexo() {
    Alert.alert("Selecionar anexo", "Escolha o tipo de arquivo:", [
      {
        text: "Imagem",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
          });
          if (!result.canceled) {
            setForm({ ...form, anexo: result.assets[0] });
          }
        },
      },
      {
        text: "PDF",
        onPress: async () => {
          const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
          });
          if (result.assets && result.assets.length > 0) {
            setForm({ ...form, anexo: result.assets[0] });
          }
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  async function salvarFinanca() {
  if (!form.tipo || !form.descricao || !form.valor || !form.data)
    return Alert.alert("Preencha todos os campos obrigatórios.");

  const data = new FormData();
  data.append("id_usuario", usuario.id);
  data.append("tipo", form.tipo);
  data.append("descricao", form.descricao);
  data.append("valor", form.valor);
  data.append("data", formatarDataISO(form.data));

  if (form.anexo) {
    const nomeArquivo = form.anexo.name || "anexo";
    const tipoArquivo = form.anexo.mimeType || "application/octet-stream";
    data.append("anexo", {
      uri: form.anexo.uri,
      name: nomeArquivo,
      type: tipoArquivo,
    } as any);
  }

  try {
    setLoading(true);
    if (editando) {
      // 🔹 Atualiza
      await api.post(`/financas/${editando.id}?_method=PUT`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Sucesso", "Registro atualizado!");
    } else {
      // 🔹 Cria novo
      await api.post("/financas", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Sucesso", "Movimentação registrada!");
    }

    setModalVisible(false);
    setEditando(null);
    setForm({ tipo: "", descricao: "", valor: "", data: "", anexo: null });
    carregarFinancas();
  } catch (error) {
    console.log(error);
    Alert.alert("Erro", "Não foi possível salvar o registro.");
  } finally {
    setLoading(false);
  }
}

  async function excluirFinanca(id: number) {
    Alert.alert("Excluir", "Deseja excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            await api.delete(`/financas/${id}`, {
              params: { id_usuario: usuario.id },
            });
            carregarFinancas();
          } catch (error) {
            Alert.alert("Erro", "Você não tem permissão para excluir.");
          }
        },
      },
    ]);
  }

 const renderItem = ({ item }: any) => (
  <View style={styles.card}>
    <View style={{ flex: 1, width: "100%" }}>
      <Text style={styles.tipo}>
        {item.tipo === "arrecadacao"
          ? "🟢 Arrecadação"
          : item.tipo === "despesa"
          ? "🔴 Despesa"
          : item.tipo === "estoque_entrada"}
      </Text>

      <Text style={styles.desc}>{item.descricao}</Text>
      <Text style={styles.valor}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
      <Text style={styles.data}>
        {new Date(item.data).toLocaleDateString("pt-BR")}
      </Text>

      {/* 🖼️ Mostra imagem ou ícone do PDF */}
      {item.anexo && item.anexo.endsWith(".pdf") ? (
        <Ionicons
          name="document-text"
          size={60}
          color="#2F4F4F"
          style={{ alignSelf: "center", marginVertical: 8 }}
        />
      ) : item.anexo ? (
        <Image
          source={{ uri: `${baseURL}/storage/${item.anexo}` 
 }}
          style={{
            width: "100%",
            height: 150,
            borderRadius: 8,
            marginVertical: 8,
          }}
          resizeMode="cover"
        />
      ) : null}

      {/* 📎 Botão para abrir o anexo */}
      {item.anexo && (
      <TouchableOpacity
  onPress={() =>
   Linking.openURL(`${baseURL}/storage/${item.anexo}`)
  }
>
  <Text style={{ color: "#007BFF", textAlign: "center" }}>📎 Ver Anexo</Text>
</TouchableOpacity>

      )}

      {/* ✏️ Botões de ação (somente ADM) */}
      {usuario?.tipo === "adm" && (
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}>
          <TouchableOpacity
            style={styles.editarBtn}
            onPress={() => {
              setEditando(item);
              setForm({
                tipo: item.tipo,
                descricao: item.descricao,
                valor: String(item.valor),
                data: new Date(item.data).toLocaleDateString("pt-BR"),
                anexo: null,
              });
              setModalVisible(true);
            }}
          >
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.excluirBtn}
            onPress={() => excluirFinanca(item.id)}
          >
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e1eeffff" }}>
      <Text style={styles.header}>Gestão Financeira</Text>

      <FlatList
        data={financas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {usuario?.tipo === "adm" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
  setEditando(null);
  setForm({ tipo: "", descricao: "", valor: "", data: "", anexo: null });
  setModalVisible(true);
}}

        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* MODAL DE CADASTRO */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Nova Movimentação</Text>

          <Text style={styles.label}>Tipo</Text>
          <Picker
            selectedValue={form.tipo}
            onValueChange={(itemValue) => setForm({ ...form, tipo: itemValue })}
            style={styles.input}
          >
            <Picker.Item label="Selecione o tipo" value="" />
            <Picker.Item label="Arrecadação" value="arrecadacao" />
            <Picker.Item label="Despesa" value="despesa" />
          </Picker>

          <TextInput
            placeholder="Descrição"
            style={styles.input}
            value={form.descricao}
            onChangeText={(text) => setForm({ ...form, descricao: text })}
          />

          <TextInput
            placeholder="Valor (R$)"
            style={styles.input}
            keyboardType="numeric"
            value={form.valor}
            onChangeText={(text) => setForm({ ...form, valor: text })}
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{form.data || "Selecionar Data"}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setForm({ ...form, data: formatarDataBR(date) });
                }
              }}
            />
          )}

          <TouchableOpacity style={styles.imageButton} onPress={escolherAnexo}>
            <Ionicons name="attach" size={22} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 6 }}>Selecionar anexo</Text>
          </TouchableOpacity>

         {form.anexo && (
  <View style={{ alignItems: "center", marginVertical: 10 }}>
    {form.anexo.mimeType?.includes("image") ? (
      <Image
        source={{ uri: form.anexo.uri }}
        style={{
          width: "100%",
          height: 150,
          borderRadius: 8,
          marginVertical: 8,
        }}
        resizeMode="cover"
      />
    ) : (
      <Text>📄 {form.anexo.name}</Text>
    )}
  </View>
)}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={salvarFinanca}
            disabled={loading}
          >
            <Text style={styles.saveText}>
              {loading ? "Salvando..." : "Salvar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    color: "#2F4F4F",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2F4F4F",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  tipo: { fontWeight: "bold", color: "#2F4F4F" },
  desc: { color: "#333", marginTop: 4 },
  valor: { color: "#007BFF", marginTop: 4, fontWeight: "bold" },
  data: { color: "#666", fontSize: 12 },
  imagem: { width: 50, height: 50, borderRadius: 6, marginLeft: 10 },
  excluirBtn: {
    backgroundColor: "#B22222",
    padding: 6,
    borderRadius: 8,
    marginLeft: 10,
  },editarBtn: {
  backgroundColor: "#2F4F4F",
  padding: 6,
  borderRadius: 8,
  marginLeft: 10,
},
  addButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#2F4F4F",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2F4F4F",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    marginVertical: 10,
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#2F4F4F",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  cancelButton: { marginTop: 10, alignItems: "center" },
  cancelText: { color: "#B22222", fontWeight: "bold" },
});
