import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { createGame, editGame, fetchGame } from '../api';

const COLORS = {
    bg: '#1b2838',
    card: '#2a475e',
    inputBg: '#1b2838',
    accent: '#1a9fff',
    accentLight: '#66c0f4',
    text: '#c7d5e0',
    textDim: '#8f98a0',
    textBright: '#ffffff',
    border: '#3a5a75',
};

export default function InsertScreen({ navigation, route }) {
    const { id } = route.params ?? {};
    const isEditing = !!id;

    const [loading, setLoading] = useState(isEditing);
    const [error, setError] = useState(null);

    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('');
    const [ano, setAno] = useState('');
    const [desenvolvedora, setDesenvolvedora] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');

    useEffect(() => {
        if (!isEditing) return;

        let cancelled = false;

        fetchGame(id)
            .then((g) => {
                if (cancelled) return;
                setNome(g.nome ?? '');
                setGenero(g.genero ?? '');
                setAno(g.ano != null ? String(g.ano) : '');
                setDesenvolvedora(g.desenvolvedora ?? '');
                setDescricao(g.descricao ?? '');
                setPreco(g.preco != null ? String(g.preco) : '');
            })
            .catch((e) => { if (!cancelled) setError(e.message); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [id, isEditing]);

    const validate = () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'O campo "Nome" é obrigatório.');
            return null;
        }

        const anoNumber = ano.trim() === '' ? null : parseInt(ano, 10);
        if (ano.trim() !== '' && Number.isNaN(anoNumber)) {
            Alert.alert('Erro', 'O campo "Ano" deve ser um número.');
            return null;
        }

        let precoNumber = null;
        if (preco.trim() !== '') {
            // Accept both "4,97" and "4.97"
            precoNumber = parseFloat(preco.replace(',', '.'));
            if (Number.isNaN(precoNumber)) {
                Alert.alert('Erro', 'O campo "Preço" deve ser um número.');
                return null;
            }
        }

        return { anoNumber, precoNumber };
    };

    const handleSubmit = async () => {
        const valid = validate();
        if (!valid) return;

        try {
            const created = await createGame({
                nome,
                genero,
                ano: valid.anoNumber,
                desenvolvedora,
                descricao,
                preco: valid.precoNumber,
            });
            Alert.alert('Sucesso', `Jogo "${created.nome}" inserido com id ${created.id}.`);
            navigation.goBack();
        } catch (err) {
            Alert.alert('Erro', err.message);
        }
    };

    const handleEdit = async () => {
        const valid = validate();
        if (!valid) return;

        try {
            const updated = await editGame({
                id,
                nome,
                genero,
                ano: valid.anoNumber,
                desenvolvedora,
                descricao,
                preco: valid.precoNumber,
            });
            Alert.alert('Sucesso', `Jogo "${updated.nome}" editado.`);
            navigation.goBack();
        } catch (err) {
            Alert.alert('Erro', err.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.accentLight} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>
                {isEditing ? 'Editar Jogo' : 'Novo Jogo'}
            </Text>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Ex: Mineirinho Ultra Adventures"
                    placeholderTextColor={COLORS.textDim}
                />
            </View>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Gênero</Text>
                <TextInput
                    style={styles.input}
                    value={genero}
                    onChangeText={setGenero}
                    placeholder="Ex: Plataforma"
                    placeholderTextColor={COLORS.textDim}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.infoBlock, styles.half]}>
                    <Text style={styles.label}>Ano</Text>
                    <TextInput
                        style={styles.input}
                        value={ano}
                        onChangeText={setAno}
                        placeholder="Ex: 2017"
                        placeholderTextColor={COLORS.textDim}
                        keyboardType="numeric"
                    />
                </View>

                <View style={[styles.infoBlock, styles.half]}>
                    <Text style={styles.label}>Preço (R$)</Text>
                    <TextInput
                        style={styles.input}
                        value={preco}
                        onChangeText={setPreco}
                        placeholder="Ex: 4,97"
                        placeholderTextColor={COLORS.textDim}
                        keyboardType="decimal-pad"
                    />
                </View>
            </View>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Desenvolvedora</Text>
                <TextInput
                    style={styles.input}
                    value={desenvolvedora}
                    onChangeText={setDesenvolvedora}
                    placeholder="Ex: Blender_Master"
                    placeholderTextColor={COLORS.textDim}
                />
            </View>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Uma breve descrição do jogo"
                    placeholderTextColor={COLORS.textDim}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={isEditing ? handleEdit : handleSubmit}
            >
                <Text style={styles.buttonText}>
                    {isEditing ? 'Salvar Alterações' : 'Cadastrar Jogo'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: COLORS.bg },
    container: {
        padding: 24,
        paddingBottom: 48,
        backgroundColor: COLORS.bg,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    errorText: { color: COLORS.text },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textBright,
        marginBottom: 24,
        textAlign: 'center',
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },
    half: { flex: 1 },

    infoBlock: {
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    label: {
        fontSize: 12,
        color: COLORS.textDim,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 6,
        fontWeight: '700',
    },
    input: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textBright,
        paddingVertical: 4,
        paddingHorizontal: 0,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: 'top',
        fontWeight: '400',
        lineHeight: 22,
    },

    button: {
        marginTop: 16,
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});