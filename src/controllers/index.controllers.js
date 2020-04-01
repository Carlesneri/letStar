const db = require('mongoose', {'useFindAndModify': false})
const { ObjectId } = db.Types
const bcrypt = require('bcryptjs')
const { MissionModel, UserModel, MissionerModel, StarModel } = require('../database/model')
require('dotenv').config()
require('../static/hbsHelpers')
const DB_URI = process.env.DB_URI
const validate = require('../validate/validate') 
const passport = require('passport')
const {getTotalStars, getMissions} = require('../services')

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
    if(!req.user){
        req.flash('error_msg', 'No se encuentra el usuario')
        res.redirect('/login')
    }else{
        try{
            const missioners = []
            if(typeof(req.body.missioners) === 'string'){
                missioners.push(new MissionerModel({name: req.body.missioners}))
            } else {
                req.body.missioners.forEach(missioner => {
                    missioners.push(new MissionerModel({name: missioner }))
                })
            }
            const newMission = new MissionModel({
                user: req.user._id,
                title: req.body.title,
                description: req.body.desc,
                missioners,
                target: req.body.target,
                date: req.body.date
            })
            await newMission.save()
            req.flash('success_msg', 'Misión creada')
            res.redirect('/missions')    
        }
        catch(error){
            console.log(error);
        }
    }
}

indexCtrl.renderMissions = async (req, res) => {
    if(req.user){
        const missions = await getMissions(req.user._id)        
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
    const { missionId, missionerId, comment } = req.body
    const newStar = new StarModel({
        comment
    })
    try{
        const missionFound = await MissionModel.findById(missionId)
        const missionerIndex =  missionFound.missioners.findIndex(el => el._id == missionerId)
        missionFound.missioners[missionerIndex].stars.push(newStar)        
        const updatedMission = await missionFound.save()
        res.status(200).json(updatedMission)
    }catch(err) {
        console.log(err);
        req.flash('error_msg', 'No se ha podido añadir estrella')
        res.status(400).redirect('/missions')
    }
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

indexCtrl.getStar = async (req, res) => {
    try{
        const starId = req.params.id
        const mission = await MissionModel.findOne( {"missioners.stars._id": starId} )
        mission.missioners.forEach(missioner => {
            missioner.stars.forEach(star => {
                if(star._id == starId) return res.status(200).json({ star })
            })
        })
    }
    catch(error) {
        console.log(error)
    }
}

indexCtrl.deleteStar = async (req, res) => {
    try{
        const { missionId, missionerId, starId } = req.body
        const mission = await MissionModel.findById(missionId)
        const missionerIndex = mission.missioners.findIndex(missioner => missioner._id == missionerId)
        const starIndex = mission.missioners[missionerIndex].stars.findIndex(star => star._id == starId)
        mission.missioners[missionerIndex].stars[starIndex].remove()
        const missionUpdated = await MissionModel.updateOne({ _id: missionId }, mission)
        req.flash('success_msg', 'Estrella eliminada')
        res.status(200).json(missionUpdated)
    }catch(err) {
        console.log(err);
        req.flash('error_msg', 'No se ha podido quitar estrella')
        res.status(400).redirect('/missions')
    }
}

indexCtrl.editStar = async (req, res) => {      
    try{
        const { missionId, missionerId, starId, newComment } = req.body
        const missionFound = await MissionModel.findById(missionId)
        console.log('mission', missionFound);
        const missionerIndex = missionFound.missioners.findIndex(missioner => missioner._id == missionerId)
        const starIndex = missionFound.missioners[missionerIndex].stars.findIndex(star => star._id == starId)
        console.log('mission', missionerIndex);
        console.log('mission', starIndex);
        missionFound.missioners[missionerIndex].stars[starIndex].comment = newComment
        const missionUpdated = await missionFound.save()
        req.flash('success_msg', 'Estrella editada')
        res.status(200).json(missionUpdated)
    } catch(err) {
        console.log(err)
        req.flash('error_msg', 'No se ha podido editar estrella')
        res.status(400).redirect('/missions')
    }
}

module.exports = indexCtrl;

