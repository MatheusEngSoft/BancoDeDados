const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rota para obter todos os produtos
app.get('/produtos', (req, res) => {
  connection.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Rota para criar um novo produto
app.post('/produtos', (req, res) => {
  const { nome, preco, descricao, codBarras, quantidade } = req.body;

  if (!nome || !preco || !descricao || !codBarras || !quantidade) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ error: 'Preço deve ser um número positivo' });
  }

  const query = 'INSERT INTO produtos (nome, preco, descricao, codBarras) VALUES (?, ?, ?, ?)';
  const values = [nome, preco, descricao, codBarras, quantidade];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ id: results.insertId, message: 'Produto cadastrado com sucesso' });
  });
});

// Rota para editar um produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, codBarras, quantidade } = req.body;

  if (!nome || !preco || !descricao || !codBarras || !quantidade) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ error: 'Preço deve ser um número positivo' });
  }

  const query = 'UPDATE produtos SET nome = ?, preco = ?, descricao = ?, codBarras = ?, quantidade = ? WHERE id = ?';
  const values = [nome, preco, descricao, codBarras, quantidade, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso' });
  });
});

// Rota para excluir um produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM produtos WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto excluído com sucesso' });
  });
});

// Rota para obter todos os clientes
app.get('/clientes', (req, res) => {
  connection.query('SELECT * FROM cliente', (err, results) => {
    if (err) {
      console.error('Erro ao obter clientes:', err.message);
      return res.status(500).json({ error: 'Erro ao obter clientes' });
    }
    res.json(results);
  });
});

// Rota para obter um cliente por ID
app.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM cliente WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao obter cliente:', err.message);
      return res.status(500).json({ error: 'Erro ao obter cliente' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(results[0]);
  });
});

// Rota para cadastrar um novo cliente
app.post('/clientes', (req, res) => {
  const { nome, cpf, endereco, telefone } = req.body;

  if (!nome || !cpf || !endereco || !telefone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const query = 'INSERT INTO cliente (nome, cpf, endereco, telefone) VALUES (?, ?, ?, ?)';
  const values = [nome, cpf, endereco, telefone];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ id: results.insertId, message: 'Cliente cadastrado com sucesso' });
  });
});

// Rota para editar um cliente
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, cpf, endereco, telefone } = req.body;

  if (!nome || !cpf || !endereco || !telefone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const query = 'UPDATE cliente SET nome = ?, cpf = ?, endereco = ?, telefone = ? WHERE id = ?';
  const values = [nome, cpf, endereco, telefone, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente atualizado com sucesso' });
  });
});

// Rota para excluir um cliente
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM cliente WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente excluído com sucesso' });
  });
});

// Rota para criar um novo pedido
app.post('/pedidos', (req, res) => {
  const { cliente_id, data_pedido } = req.body;

  if (!cliente_id || !data_pedido) {
    return res.status(400).json({ error: 'Cliente e data do pedido são obrigatórios' });
  }

  const query = 'INSERT INTO pedido (cliente_id, data_pedido) VALUES (?, ?)';
  const values = [cliente_id, data_pedido];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ id: results.insertId, message: 'Pedido cadastrado com sucesso' });
  });
});

// Rota para editar um pedido
app.put('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { cliente_id, data_pedido } = req.body;

  if (!cliente_id || !data_pedido) {
    return res.status(400).json({ error: 'Cliente e data do pedido são obrigatórios' });
  }

  const query = 'UPDATE pedido SET cliente_id = ?, data_pedido = ? WHERE id = ?';
  const values = [cliente_id, data_pedido, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json({ message: 'Pedido atualizado com sucesso' });
  });
});

// Rota para excluir um pedido
app.delete('/pedidos/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM pedido WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json({ message: 'Pedido excluído com sucesso' });
  });
});

app.get('/estoques', (req, res) => {
  connection.query('SELECT * FROM estoque', (err, results) => {
    if (err) {
      console.error('Erro ao obter estoque:', err.message);
      return res.status(500).json({ error: 'Erro ao obter estoque' });
    }
    res.json(results);
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});