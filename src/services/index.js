const { MissionModel, UserModel } = require('../database/model')

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

async function getUser(id) {    
    const user = await UserModel.findById(id)
    return { name: user.name, email: user.email }
    
}

async function removeViewer(id, viewer){
    return await MissionModel.updateOne({_id: id}, {$pull: {viewers: viewer}}, {new: true})
}

module.exports = { getMissions, getTotalStars, getViewerMissions, getUser, removeViewer }