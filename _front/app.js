//modules
require('babel-register')
const express = require('express')
const bodyParser =require('body-parser')
const morgan = require('morgan')('dev')
const twig = require('twig')
//Axios permet de faire des requêtes http
// Axios est basé sur un système de promesses
const axios = require('axios')

//variables globales
const app = express()
const port = 8081

//Middleware
app.use(morgan)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended :true}))

//Routes

//ENVOI D'UN FICHIER HTML
// app.get('/', (req,res) => {
//     res.sendFile(__dirname+'/views/index.html')
// })

// UTILISATION DE TWIG 

//Page accueil 
app.get('/', (req,res) => {
    res.render('index.twig', {
        name: req.params.name
    })
})

//UTILISATION DE AXIOS POUR FAIRE UNE REQUETE API

//METTRE EN PLACE UNE INSTANCE DE AXIOS
//pour éviter de répéter l'adresse de base à chaque fois. 
const fetch = axios.create({
    baseURL:'http://localhost:8080/api/v1'
})

//Page tous les membres 
app.get('/members', (req,res) => {
    apiCall(req.query.max ? '/members?max='+req.query.max : '/members', 'get', {}, res, (members) => {
        res.render('members.twig', {
            members: members
        })
    })

})

//Page récupérant un seul membre
app.get('/members/:id', (req,res) => {
    apiCall('/members/'+req.params.id, 'get', {}, res, (member) => {
        res.render('member.twig',{
            member:member
        })
    })  

})

//Page permettant de gérer la modification d'un utilisateur
app.get('/edit/:id', (req,res) => {
    apiCall('/members/'+req.params.id, 'get', {}, res, (result) => {
        res.render('edit.twig',{
            member:result
        })
    })
})

//Page permettant de MODIFIER UN UTILISATEUR
//redirige ensuite sur la page members de départ
app.post('/edit/:id', (req,res) => {
    apiCall('/members/'+req.params.id,'put', {
        name:req.body.name
    }, res, () => {
        res.redirect('/members')
    })
})

//METHODE POUR SUPPRIMER UN MEMBRE
app.post('/delete', (req,res) => {
    apiCall('/members/'+req.body.id,'delete', {}, res, ()=>{
        res.redirect('/members')
    })
})


//CREATION D'UN NOUVEAU MEMBRE AVEC GET ET POST
app.get('/insert', (req,res) => {
    res.render('insert.twig')
})

app.post('/insert', (req,res) => {
    apiCall('/members', 'post', {name: req.body.name}, res, ()=>{
        res.redirect('/members')
    })
})

//lancement de l'application
app.listen(port, ()=> console.log('Connecté sur le port '+ port))



//Functions

function renderError(res, err){
    res.render('error.twig', {
        err: err.message
    })
}

function apiCall(url, method, data, res, next){
    fetch({
        method:method,
        url:url,
        data:data
    }).then((response) => {
        if(response.data.status == 'success'){
            next(response.data.result)
        } else {
            renderError(res, response.data.message)
        }
    })
    .catch((err) => renderError(res, err.message))
}