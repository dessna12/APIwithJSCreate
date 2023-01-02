require('babel-register')

const  express = require('express')
const app = express()
const morgan = require('morgan')
const {success, error} = require('functions')
const bodyParser = require('body-parser')

const members = [
    {
        id:1,
        name: 'John'
    },
    {
        id:2,
        name: 'Julie'
    },
    {
        id:3,
        name: 'Patrick'
    }

]

app.use(morgan('dev'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// Création d'une root + Ajout d'un paramètre id 
app.get('/api/v1/members/:id', (req,res) => {
    res.json(func.success(members[(req.params.id)-1]))
})

// Ici on rajoute un paramètre ?max=
//il renverra le nombre de membres indiqué grace au slice
//slice (début, fin)
// http://localhost:8080/api/v1/members?max=3
app.get('/api/v1/members', (req,res) => {
    if (req.query.max != undefined && req.query.max >0) {
        res.json(success(members.slice(0,req.query.max)) )
        // ici on remplace le send par un json 
    }else if (req.query.max != undefined) {
        res.json(error('Wrong max value'))
    }else{
        res.json(success(members))
    }
})


//utilisation de post
app.post('/api/v1/members', (req,res) => {
    if (req.body.name) {
        
        let sameName = false

        for (let i=0; i < members.length; i++){
            if (members[i].name == req.body.name){
                sameName=true
                break
                }
            }
        
        if (sameName){
            res.json(error("Name déjà pris"))
        }else{ 
        let member = {
            id: members.length + 1,
            name: req.body.name
        }
        
        members.push(member)

        res.json(success(member))
        } 

    }else{
        res.json(error('No member added'))
    }
    
})


//envoyer la requête sur un port
app.listen(8080, () => {console.log('Started on port 8080')})


//Bonne pratique d'ajouter des fonctions 
//Success and error
//On a créé un module avec ces fonctions 