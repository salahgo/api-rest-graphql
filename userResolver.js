// userResolver.js
const  db = require('./models');
// Implémentation des résolveurs GraphQL
const userResolver = {
    user: ({ id }) => {
      return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    },
    users: () => {
      return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
    addUser: ({ name, email, password }) => {
      return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, email, password });
          }
        });
      });
    }
  };

  module.exports = userResolver;