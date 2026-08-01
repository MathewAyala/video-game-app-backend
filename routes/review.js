const router = require('express').Router()
const {Game, Review} = require('../models') 

router.post("/:id/review", async (req, res, next) => {
  try {
    const {description, rating, platform} = req.body
    const id = Number(req.params.id);
    const game = await Game.findByPk(id, {
        include: Review
    })
    if(!game){
        throw new Error ("Game doesn't exist")
        return
    }
    const newReview = await Review.create({
        description,
        rating, 
        platform,
        GameId: game.id
  });
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/review", async (req, res, next) => {
  try {
    const {description, rating, platform} = req.body
    const id = Number(req.params.id);
    const game = await Game.findByPk(id);
    const reviewUpdate = await Review.update({description, rating, platform}, {where:{
      description
    }  });
    if(!game){
          throw new Error ("Game doesn't exist")
          return
    }
    res.status(200).json(reviewUpdate);
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

module.exports = router