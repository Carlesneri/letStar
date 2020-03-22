const mongoose = require('mongoose')

const Schema = mongoose.Schema

const missionerSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    stars: {
        type: Number,
        default: 0
    }
})

const missionSchema = new Schema({
    user: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    missioners: {
        type: [missionerSchema],
        required: true,
    },
    target: {
        type: Number,
        required: true,
    },  
}, {
    timestamps: true
})

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamsp: true
})


const MissionModel = mongoose.model('Mission', missionSchema)
const MissionerModel = mongoose.model('Missioner', missionerSchema)
const UserModel = mongoose.model('User', userSchema)
module.exports = {MissionModel, MissionerModel, UserModel}