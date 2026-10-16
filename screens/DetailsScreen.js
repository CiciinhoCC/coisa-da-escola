import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { fetchGame } from '../api';

const COLORS = {
    bg: '#1b2838',            // Steam page background
    panel: '#16202d',         // darker panel
    card: '#2a475e',          // card surface
    cardHover: '#316282',
    accent: '#66c0f4',        // steam blue
    accentDark: '#1a9fff',
    green: '#a4d007',         // steam green price
    greenDark: '#7b9e0c',
    text: '#c7d5e0',          // primary text
    textDim: '#8f98a0',       // dim text
    danger: '#c2412d',
};

export default function DetailsScreen({ navigation, route }) {
    const { id } = route.params;
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchGame(id)
            .then((g) => { if (!cancelled) setGame(g); })
            .catch((e) => { if (!cancelled) setError(e.message); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [id]);

    const handleEdit = () => {
        navigation.navigate('Cadastrar', { id: id });
    };

    const handleDelete = async () => {
        try {
            await deleteGame(game.id);
            navigation.goBack();
        } catch (err) {
            Alert.alert('Erro', err.message);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.accent} />
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

    const preco = game.preco != null
        ? `R$ ${Number(game.preco).toFixed(2).replace('.', ',')}`
        : 'Grátis';

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.title}>{game.nome}</Text>
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{preco}</Text>
                </View>
            </View>

            <View style={styles.grid}>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Ano</Text>
                    <Text style={styles.value}>{game.ano ?? '—'}</Text>
                </View>

                <View style={styles.gridItem}>
                    <Text style={styles.label}>Gênero</Text>
                    <Text style={styles.value}>{game.genero ?? '—'}</Text>
                </View>
            </View>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Desenvolvedora</Text>
                <Text style={styles.value}>{game.desenvolvedora ?? '—'}</Text>
            </View>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Descrição</Text>
                <Text style={[styles.value, styles.description]}>
                    {game.descricao ?? '—'}
                </Text>
            </View>
            <View style={styles.grid}>
                {/* <View style={styles.gridItem}> */}
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleEdit}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                {/* </View> */}

                {/* <View style={styles.gridItem}> */}
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    <Text style={styles.buttonText}>Deletar</Text>
                </TouchableOpacity>
                {/* </View> */}
            </View>
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

    hero: {
        backgroundColor: COLORS.card,
        borderRadius: 4,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#00000030',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    priceTag: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.bg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: COLORS.greenDark,
    },
    priceText: {
        color: COLORS.green,
        fontWeight: 'bold',
        fontSize: 15,
    },

    grid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    gridItem: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 4,
        padding: 16,
        borderWidth: 1,
        borderColor: '#00000030',
    },

    infoBlock: {
        backgroundColor: COLORS.card,
        borderRadius: 4,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#00000030',
    },
    label: {
        fontSize: 12,
        color: COLORS.textDim,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 6,
        fontWeight: '700',
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 22,
    },


    // Buttons
    botoes: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    primaryButton: {
        backgroundColor: COLORS.accentDark,
    },
    secondaryButton: {
        backgroundColor: '#4c6b8a',
    },
    deleteButton: {
        backgroundColor: COLORS.danger,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
});