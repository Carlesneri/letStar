const { Router } = require('express');

const {renderIndex, 
    renderNewMissionForm, 
    addNewMission, 
    renderMissions,
    renderNoMissions,
    deleteMission, 
    addStar,
    removeStar, 
    loginForm, 
    registerForm,
    login,
    register,
    getMission
} = require('../controllers/index.controllers')

const router = Router()

router.get('/', renderIndex)

router.get('/new-mission', renderNewMissionForm)

router.post('/new-mission', addNewMission)

router.get('/missions', renderMissions)

router.get('/no-missions', renderNoMissions)

router.delete('/mission/:id', deleteMission)


router.put('/mission/add-star', addStar)

router.put('/mission/remove-star', removeStar)

router.get('/login', loginForm)

router.get('/register', registerForm)

router.post('/login', login)

router.post('/register', register)

router.get('/mission/:id', getMission)

module.exports = router;