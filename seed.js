const {db, Game, User, Review} = require('./models')

async function seed(){
    await db.sync({force:true})

const games = [
    {title: 'Mario Kart', genre: 'Racing', ESRB: 'E'},
    {title: 'Mario Party', genre: 'Party',},
    {title: 'Mario Bros.', genre: 'Platform',ESRB: 'E 10+'},
]
//name, username, email
// const users = [
//     {name: 'Mathew', username: 'CrimsonReaper44', email: 'mathew@example.com' },
//     {name: 'Yomi', username: 'AnnoyingGirlFromDR', email: 'yomi@example.com' },
// ]

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