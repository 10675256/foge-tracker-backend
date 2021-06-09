const dbh = require("./DatabaseHandler")
let running = false

async function run() {
    try {
        if(!running){
            console.log("Running sync")
            running = true

            await dbh.coins.insertOne({dummy : "data"})

            running = false
        }
    } catch (error) {
        console.log(error)
        return false
    } 
}



module.exports = {
    run
}
