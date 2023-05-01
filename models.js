const sqlite3 = require('sqlite3').verbose();

// Connexion la base de données
let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Base de données connectée.');
});

// Création de la table "users"
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)`);

// Modèle de données pour représenter un utilisateur
class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // Enregistrer un nouvel utilisateur dans la base de données
  save(callback) {
    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [this.name, this.email, this.password], function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`Utilisateur ${this.name} ajouté avec l'ID ${this.lastID}`);
      callback(null, this.lastID);
    });
  }

  // Rechercher tous les utilisateurs dans la base de données
  static findAll(callback) {
    db.all(`SELECT * FROM users`, [], function(err, rows) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      const users = rows.map(row => new User(row.name, row.email, row.password));
      callback(null, users);
    });
  }

  // Rechercher un utilisateur par ID dans la base de données
  static findById(id, callback) {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], function(err, row) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      if (!row) {
        return callback(new Error('Utilisateur non trouvé'));
      }
      const user = new User(row.name, row.email, row.password);
      callback(null, user);
    });
  }

  // Mettre à jour un utilisateur dans la base de données
  static updateById(id, name, email, password, callback) {
    db.run(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, [name, email, password, id], function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`Utilisateur avec l'ID ${id} mis à jour.`);
      callback(null);
    });
  }

  // Supprimer un utilisateur de la base de données
  static deleteById(id, callback) {
    db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`Utilisateur avec l'ID ${id} supprimé.`);
      callback(null);
    });
  }
}

module.exports = db;
