//FONCTIONS CALL BACK
//Utilisation de PROMISES
//PROMISES en parallèles
//Utilisation de ASYNC AWAIT

require('babel-register');

console.log('Debut');

// FONCTION SIMPLE CALLBACK
// on appelle le propre paramètre
// en fonction anonyme 

getMember((member)=>{
    console.log(member)
})

// IMBRICATION des fonctions CALLBACK
getMember((member) => {
    console.log(member)
    getArticles(member, (articles) => {
        console.log(articles)
    })
})

console.log('Fin')

// Fonctions 
function getMember(next) {
    setTimeout(() => {
        next('Member 1')
    }, 1500)
}

function getArticles(member, next) {
    setTimeout(() => {
        next([1, 2, 3])
    }, 1500)
}


// UTILISATION DE PROMISES

getActor()
    .then((actor) => getFilms(actor))
    .then(films => console.log(films))
    .catch(err => console.log(err.message))

function getActor() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Actor')
            resolve('Actor')
            //reject(new Error('error during get Actor'))
        }, 1500)
    })
}

function getFilms(actor) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve([1, 2, 3])
        }, 1500)
    })
}

// UTILISATION DE PROMESSES EN PARALLELE
let p1 = new Promise((resolve, reject) => {
    setTimeout (() => {
        resolve('p1')
    },1500)
})

let p2 = new Promise((resolve, reject) => {
    setTimeout(()=> {
        resolve('p2')
    },1500)
})

//Attend la promesse 1 et 2 
Promise.all([p1,p2])
    .then((result) => console.log(result))


//UTILISATION DE ASYNC ET AWAIT

async function viewArticles() {
    let actor = await getActor()
    let articles = await getFilms(actor)
    console.log(articles)
}
viewArticles()







