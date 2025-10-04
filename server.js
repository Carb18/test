const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a RDS
const db = mysql.createPool({
    host: "database.cream8us4sd0.eu-north-1.rds.amazonaws.com",
    user: "admin",
    password: "01005692",
    database: "wix_crud_test"
});

// GET usuarios
app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if(err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST nuevo usuario
app.post('/users', (req, res) => {
    const { name, email, role } = req.body;
    db.query("INSERT INTO users (name,email,role) VALUES (?,?,?)", [name,email,role], 
        (err, results) => {
            if(err) return res.status(500).json(err);
            res.json({ message: "User created", id: results.insertId });
    });
});

// PUT actualizar usuario
app.put('/users/:id', (req, res) => {
    const { name, email, role } = req.body;
    db.query("UPDATE users SET name=?, email=?, role=? WHERE id=?", [name,email,role, req.params.id], 
        (err, results) => {
            if(err) return res.status(500).json(err);
            res.json({ message: "User updated" });
    });
});

// DELETE usuario
app.delete('/users/:id', (req, res) => {
    db.query("DELETE FROM users WHERE id=?", [req.params.id], 
        (err, results) => {
            if(err) return res.status(500).json(err);
            res.json({ message: "User deleted" });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
