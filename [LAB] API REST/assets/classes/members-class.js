let db, config

module.exports = (_db,_config) =>{
    db = _db
    config= _config
    return Members
} 


let Members = class {

    //FONCTION GET UN SEUL MEMBRE AVEC ID
    static getById(id) {

        return new Promise((next) => {

            //ici on a pas fait resolve, reject car on veut traiter l'erreur plutot
            //dans le corps de la fonction principale
            //on a mis next partout. Mais on peut faire avec (resolve, reject)
            db.query('SELECT * FROM members WHERE id = ?',[id])
            .then((result) => {
                if (result[0] != undefined){                    
                    next(result[0])
                }else{
                    next(new Error('Wrong id'))
                }
            }).catch((err) => next(err))

        })
    }

    //FONCTION GET ALL MEMBERS
    static getAll(max) {

        return new Promise((next) => {

                if (max != undefined && max >0) {
            
                    db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
                    
                } else if (max != undefined) {
                    next(new Error('Wrong max value'))
                }else{
                    db.query('SELECT * FROM members')
                    .then((result) => next(result))
                    .catch((err) => next(err))
                }
            })
    }

    //FONCTION POST NEW MEMBER
    static add(name) {

        return new Promise((next) => {

        if (name != undefined && name.trim() != '') {
            
            name = name.trim()
            
            db.query('SELECT * FROM members WHERE name = ?', [name])
            .then((result) => {
                if (result[0] != undefined){
                    next(new Error('name already taken'))
                } else {
                    return db.query('INSERT INTO members(name) VALUES(?)', [name])
                }
            })
            .then(() => {
                return db.query('SELECT * from members WHERE name = ?', [name])
            })
            .then((result) => {
                next({
                    id: result[0].id,
                    name:result[0].name
                })
            })
            .catch((err) => next(err))
        }else{
            next(new Error('No name value'))
        }
        })

    }

    //FONCTION PUT MODIFICATION D'UN MEMBRE
    static update(id, name) {

        return new Promise(next => {


            if(name != undefined && name.trim() != ''){

                //la fonction trim permet d'enlever les espaces
                name = name.trim()

                db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined)                        
                        return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id])
                    else
                        next(new Error("Wrong id value"))   
                })
                .then((result)=>{
                    if(result[0]!= undefined)
                        next(new Error("same name"))
                    else
                        return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
                })
                .then(() => next(true))
                .catch((err) => next(err))
            }else{
                next(new Error('no name value'))
            }
        })
    }


    //FONCTION DELETE MEMBRE
    static delete(id){

        return new Promise((next) => {

            db.query('SELECT * FROM members WHERE id=?', [id])
            .then((result) => {
                if(result[0] != undefined) {
                    return db.query('DELETE FROM members WHERE id= ?', [id])
                }else{
                    next(new Error('id non valide'))
                }
            })
            .then(() => next(true))
            .catch((err)=> next(err))

        })
    }

}