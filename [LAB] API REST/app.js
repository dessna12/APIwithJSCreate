require('babel-register')

const  express = require('express')

const morgan = require('morgan')
const {success, error} = require('functions')
const bodyParser = require('body-parser')
const config = require('./config')
const mysql=require('mysql')


const db=mysql.createConnection({
    host:'localhost',
    database:'nodejs',
    user:'root',
    password: '',
    port:3307
})


db.connect((err)=>{
    if (err)
        console.log(err.message)
    else{
        console.log('Connecté à mysql')
        
        const app = express()
        
        // Creation de Routers
        // Les routeurs permettent d'éviter de réécrire
        // Les url à chaque fois

        let MembersRouter = express.Router();

        // utilisation de Morgan 
        //et body parse pour récupérer requêtes POST en body
        app.use(morgan('dev'))
        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


        //Utilisation de la route 
        MembersRouter.route('/:id')

        //requête get sur un seul id
        .get((req,res) => {

            db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result)=>{
                if(err){
                    res.json(error(err.message))
                } else {
                    
                    if (result[0] != undefined){                    
                        res.json(success(result))
                    }else{
                        res.json(error("Wrong id value"))
                    }
                }
            })   
            
        })


        .put((req,res) => {

            if(req.body.name){
                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result)=>{
                    if(err){
                        res.json(error(err.message))
                    } else {
                        
                        if (result[0] != undefined){                    
                            
                            db.query('SELECT * FROM members WHERE name = ? AND id != ?', [req.body.name, req.params.id], (err, result)=> {
                                if(err){
                                    res.json(error(err.message))
                                }else{
                                    if(result[0]!= undefined){
                                        res.json(error("same name"))
                                    }else{
                                        db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err, result) =>{
                                            if(err){
                                                res.json(error(err.message))
                                            }else{
                                                res.json(success(true))
                                            }
                                        })
                                    }
                                }
                            })
                        }else{
                            res.json(error("Wrong id value"))
                        }
                    }
                })   
            }else{
                res.json(error('no name value'))
            }
        })


            // Creation de requête DELETE
            .delete((req,res) => {
                
                db.query('SELECT * FROM members', (err, result) => {
                    if (err) {
                        res.json(error(err.message))
                    }else{
                        db.query('DELETE FROM members WHERE id= ?', [req.params.id], (err,result) => {
                            if (err) {
                                res.json(error(err.message))
                            }else{
                                res.json(success(true))
                            }
                        })
                    }
                })
            })

            MembersRouter.route('/') 

            // Requêtes GET
            .get((req,res) => {

                    db.query('SELECT * FROM members', (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        }else{
                            res.json(success(result))
                        }
                    })
                    
                })


            // Ici on rajoute un paramètre ?max=
            //il renverra le nombre de membres indiqué grace au slice
            //slice (début, fin)
            // http://localhost:8080/api/v1/members?max=3
            .get((req,res) => {
                if (req.query.max != undefined && req.query.max >0) {
                    
                    db.query('SELECT * FROM members LIMIT 0, ?', [req.query.max], (err,result) => {
                        if (err) {
                            res.json(error(err.message))
                        }else{
                            res.json(success (result))
                        }
                        })
                    
                    // ici on remplace le send par un json 
                } else if (req.query.max != undefined) {
                    res.json(error('Wrong max value'))
                }else{
                    db.query('SELECT * FROM members', (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        }else{
                            res.json(success(result))
                        }
                    })
                }
            })


            //utilisation de POST
            .post((req,res) => {
                if (req.body.name) {
                    
                    db.query('SELECT * FROM members WHERE name = ?', [req.body.name], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        }else{

                            if (result[0] != undefined){
                                res.json(error('name already taken'))
                            }else{
                                db.query('INSERT INTO members(name) VALUES(?)', [req.body.name], (err, result)=>{
                                    if(err){
                                        res.json(error(err.message))
                                    }else{
                                        db.query('SELECT * from members WHERE name = ?', [req.body.name], (err,result) => {
                                            res.json(success({
                                                id: result[0].id,
                                                name:result[0].name
                                            }))
                                        } )
                                    }
                                })



                            }


                        }

                    })
               
            }else{
                res.json(error("No name value"))
            }
        })

                    //Creation de requêtes PUT


        // url sur lequel le routeur agit à la fin avant app.listen
        app.use(config.rootAPI +'members', MembersRouter)


        //envoyer la requête sur un port
        app.listen(config.port, () => {console.log('Started on port 8080')})







    }
}
)


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

