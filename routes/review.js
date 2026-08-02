const router = require("express").Router();
const { Game, Review } = require("../models");

router.post("/:GameId/review", async (req, res, next) => {
  try {
    const { description, rating, platform } = req.body;
    const id = Number(req.params.GameId);
    const game = await Game.findByPk(id, {
      include: Review,
    });
    if (!game) {
      throw new Error("Game doesn't exist");
      return;
    }
    const newReview = await Review.create({
      description,
      rating,
      platform,
      GameId: game.id,
    });
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

router.patch("/:GameId/review/:ReviewId", async (req, res, next) => {
  try {
    const GameId = Number(req.params.GameId);
    const ReviewId = Number(req.params.ReviewId);
    const review = await Review.findOne({
      where: {
        id: ReviewId,
        GameId: GameId,
      },
    });
    if (!review) {
      throw new Error("Review doesn't exist");
    }
    await review.update(req.body);
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
});

router.delete("/:GameId/review/:ReviewId", async (req, res, next) => {
    try {
    const GameId = Number(req.params.GameId);
    const ReviewId = Number(req.params.ReviewId);
    const review = await Review.findOne({
      where: {
        id: ReviewId,
        GameId: GameId,
      },
    });
    if (!review) {
      throw new Error("Review doesn't exist");
    }
    await review.destroy();
    res.status(204).json(review);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
