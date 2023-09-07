const { Router } = require('express')
const { client } = require('../db/client')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "user"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: 503,
      msg: "Opps! An error has ocurred"
    }); // Error del servidor
  }
})

router.get('/withTasks', async (req, res) => {
  try {
    const results = await client.query('SELECT * FROM "user"');
    const userPromises = results.rows.map(async (user) => {
      const query = 'SELECT * FROM task WHERE user_id = $1';
      const result = await client.query(query, [user.id]);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        tasks: result.rows
      };
    });

    const usersWithTasks = await Promise.all(userPromises);
    res.json(usersWithTasks);
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: 503,
      msg: "Oops! An error has occurred"
    }); // Error del servidor
  }
});

router.get('/withTasks/:id', async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, t.id AS task_id, t.description AS task_description, t.state AS task_state
      FROM "user" AS u
      LEFT JOIN task AS t ON u.id = t.user_id
      WHERE u.id = $1;
    `;
    const result = await client.query(query, [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        error: 404,
        msg: "user not found"
      }); // No se encontró el usuario
    } else {
      res.json({
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        tasks: result.rows.map(row => ({
          id: row.task_id,
          description: row.task_description,
          state: row.task_state
        }))
      });
    }
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: 503,
      msg: "Opps! An error has ocurred"
    }); // Error del servidor
  }
});

router.get('/:id(\\d+)', async (req, res) => {
  try {
    const query = 'SELECT * FROM "user" WHERE id = $1';
    const result = await client.query(query, [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        error: 404,
        msg: "user not found"
      }); // No se encontró el usuario
    } else {
      res.json(result.rows[0])
    }
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: 503,
      msg: "Opps! An error has ocurred"
    }); // Error del servidor
  }
});

router.all('*', (req, res) => {
  res.status(404).json({
    error: 404,
    msg: "Oops! the route does not exists"
  });
})

module.exports = router