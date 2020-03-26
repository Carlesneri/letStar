const { Router } = require('express');
const isUser = require('../middlewares/verifyToken')

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
    logout,
    getMission
} = require('../controllers/index.controllers')

const router = Router()

router.get('/', renderIndex)

router.get('/new-mission', isUser, renderNewMissionForm)

router.post('/new-mission', isUser, addNewMission)

router.get('/missions', isUser, renderMissions)

router.get('/no-missions', renderNoMissions)

router.delete('/mission/:id', isUser, deleteMission)


router.put('/mission/add-star', isUser, addStar)

router.put('/mission/remove-star', isUser, removeStar)

router.get('/login', loginForm)

router.get('/register', registerForm)

router.post('/login', login)

router.post('/register', register)

router.get('/logout', logout)

router.get('/mission/:id', isUser, getMission)

module.exports = router;