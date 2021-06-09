const dbh = require("./DatabaseHandler")
let running = false
let lastUpdate = new Date()
async function run() {
    try {
        if (!running && Date.now() - new Date(lastUpdate) >= 1000*5) {
            console.log("Running sync")
            running = true

            // await dbh.coins.insertOne({dummy : "data"})
            lastUpdate = Date.now()
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
