const Handlebars = require('handlebars')
const moment = require('moment')

Handlebars.registerHelper('times', function(total, active, block) {
    var accum = '';
    for(var i = 0; i < total-active; ++i)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper('stars-remind', function(target, missioners, block) {
    var accum = 0;
    for(let i in missioners){
        accum += missioners[i].stars.length
    }
    // missioners.map(missioner => accum += missioner.stars.length)
    return target - accum;  
});

Handlebars.registerHelper('finished', function(target, missioners, _id, block) {
    var accum = 0;
    for(let i = 0; i < missioners.length; i++){
        accum += missioners[i].stars
    }
    missioners.forEach(el => accum += el.stars)
    const remindStars =  target - accum;
    if (remindStars > 0) return `<div class="unfinished" id="finished-${_id}">Conseguido!</div>`
    else return `<div class="finished" id="finished-${_id}">Conseguido!</div>`
});

Handlebars.registerHelper('stringDate', function(date, block) {
    const momentDate = moment(date).format('DD[-]MM[-]YYYY, h:mm a')
    return momentDate
});

Handlebars.registerHelper('dateFormat', function(date, block) {
    const today = new Date()
    const momentDate = moment(date).format('DD[-]MM[-]YYYY')
    const diasRestantes = Math.ceil((date - today)/1000/60/60/24)
    const dataTope = `Fecha tope: ${momentDate}`
    let diasRestText = null
    date - today > 0 ? diasRestText = `Quedan ${diasRestantes} dias`
    : diasRestText = `Fecha superada`
    return (
        `<div>${dataTope}</div>
        <div>${diasRestText}</div>`
    )
})

Handlebars.registerHelper('addStar', function(target, missioners, missionerStarsLength, block) {
    var accum = 0;
    for(let i = 0; i < missioners.length; i++){
        accum += missioners[i].stars.length
    }
    if(accum < target && missionerStarsLength < target) return block.fn()
    else return null
});

Handlebars.registerHelper('removeStar', function(stars, block) {
    if(stars > 0) return block.fn()
    else return null
});
