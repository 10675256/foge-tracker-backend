const createError  = require("http-errors")
const express      = require("express")
const path         = require("path")
const cookieParser = require("cookie-parser")
const logger       = require("morgan")
const bodyParser   = require("body-parser")
const dbh          = require("./DatabaseHandler")
const api          = require("./routes/api")
const sync         = require("./sync")
const port         = 3000

start(express())

async function start(app) {
    app.set("view engine", "pug")
    app.set("port", port)
    app.use(logger("dev"))
    app.use(bodyParser.urlencoded({ extended : false }))
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, "public")))
    app.use("/api", api)
    app.use(function (req, res, next) {
        next(createError(404))
    })

    app.use(function (err, req, res, next) {
        res.locals.message = err.message
        res.locals.error = req.app.get("env") === "development" ? err : {}
        res.status(err.status || 500)
        res.json(err)
    })
    
    await dbh.initialize()
    
    app.listen(port, () => {
        console.log("App started")
        dataSyncLoop()
        setTimeout( async () => {
            const coins = await dbh.coins.getCollection()
            console.log(coins)
        }, 10000)
    })
}

function dataSyncLoop(interval = 1000 * 10) {
      setInterval(async () => {
        try{
            await sync.run()           
        }catch(error){
            console.log(error)
        }
    }, interval)
}
  
