function validate (name, email, password, confirmPassword) {
    if(name){
        if(name.length < 6) return 'El usuario debe ser mayor a 6 caracteres'
    }
    if(email){
        const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const isEmail = emailRe.test(email)
        if(!isEmail) return 'Email no válido'
    }
    if(password){
        if(password.length < 6) return 'La contraseña debe ser mayor a 6 caracteres'
    }
    if(confirmPassword){
        if(password !== confirmPassword) return 'La contraseña no coincide'
    }

    return null
}

module.exports = validate