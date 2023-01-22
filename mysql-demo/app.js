require('babel-register')
const mysql = require('mysql')


const db = mysql.createConnection({
  host: 'localhost',
  database:'nodejs',
  user: 'root',
  password : '',
  port: 3307
})


db.connect(function(err) {
    if (err) 
        console.log(err.message)
    else {
        console.log('connected ')
        db.query('SELECT * FROM members', (err ,result) => {
            if (err)
                console.log(err.message)
            else
                console.log(result[0].name)
        })

    }

})
