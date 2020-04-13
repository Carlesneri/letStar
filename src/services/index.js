const { MissionModel, UserModel, ViewerModel } = require('../database/model')
const db = require('mongoose')
const { ObjectId } = db.Types


async function getMissionExample(){
    const missions = await MissionModel.find({ user: "5e8cb7822cdb72500859ac97"})
    let random = Math.floor(Math.random() * missions.length)
    return missions[random]
}

async function getMissions(id) {
    return await MissionModel.find({ user:id })
}

async function getViewerMissions(email) {
    return await MissionModel.find({ viewers: email })
}

async function getSharedMissions(email) {
    const missions = await MissionModel.find({ "observers.email": email })
    const editorMissions = []
    const observerMissions = []
    missions.forEach( mission => {
        mission.observers.forEach( observer => {
            if(observer.email === email && observer.rol === "write") editorMissions.push(mission)
            if(observer.email === email && observer.rol === "read") observerMissions.push(mission)
        })
    })
    return { editorMissions, observerMissions }
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

async function addViewer(id, viewer, role){
    const newViewer = new ViewerModel({ email: viewer, rol: role })
    return await MissionModel.updateOne(
        {_id: id},
        {$addToSet: {observers: newViewer}}, 
        {new: true}
    )
}

async function removeMeAsAViewer(id, email){
    const mission =  await MissionModel.findById(ObjectId(id))
    const observers = mission.observers.filter(observer => observer.email !== email)
    mission.observers = observers
    return await mission.save()
}

async function removeViewer(id, email){
    const mission =  await MissionModel.findById(ObjectId(id))
    mission.observers = mission.observers.filter(observer => observer.email !== email)
    return await mission.save()
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
    const user = await UserModel.findByIdAndDelete(ObjectId(id))
    return user
}

async function updateMission(id, body){
    const mission = await MissionModel.findById(ObjectId(id))    
    mission.title = body.title
    mission.description = body.desc
    mission.target = body.target
    if(body.date !== '') mission.date = body.date
    mission.missioners.forEach((el, index) => {
        el.name = body.missioner[index]
    })

    return await MissionModel.updateOne(
        { _id: ObjectId(id) }, 
        { $set: mission },
        { new: true })
}


module.exports = { 
    getMissionExample,
    getMissions, 
    updateMission,
    getTotalStars, 
    getViewerMissions, 
    getSharedMissions,
    getUser, 
    addViewer,
    removeMeAsAViewer,
    removeViewer, 
    updateUserName,
    updatePassword,
    deleteUser
}