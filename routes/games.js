const router = require("express").Router();
const { Game, User, Review } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const games = await Game.findAll();
    res.status(200).json(games);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const game = await Game.findByPk(id, {
      include: Review,
    });
    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, genre, ESRB } = req.body;
    const newGame = await Game.create({
      title,
      genre,
      ESRB,
    });
    res.status(201).json(newGame);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updatedGame = await Game.findByPk(id);
    await updatedGame.update(req.body);
    // await updatedGame.save(Game) //I guess we dont need this
    res.status(200).json(updatedGame);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const game = await Game.findByPk(id, {
      include: Review,
    });
    await game.destroy();
    res.sendStatus(410);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
