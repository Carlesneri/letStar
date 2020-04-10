const { Router } = require('express');
const isUser = require('../middlewares/verifyToken')

const {renderIndex, 
    renderNewMissionForm, 
    addNewMission, 
    renderMissions,
    renderNoMissions,
    editMission,
    deleteMission, 
    addStar,
    loginForm, 
    registerForm,
    login,
    register,
    logout,
    getMission,
    getStar,
    deleteStar,
    editStar,
    addViewer,
    removeViewer,
    getUser,
    updateUser,
    deleteUser,
    renderProfile
} = require('../controllers/index.controllers')

const router = Router()

router.get('/', renderIndex)

router.get('/new-mission', isUser, renderNewMissionForm)

router.post('/new-mission', isUser, addNewMission)

router.get('/missions', isUser, renderMissions)

router.get('/no-missions', renderNoMissions)

router.post('/mission/:id', isUser, editMission)

router.delete('/mission/:id', isUser, deleteMission)

router.get('/login', loginForm)

router.get('/register', registerForm)

router.post('/login', login)

router.post('/register', register)

router.get('/logout', logout)

router.get('/mission/:id', isUser, getMission)

router.patch('/viewers', isUser, addViewer)

router.delete('/viewers', isUser, removeViewer)

router.get('/star/:id', isUser, getStar)

router.put('/star', isUser, addStar)

router.patch('/star', isUser, editStar)

router.delete('/star', isUser, deleteStar)

router.get('/user/:id', isUser, getUser)

router.post('/user', isUser, updateUser)

router.delete('/user', isUser, deleteUser)

router.get('/profile', isUser, renderProfile)



module.exports = router;