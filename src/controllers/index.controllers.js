const db = require('mongoose')
db.set('useFindAndModify', false)
const {MissionModel} = require('../database/model')
require('dotenv').config()
require('../static/hbsHelpers')
const DB_URI = process.env.DB_URI
console.log(DB_URI)

db.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('db conectada con éxito'))

const indexCtrl = {}

indexCtrl.renderIndex = (req, res) => {
    res.render('index');
}

indexCtrl.renderNewMissionForm = (req,res) => {
    res.render('new-mision')
}

indexCtrl.addNewMission = async (req, res) => {
    const {missioners} = req.body
    const missionersArr = []
    if(typeof(missioners) !== "string"){
        missioners.forEach(missioner => missionersArr.push({name: missioner}))
    }else missionersArr.push({name: missioners})
    
    const newMission = new MissionModel({
        title: req.body.title,
        description: req.body.desc,
        missioners: missionersArr,
        target: req.body.target
    })
    await newMission.save()
    res.redirect('missions')
}

indexCtrl.renderMissions = async (req, res) => {
    const missions = await MissionModel.find()
    if (missions.length > 0){
        res.render('missions', {missions})
    }else res.render('no-missions')
}

indexCtrl.renderNoMissions = (req, res) => {
    res.render('no-missions')
}

indexCtrl.deleteMission = async (req, res) => {
    await MissionModel.findByIdAndDelete(req.params.id)
    res.redirect('/missions')
}

indexCtrl.addStar = async (req, res) => {
    const missionId = req.body.id
    const missionerName = req.body.missioner
    const mission = await MissionModel.findById(missionId)
    // const totalStars = getTotalStars(mission)
    const index = mission.missioners.findIndex(el => el.name === missionerName)
    mission.missioners[index].stars += 1
    await mission.save()  
    .catch(err => console.log('No ha podido añadir estrella. Error: ', err))
    res.json({mission})
}

indexCtrl.removeStar = async (req, res) => {
    const missionId = req.body.id
    const missionerName = req.body.missioner
    const mission = await MissionModel.findById(missionId)
    const index = mission.missioners.findIndex(el => el.name === missionerName)
    mission.missioners[index].stars += -1
    await mission.save()   
    .catch(err => console.log('No ha podido añadir estrella. Error: ', err))
    res.json({mission})
}

indexCtrl.login = (req, res) => {
    res.send("aquí irá el login, soy Joan")
}

module.exports = indexCtrl;
