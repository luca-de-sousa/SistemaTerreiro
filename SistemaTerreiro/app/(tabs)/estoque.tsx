import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface EstoqueItem {
  id: number;
  produto: string;
  quantidade: number;
  origem: string;
  data_registro: string;
  anexo?: string | null;
}

export default function Estoque() {
  const [estoques, setEstoques] = useState<EstoqueItem[]>([]);
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [origem, setOrigem] = useState<"compra" | "doacao">("compra");
  const [anexo, setAnexo] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any | null>(null);
  const [editando, setEditando] = useState<EstoqueItem | null>(null);

  const API_URL = "http://192.168.12.135:8000/api";

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        const user = JSON.parse(usuarioJSON);
        setUsuario(user);
        carregarEstoques(user.id);
      } else {
        Alert.alert("Erro", "Usuário não encontrado no dispositivo.");
      }
    };
    carregarUsuario();
  }, []);

  const carregarEstoques = async (id_usuario: number) => {
    try {
      const response = await axios.get(`${API_URL}/estoque`, {
        params: { id_usuario },
      });
      setEstoques(response.data as EstoqueItem[]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro ao carregar", error.response?.data?.erro || "Erro desconhecido");
    }
  };

  const escolherImagem = async () => {
  Alert.alert(
    "Selecionar imagem",
    "Escolha de onde deseja obter a imagem:",
    [
      {
        text: "Câmera",
        onPress: async () => {
          const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPerm.granted) {
            return Alert.alert("Permissão negada", "Permita o acesso à câmera.");
          }

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
          });

          if (!result.canceled && result.assets.length > 0) {
            setAnexo(result.assets[0].uri);
          }
        },
      },
      {
        text: "Galeria",
        onPress: async () => {
          const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!galleryPerm.granted) {
            return Alert.alert("Permissão negada", "Permita o acesso à galeria.");
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
          });

          if (!result.canceled && result.assets.length > 0) {
            setAnexo(result.assets[0].uri);
          }
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]
  );
};


const atualizarImagemItem = async (item: EstoqueItem, modo: "camera" | "galeria") => {
  try {
    let result;
    if (modo === "camera") {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPerm.granted) {
        return Alert.alert("Permissão negada", "Permita o acesso à câmera.");
      }
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
    } else {
      const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!galleryPerm.granted) {
        return Alert.alert("Permissão negada", "Permita o acesso à galeria.");
      }
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
    }

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const nomeArquivo = uri.split("/").pop()!;
      const formData = new FormData();
      formData.append("id_usuario", String(usuario.id));
      formData.append("produto", item.produto);
      formData.append("quantidade", String(item.quantidade));
      formData.append("origem", item.origem);
      formData.append("_method", "PUT");
      formData.append("anexo", {
        uri,
        name: nomeArquivo,
        type: "image/jpeg",
      } as any);

      await axios.post(`${API_URL}/estoque/${item.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Sucesso", "Imagem atualizada com sucesso!");
      carregarEstoques(usuario.id);
    }
  } catch (error: any) {
    console.error(error);
    Alert.alert("Erro", error.response?.data?.erro || "Falha ao atualizar imagem.");
  }
};



  const salvarEstoque = async () => {
    if (!produto.trim() || !quantidade.trim()) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }
    if (!usuario) return Alert.alert("Erro", "Usuário não encontrado.");

    try {
      const formData = new FormData();
      formData.append("id_usuario", String(usuario.id));
      formData.append("produto", produto);
      formData.append("quantidade", quantidade);
      formData.append("origem", origem);

      if (anexo) {
        const nomeArquivo = anexo.split("/").pop()!;
        formData.append("anexo", {
          uri: anexo,
          name: nomeArquivo,
          type: "image/jpeg",
        } as any);
      }

   if (editando) {
  formData.append("_method", "PUT"); // 👈 Adiciona override corretamente
  await axios.post(`${API_URL}/estoque/${editando.id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  Alert.alert("Sucesso", "Item atualizado com sucesso!");
} else {
  await axios.post(`${API_URL}/estoque`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  Alert.alert("Sucesso", "Item adicionado!");
}


      setProduto("");
      setQuantidade("");
      setOrigem("compra");
      setAnexo(null);
      setEditando(null);
      carregarEstoques(usuario.id);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.response?.data?.erro || "Erro ao salvar item.");
    }
  };

  const editarItem = (item: EstoqueItem) => {
    setProduto(item.produto);
    setQuantidade(String(item.quantidade));
    setOrigem(item.origem as "compra" | "doacao");
    setEditando(item);
    setAnexo(item.anexo ? `${API_URL.replace("/api", "")}/storage/${item.anexo}` : null);
  };

  const excluirItem = async (id: number) => {
    Alert.alert("Confirmação", "Deseja realmente excluir este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/estoque/${id}`, {
              data: { id_usuario: usuario.id },
            });
            Alert.alert("Sucesso", "Item excluído com sucesso!");
            carregarEstoques(usuario.id);
          } catch (error: any) {
            console.error(error);
            Alert.alert("Erro", error.response?.data?.erro || "Não foi possível excluir o item.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Estoque</Text>

      {(usuario?.tipo === "adm" || usuario?.tipo === "auxiliar") && (
        <View style={styles.form}>
          <TextInput
            placeholder="Nome do produto"
            style={styles.input}
            value={produto}
            onChangeText={setProduto}
          />
          <TextInput
            placeholder="Quantidade"
            style={styles.input}
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[styles.option, origem === "compra" && styles.optionSelected]}
              onPress={() => setOrigem("compra")}
            >
              <Text style={origem === "compra" ? styles.optionTextSelected : styles.optionText}>
                Compra
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, origem === "doacao" && styles.optionSelected]}
              onPress={() => setOrigem("doacao")}
            >
              <Text style={origem === "doacao" ? styles.optionTextSelected : styles.optionText}>
                Doação
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.imageButton} onPress={escolherImagem}>
            <Text style={styles.imageButtonText}>
              {anexo ? "Alterar Imagem" : "Anexar Imagem"}
            </Text>
          </TouchableOpacity>

          {anexo && <Image source={{ uri: anexo }} style={styles.previewImage} />}

          <TouchableOpacity style={styles.button} onPress={salvarEstoque}>
            <Text style={styles.buttonText}>{editando ? "Salvar Alterações" : "Adicionar"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        style={{ marginTop: 12 }}
        data={estoques}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
        <View style={styles.item}>
  {item.anexo ? (
    <Image
      source={{ uri: `${API_URL.replace("/api", "")}/storage/${item.anexo}` }}
      style={styles.thumbnail}
    />
  ) : (
    <View
      style={[
        styles.thumbnail,
        { backgroundColor: "#EEE", justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Text style={{ color: "#666", fontSize: 12 }}>Sem Imagem</Text>
    </View>
  )}

  <View style={{ flex: 1, marginLeft: 10 }}>
    <Text style={styles.itemTitle}>{item.produto}</Text>
    <Text style={styles.itemSub}>Quantidade: {item.quantidade}</Text>
    <Text style={styles.itemSub}>Origem: {item.origem}</Text>
    <Text style={styles.itemSub}>
      {new Date(item.data_registro).toLocaleDateString("pt-BR")}
    </Text>

    {/* Botões dentro do card */}
    {(usuario?.tipo === "adm" || usuario?.tipo === "auxiliar") && (
      <View style={{ flexDirection: "row", marginTop: 6, gap: 8 }}>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: "#2E8B57" }]}
          onPress={() => atualizarImagemItem(item, "camera")}
        >
          <Text style={{ color: "#fff" }}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: "#4682B4" }]}
          onPress={() => atualizarImagemItem(item, "galeria")}
        >
          <Text style={{ color: "#fff" }}>🖼️</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>

  {usuario?.tipo === "adm" && (
    <View>
      <TouchableOpacity
        style={[styles.editButton, { marginBottom: 4 }]}
        onPress={() => editarItem(item)}
      >
        <Text style={styles.editText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => excluirItem(item.id)}
      >
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhum item encontrado.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FAFAFA" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#2F4F4F" },
  form: { marginVertical: 10 },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  smallButton: {
  width: 35,
  height: 35,
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
},
  option: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    marginRight: 8,
  },
  optionSelected: { backgroundColor: "#4A708B", borderColor: "#4A708B" },
  optionText: { color: "#333" },
  optionTextSelected: { color: "#fff", fontWeight: "600" },
  button: { backgroundColor: "#4A708B", padding: 12, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  imageButton: { backgroundColor: "#2F4F4F", padding: 10, borderRadius: 8, marginBottom: 8 },
  imageButtonText: { color: "#fff", textAlign: "center" },
  previewImage: { width: "100%", height: 150, borderRadius: 8, marginVertical: 10 },
  item: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  itemTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  itemSub: { color: "#555", fontSize: 13 },
  thumbnail: { width: 60, height: 60, borderRadius: 8 },
  editButton: { backgroundColor: "#1E90FF", padding: 6, borderRadius: 6 },
  editText: { color: "#fff", fontWeight: "600" },
  deleteButton: { backgroundColor: "#8B0000", padding: 6, borderRadius: 6 },
  deleteText: { color: "#fff", fontWeight: "600" },
});


