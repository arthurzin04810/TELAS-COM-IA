var sqlite3 = require('sqlite3');
var path = require('path');

var caminho = path.join(__dirname, 'banco.db');
var db = new sqlite3.Database(caminho);

db.serialize(function () {

  // Faz o SQLite validar as chaves estrangeiras.
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
   CREATE TABLE IF NOT EXISTS clientes (
cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
cliente_cpf TEXT NOT NULL UNIQUE,
cliente_telefone TEXT NOT NULL,
cliente_nome TEXT NOT NULL,
cliente_bairro TEXT NOT NULL,
cliente_cidade TEXT NOT NULL,
cliente_estado TEXT NOT NULL,
cliente_cep TEXT NOT NULL,
cliente_email TEXT NOT NULL UNIQUE
  )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
produto_id INTEGER PRIMARY KEY AUTOINCREMENT,
produto_descricao TEXT NOT NULL,
produto_valor TEXT NOT NULL,
produto_unidade TEXT not NULL
)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS movimento (
movimento_id INTEGER PRIMARY KEY,
cliente_id INTEGER NOT NULL,
movimento_data TEXT NOT NULL,
movimento_valor INTEGER NOT NULL,
FOREIGN KEY(cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
)
  `);

db.run(`
CREATE TABLE IF NOT EXISTS item_movimento(
 item_id INTEGER PRIMARY KEY,
 movimento_id TEXT NOT NULL,
 produto_id TEXT not NULL,
 item_numero INTEGER not NULL,
 item_quantdade INTEGER not NULL,
 item_desconto INTEGER not NULL,
 item_valor INTEGER not NULL,
 FOREIGN KEY(movimento_id) REFERENCES movimento(id) ON DELETE CASCADE,
 FOREIGN KEY(produto_id) REFERENCES produtos(id) ON DELETE CASCADE
)
 `);




});

module.exports = db;