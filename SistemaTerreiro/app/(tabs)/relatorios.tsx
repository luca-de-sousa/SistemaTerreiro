import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import api from "../../src/services/api";

export default function Relatorios() {
  const [usuario, setUsuario] = useState<any>(null);
  const [totais, setTotais] = useState({
    arrecadacao: 0,
    despesa: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (usuario) carregarRelatorio();
  }, [usuario]);

  async function carregarUsuario() {
    const userData = await AsyncStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }

  async function carregarRelatorio() {
    try {
      setLoading(true);
      const response = await api.get("/financas", {
        params: { id_usuario: usuario.id },
      });

      let totalArrecadacao = 0;
      let totalDespesa = 0;

      response.data.forEach((item: any) => {
        if (item.tipo === "arrecadacao") totalArrecadacao += parseFloat(item.valor);
        if (item.tipo === "despesa") totalDespesa += parseFloat(item.valor);
      });

      setTotais({
        arrecadacao: totalArrecadacao,
        despesa: totalDespesa,
        saldo: totalArrecadacao - totalDespesa,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#2F4F4F" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <Text style={styles.header}>Relatórios Financeiros</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Total de Arrecadações</Text>
            <Text style={[styles.valor, { color: "#228B22" }]}>
              R$ {totais.arrecadacao.toFixed(2)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Total de Despesas</Text>
            <Text style={[styles.valor, { color: "#B22222" }]}>
              R$ {totais.despesa.toFixed(2)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Saldo Final</Text>
            <Text
              style={[
                styles.valor,
                { color: totais.saldo >= 0 ? "#228B22" : "#B22222" },
              ]}
            >
              R$ {totais.saldo.toFixed(2)}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#2F4F4F",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#e1eeffff"
  },
  card: {
    backgroundColor: "#ffffffff",
    padding: 20,
    width: 300,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 8,
  },
  valor: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: "bold",
  },
});
