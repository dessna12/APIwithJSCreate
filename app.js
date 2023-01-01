require('babel-register');


// installer dans cmd:   npm install --save babel-register

const os=require('os');
const fs=require('fs');
const http=require('http');

const mod1=require('./module1'); // module que l'on a créé

const ms=require('ms');

console.log('Hellooo World');
console.log("Est ce que le nodemon marche toujours ? ");

//Utilisation du module os
console.log(os.arch());
console.log(os.homedir());


//Utilisation du module fs
fs.readFile('utilisationFsModule.txt', 'utf-8', (err,data) =>{
    if(err) {
        console.log(err)
    }else{
        console.log(data)

        fs.writeFile('utilisationFsModule.txt', 'Hello World','utf-8', (err) => {
            fs.readFile('utilisationFsModule.txt', 'utf-8', (err,data) =>{
                console.log(data);
            })
        fs.writeFile('utilisationFsModule.txt','utilisation du fs module', 'utf-8', (err) => {
            console.log(err);
        })
        }
        )
    }
} )

// utilisation du module http
http.createServer( (req,res) => {
    

    if (req.url == '/') {
        res.writeHead(200, {'Content-type' : 'text/html'})
        res.write("<h1>Accueil</h1>\n")
        res.end()
    } else if (req.url == '/fs') {
        fs.readFile('utilisationFsModule.txt','utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-type' : 'text/html'})
                res.write("<span style='color : red'>Erreur 404 </span>")
                res.end()
            } else {
                res.writeHead(200, {'Content-type' : 'text/html'})
                res.write(data)
                res.end()
            }
        })
    } else {
        res.writeHead(404, {'Content-type' : 'text/html'})
        res.write("<span style='color : red'>Erreur 404 </span>")
        res.end()
    }
}).listen(8080)


//pour éviter la répétition du 404 on peut utiliser cette fonction à la place 
function send404 (res) {
    res.writeHead(404, {'Content-type' : 'text/html'})
    res.write("<span style='color : red'>Erreur 404 </span>")
    res.end()
}

// Utilisation de notre module 1
mod1.sayHello()
console.log(mod1.hello)

// Utilisation d'une devDependency
console.log(ms('2 days'));