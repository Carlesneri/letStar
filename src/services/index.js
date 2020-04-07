const { MissionModel, UserModel } = require('../database/model')
const db = require('mongoose')
const { ObjectId } = db.Types


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

async function updateUserName(id, newUserName){
    return await UserModel.updateOne({ _id: id}, { $set: { name: newUserName }})
}

async function updatePassword(id, newPassword){
    console.log(id, newPassword);
    
    const updateUser =  await UserModel.updateOne({ _id: id}, { $set: { password: newPassword }})
    console.log(updateUser);
    
}

async function deleteUser(id){
    return await UserModel.findByIdAndDelete(ObjectId(id))
}

module.exports = { getMissions, 
    getTotalStars, 
    getViewerMissions, 
    getUser, 
    removeViewer, 
    updateUserName,
    updatePassword,
    deleteUser
}