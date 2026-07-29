const {db, Game, User, Review} = require('./models')

async function seed(){
    await db.sync({force:true})

const games = [
    {title: 'Mario Kart', genre: 'Racing', ESRB: 'E'},
    {title: 'Mario Party', genre: 'Party',},
    {title: 'Mario Bros.', genre: 'Platform',ESRB: 'E 10+'},
]

const users = [
    {username: 'CrimsonReaper44', platform: 'XBOX, PlayStation, Switch'},
    {username: 'AnnoyingGirlFromDR', platform: 'PlayStation'},
]

const reviews = [
    {description: 'mid', rating: 5, platform: 'switch', GameId: 3}
] 

await Game.bulkCreate(games); 
await User.bulkCreate(users);
await Review.bulkCreate(reviews);
console.log('Seeded!')
process.exit()
}

seed()