const { MissionModel } = require('../database/model')

async function getMissions(id) {
    return await MissionModel.find({ user:id })
}

async function getViewerMissions(email) {
    return await MissionModel.find({ viewers: email })
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

module.exports = { getMissions, getTotalStars, getViewerMissions }