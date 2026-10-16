import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    port: "3307",
    user: 'root',
    password: 'admin',        // your MySQL password
    database: 'loja_jogos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const app = express();
app.use(cors());
app.use(express.json());

// Catalogue list — only what the catalogue screen needs
app.get('/api/jogos', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nome, ano, genero, preco FROM jogos'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch catalogue' });
    }
});

// Single game — everything for the details screen
app.get('/api/jogos/:id', async (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'Invalid id' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id,nome,genero,ano,desenvolvedora,descricao,preco FROM jogos WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

app.post('/api/jogos', async (req, res) => {
    const { nome,genero,ano,desenvolvedora,descricao,preco } = req.body;

    // `nome` is NOT NULL in your schema, so it's required
    if (!nome) {
        return res.status(400).json({ error: 'Field "nome" is required' });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO jogos (nome,genero,ano,desenvolvedora,descricao,preco)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [nome,genero ?? null ,ano ?? null ,desenvolvedora ?? null ,descricao ?? null ,preco ?? null ]
        );

        res.status(201).json({
            id: result.insertId,
            nome,
            genero,
            ano,
            desenvolvedora,
            descricao,
            preco
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to insert game' });
    }
});

app.put('/api/jogos', async (req, res) => {
    const { id, nome,genero,ano,desenvolvedora,descricao,preco } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Field "nome" is required' });
    }
    if (!id) {
        return res.status(400).json({ error: 'Como assim não tem ID?????' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE jogos
            SET nome = ?,
                genero = ?,
                preco = ?,
                ano = ?,
                desenvolvedora = ?,
                descricao = ?
            WHERE id = ?`,
            [nome, genero ?? null, preco ?? null, ano ?? null, desenvolvedora ?? null, descricao ?? null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json({ id, nome, genero, preco, ano, desenvolvedora, descricao });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to edit game' });
    }
});

app.delete('/api/jogos/:id', async (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'Invalid id' });
    }

    try {
        const [result] = await pool.query(
            'DELETE FROM jogos WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json({ message: 'Game deleted', id: Number(id) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete game' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});