const Handlebars = require('handlebars')

Handlebars.registerHelper('times', function(total, active, block) {
    var accum = '';
    for(var i = 0; i < total-active; ++i)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper('stars-remind', function(target, missioners, block) {
    var accum = 0;
    for(let i = 0; i < missioners.length; i++){
        accum += missioners[i].stars
    }
    // missioners.forEach(el => accum += el.stars)
    return target - accum;  
});

Handlebars.registerHelper('finished', function(target, missioners, block) {
    var accum = 0;
    for(let i = 0; i < missioners.length; i++){
        accum += missioners[i].stars
    }
    // missioners.forEach(el => accum += el.stars)
    const remindStars =  target - accum;
    if (remindStars) return ''
    else return 'Conseguido!' 
});

