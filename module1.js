exports.sayHello = function () {
    console.log('Hello !')
}

sayHi = function () {
    console.log('Hi !')
}

exports.hello = 'Hello WOrld'

// Autre façon d'exporter qui est plus simple à maintenir dans les gros modules
exports.sayHi = sayHi;