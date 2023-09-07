const { Router } = require('express')
const { client } = require('../db/client')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "task"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: 503,
      msg: "Opps! An error has ocurred"
    }); // Error del servidor
  }
})

router.get('/:id', async (req, res) => {
  try {
    const query = 'SELECT * FROM "task" WHERE id = $1';
    const result = await client.query(query, [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        error: 404,
        msg: "user not found"
      }); // No se encontró el usuario
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: 503,
      msg: "Opps! An error has ocurred"
    }); // Error del servidor
  }
});

module.exports = router