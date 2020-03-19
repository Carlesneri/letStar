const db = require('mongoose', {'useFindAndModify': false})
// db.set('useFindAndModify', false)
const {MissionModel, UserModel} = require('../database/model')
require('dotenv').config()
require('../static/hbsHelpers')
const DB_URI = process.env.DB_URI
const app = 

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
    req.flash('success_msg', 'Misión creada')
    res.redirect('/missions')
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
    req.flash('success_msg', 'Misión eliminada')
    res.redirect('/missions')
}

indexCtrl.addStar = async (req, res) => {
    const missionId = req.body.id
    const missionerName = req.body.missioner
    const missionFound = await MissionModel.findById(missionId)
    // const totalStars = getTotalStars(mission)
    const index = missionFound.missioners.findIndex(el => el.name === missionerName)
    missionFound.missioners[index].stars += 1
    await missionFound.save()  
    .catch(err => console.log('No ha podido añadir estrella. Error: ', err))
    res.json({"mission": missionFound})
}

indexCtrl.removeStar = async (req, res) => {
    const missionId = req.body.id
    const missionerName = req.body.missioner
    const missionFound = await MissionModel.findById(missionId)
    const index = missionFound.missioners.findIndex(el => el.name === missionerName)
    missionFound.missioners[index].stars += -1
    await missionFound.save()   
    .catch(err => console.log('No ha podido añadir estrella. Error: ', err))
    res.json({"mission": missionFound})
}

indexCtrl.loginForm = (req, res) => {
    res.render("loginForm")
}

indexCtrl.registerForm = (req, res) => {
    res.render("registerForm")
}

indexCtrl.login = (req, res) => {
    const {name, password} = req.body
    console.log(name, password)
    res.redirect('/missions')
}

indexCtrl.register = async (req, res, next) => {
    const {name, password} = req.body
    const user = await UserModel.findOne({name})
    if(user) {
        req.flash('error_msg', 'El usuario ya existe')
        res.render('registerForm', {name, password})
    }else{
        const newUser = new UserModel({name, password})
        await newUser.save()
        res.redirect('/missions')
    }
}

indexCtrl.getMission = async (req, res) => {
    const missionId = req.params.id
    const mission = await MissionModel.findById(missionId)
    res.json({mission})
    
}

module.exports = indexCtrl;

