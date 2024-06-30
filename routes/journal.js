const Router = require('koa-router');
const { Journal, User } = require('../models');
const authMiddleware = require('../middlewares/auth');
const {where} = require("sequelize");
const { Op } = require('sequelize');

const router = new Router();

// Create a new journal entry
router.post('/journals', authMiddleware, async (ctx) => {
  try {
    const { content, mood } = ctx.request.body;

    const userId = ctx.state.user.userId

    const user = await User.findOne({
      where: {
        userId
      }
    })

    const newJournal = await Journal.create({
      userId,
      author: user.username,
      content,
      mood
    });

    ctx.status = 201;
    ctx.body = newJournal;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'An error occurred while creating the journal entry.', error };
  }
});

// Fetch all journal entries
router.get('/journals', authMiddleware, async (ctx) => {
  try {
    const userId = ctx.state.user.userId;
    const { startDate, endDate } = ctx.query;

    let where = { userId };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.gte]: new Date(startDate),
        [Op.lt]: new Date(endDate)
      };
    }

    const journals = await Journal.findAll({ where });

    ctx.body = journals;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'An error occurred while fetching the journal entries.', error };
  }
});

// Fetch a journal entry by ID
router.get('/journals/:id', authMiddleware, async (ctx) => {
  try {
    const id = ctx.params.id;
    const journal = await Journal.findByPk(id);

    if (!journal) {
      ctx.status = 404;
      ctx.body = { message: 'Journal entry not found' };
      return;
    }

    ctx.body = journal;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'An error occurred while fetching the journal entry.', error };
  }
});

module.exports = router;
