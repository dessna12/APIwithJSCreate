require('babel-register')

const  express = require('express')

const morgan = require('morgan')('dev')
const {success, error, checkAndChange} = require('./assets/functions')
const bodyParser = require('body-parser')
const config = require('./assets/config')
const mysql = require('promise-mysql')
//const expressOasGenerator = require('express-oas-generator')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument =require('./assets/swagger.json')

mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    port: config.db.port
}).then((db) => {

    console.log('Connecté à mysql')
            
        const app = express()

        //Generation de Doc Swagger en accédant à l'adresse
        //http://localhost:8080/api-docs/
        //on désinstalle par la suite ce module
        
        // expressOasGenerator.init(app,{})

        
        // Creation de Routers
        // Les routeurs permettent d'éviter de réécrire
        // Les url à chaque fois

        let MembersRouter = express.Router()
        let Members = require('./assets/classes/members-class')(db, config)

        // utilisation de Morgan 
        //et body parse pour récupérer requêtes POST en body
        app.use(morgan)
        // for parsing application/json
        app.use(express.json()) 
        // for parsing application/x-www-form-urlencoded
        app.use(express.urlencoded({ extended: true })) 
        // inclusion de Swagger UI
        app.use(config.rootAPI+'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        //Utilisation de la route 
        MembersRouter.route('/:id')

        //requête get sur un seul id
        .get(async (req,res) => {
            let member = await Members.getById(req.params.id)
            //on vérifie ici si c'est une erreur 
            //et pas dans la promesse getById où on a renvoyé 
            //que des next
            //en fonction de la classe de ce qui est renvoyé on traite l'erreur

            //Permet de savoir si c'est une erreur et renvoie le ternaire 
            // res.json(isErr(member) ? error(member.message) : success(member))
            res.json(checkAndChange(member))
            
        })

        //Creation de requêtes PUT
        .put(async(req,res) => {
            let changeMember = await Members.update(req.params.id, req.body.name)
            res.json(checkAndChange(changeMember))
        })


        // Creation de requête DELETE
        .delete(async(req,res) => {
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))

        })

        MembersRouter.route('/') 

        // Requêtes GET POUR RECUPERER TOUS LES MEMBRES
        .get(async(req,res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })


            //utilisation de POST
        .post(async (req,res) => {
            let addMember = await Members.add(req.body.name)
            res.json(checkAndChange(addMember))
        })

            
           
        // url sur lequel le routeur agit à la fin avant app.listen
        app.use(config.rootAPI +'members', MembersRouter)


        //envoyer la requête sur un port
        app.listen(config.port, () => {console.log('Started on port 8080')})

}).catch((err) => {
    console.log('Error during database connection')
    console.log(err.message)
})







// const members = [
//     {
//         id:1,
//         name: 'John'
//     },
//     {
//         id:2,
//         name: 'Julie'
//     },
//     {
//         id:3,
//         name: 'Patrick'
//     }
// ]

