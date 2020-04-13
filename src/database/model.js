const mongoose = require('mongoose')

const Schema = mongoose.Schema


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

const starSchema = new Schema({
    comment: {
        type: String
    }
}, 
{
    timestamps: true
})

const missionerSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    stars: {
        type: [starSchema]
    }
})

const viewerSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const missionSchema = new Schema({
    user: {
        type: String,
        required: true
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
        required: true
    },
    target: {
        type: Number,
        required: true,
    },  
    date: {
        type: Date
    },
    observers: {
        type: [viewerSchema]
    }
}, 
{
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
const StarModel = mongoose.model('Star', starSchema)
const ViewerModel = mongoose.model('Viewer', viewerSchema)

module.exports = { MissionModel, MissionerModel, UserModel, DateModel, StarModel, ViewerModel }
