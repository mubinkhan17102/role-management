const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercare: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

userSchema.pre('save', async function(next){
    try{
        if(this.isNew){
            const genSalt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.password, genSalt);
            this.password = hash;
        }
        next()
    }catch(e){
        next(e)
    }
})

userSchema.methods.isValidPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password)
    }catch(e){
        throw createHttpError.InternalServerError(e.message);
    }
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;