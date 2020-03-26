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

const dateSchema = new Schema({
    day: {
        type: String
    },
    month: {
        type: String
    },
    year: {
        type: String
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
    date: {
        type: {
            day: String,
            month: String,
            year: String
        }
    }
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
const DateModel = mongoose.model('Date', dateSchema)

module.exports = {MissionModel, MissionerModel, UserModel, DateModel}