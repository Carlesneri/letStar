const db = require('mongoose', {'useFindAndModify': false})
const bcrypt = require('bcryptjs')
const {MissionModel, UserModel} = require('../database/model')
require('dotenv').config()
require('../static/hbsHelpers')
const DB_URI = process.env.DB_URI
const validate = require('../validate/validate') 
const jwt = require('jsonwebtoken')
const passport = require('passport')

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
    
    if(!req.user){
        req.flash('error_msg', 'No se encuentra el usuario')
        res.redirect('/login')
    }else{
        const newMission = new MissionModel({
            user: req.user._id,
            title: req.body.title,
            description: req.body.desc,
            missioners: missionersArr,
            target: req.body.target
        })
        await newMission.save()
        req.flash('success_msg', 'Misión creada')
        res.redirect('/missions')
    }
}

indexCtrl.renderMissions = async (req, res) => {
    if(req.user){
        const missions = await MissionModel.find({user: req.user._id})
        if (missions.length > 0){
            res.render('missions', {missions})
        }else res.render('no-missions')    
    }else{
        req.flash('error_msg', 'No se encuentra usuario')
        res.redirect('/login')
    }  
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

indexCtrl.login = passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/missions',
    failureFlash: true
}) 
// => {
//     const {name, password} = req.body
//     console.log(name, password)
//     res.redirect('/missions')
// }

indexCtrl.register = async (req, res) => {
    const message = validate(req.body.name, req.body.email, req.body.password)
    if(message) {
        return res.status(400).render('registerForm', {name: req.body.name, email: req.body.email, password: req.body.password, message})
    }
    const user = await UserModel.findOne({email: req.body.email})   
    if(user) {
        const message = 'El usuario ya existe!'
        return res.status(400).render('registerForm', {name: req.body.name, email: req.body.email, password: req.body.password, message})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = new UserModel({name: req.body.name, email: req.body.email, password: hashedPassword})
    await newUser.save()
    req.login(newUser, (err) => {
        if(err){
            console.log('Error login desde register. Error:', err);
            return res.render('registerForm', { newUser })
        }
        req.flash('success_msg', "Usuario creado")
        return res.redirect('/missions')
    })
    // const token = jwt.sign({_id: userSaved._id}, process.env.TOKEN_SECRET)
    //res.header('auth-token', token).render('missions')
    //res.redirect('/missions')
    //.render('profile', {user: userSaved})
}

indexCtrl.logout = (req, res) => {
    req.logout()
    req.flash('success_msg', 'Has hecho logout')
    res.redirect('/')
}

indexCtrl.getMission = async (req, res) => {
    const missionId = req.params.id
    const mission = await MissionModel.findById(missionId)
    res.json({mission})
}

module.exports = indexCtrl;

