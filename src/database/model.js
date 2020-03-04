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


const MissionModel = mongoose.model('Mission', missionSchema)
const MissionerModel = mongoose.model('Missioner', missionerSchema)
module.exports = {MissionModel, MissionerModel}