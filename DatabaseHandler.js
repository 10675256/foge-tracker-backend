require("dotenv").config()
const { MongoClient } = require("mongodb")
const uri = encodeURI(`${process.env.DB_PROTOCOL}${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/?${process.env.DB_QUERY}`)

class DatabaseHandler {
    constructor() {
        console.log(uri)
        this.client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    }
    
    initialize() {
        return new Promise((resolve, reject) => {
            this.client.connect().then(() => {
                if(process.env.DEV_MODE){
                    console.log(uri)
                }

                this.db = this.client.db(process.env.MONGODB_DATABASE)
                this.setCollections()

                resolve()
            })
            .catch(err => {
                reject(err)
            })
        })
    }

    setCollections(){
        this.users = new Collection(this.db, "users")
        this.user_coins = new Collection(this.db, "user_coins")
        this.coins = new Collection(this.db, "coins")
        this.coins_price_data = new Collection(this.db, "coins_price_data")
    }
}

class Collection {
    constructor(db, collectionName) {
        this.data = db.collection(collectionName)
    }

    insertOne(data){
        return this.data.insertOne(data)
    }

    updateOne(filter, update, options = { upsert: true }){
        return this.data.updateOne(filter, update, options)
    }

    findOne (filter) {
        return this.data.findOne(filter)
    }

    findMany(filter){
        return this.data.find(filter)
    } 
    
    getCollection () {
        return this.data.find().toArray()
    }
}

module.exports = new DatabaseHandler()
