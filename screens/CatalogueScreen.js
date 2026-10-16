import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Pressable,
    Alert,
} from 'react-native';
import { deleteGame, fetchCatalogue } from '../api';

function GameCard({ game, onPress, edit, deletar }) {
    const preco = game.preco != null
        ? `R$ ${Number(game.preco).toFixed(2).replace('.', ',')}`
        : 'Grátis';

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{game.nome}</Text>
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{preco}</Text>
                </View>
            </View>

            <Text style={styles.cardText}>
                <Text style={styles.label}>Ano: </Text>{game.ano}
            </Text>
            <Text style={styles.cardText}>
                <Text style={styles.label}>Gênero: </Text>{game.genero}
            </Text>
            {game.desenvolvedora && (
                <Text style={styles.cardText}>
                    <Text style={styles.label}>Desenvolvedora: </Text>{game.desenvolvedora}
                </Text>
            )}

            <View style={styles.botoes}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => onPress(game)}
                >
                    <Text style={styles.buttonText}>Ver Detalhes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => edit(game)}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deletar(game)}
                >
                    <Text style={styles.buttonText}>Deletar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function CatalogueScreen({ navigation }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadGames = () => {
        setLoading(true);
        fetchCatalogue()
            .then(setGames)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadGames);
        return unsubscribe;
    }, [navigation]);

    const handlePress = (game) => {
        navigation.navigate('Detalhes', { id: game.id, nome: game.nome });
    };

    const handleEdit = (game) => {
        navigation.navigate('Cadastrar', { id: game.id });
    };

    const handleDelete = async(game) => {
        try {
            await deleteGame(game.id);
            setGames((prev) => prev.filter((g) => g.id !== game.id));
        } catch (err) {
            Alert.alert('Erro', err.message);
        }
    }

const cadastrar = () => {
    navigation.navigate('Cadastrar', { id: null });
};

if (loading) {
    return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#66c0f4" />
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
    <View style={styles.container}>
        <Pressable
            onPress={cadastrar}
            style={({ pressed }) => [
                styles.cadastrar,
                pressed && styles.cadastrarPressed,
            ]}
        >
            <Text style={styles.cadastrarText}>+ Cadastrar Jogo</Text>
        </Pressable>

        <FlatList
            data={games}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <GameCard
                    game={item}
                    onPress={handlePress}
                    edit={handleEdit}
                    deletar={handleDelete}
                />
            )}
            contentContainerStyle={styles.list}
        />
    </View>
);
}

// Steam-like palette
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    errorText: { color: COLORS.text },
    list: {
        padding: 16,
        paddingBottom: 32,
    },

    // "Cadastrar" call to action at the top
    cadastrar: {
        backgroundColor: COLORS.accentDark,
        paddingVertical: 14,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 4,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cadastrarPressed: {
        backgroundColor: COLORS.accent,
    },
    cadastrarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    // Card — Steam-like surface
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 4,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#00000030',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        paddingRight: 8,
    },
    cardText: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    label: {
        color: COLORS.textDim,
        fontWeight: '600',
    },
    priceTag: {
        backgroundColor: COLORS.panel,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: COLORS.greenDark,
    },
    priceText: {
        color: COLORS.green,
        fontWeight: 'bold',
        fontSize: 13,
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