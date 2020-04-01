const { MissionModel, MissionerModel, StarModel } = require('../database/model')

async function getMissions(id) {
    return await MissionModel.find({ user:id })
    
    // for(let i in missions){
    //     missioners = await getModelDocs(MissionerModel, 'mission', missions[i]._id)
    //     for(let i in missioners){
    //         stars = await getModelDocs(StarModel, 'missioner', missioners[i]._id)
    //         missioners[i] = {...missioners[i], stars}
    //     }
    //     missions[i] = {...missions[i], missioners}
    // }
    // console.log('getMissions', missions)
}

async function getModelDocs(model, key, id){
    return await model.find({[key]: id })
}

function getTotalStars(mission) {
    let totalStars = 0
    for(let i = 0; i < mission.missioners.length; i++){
        totalStars += mission.missioners[i].stars
    }
    return accum;  
}

module.exports = { getMissions, getTotalStars }