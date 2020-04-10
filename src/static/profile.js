function removeUserHandler(id){
    Swal.fire({
        html: `
        <div class="remove-user-swal" id="removeUser">
            <div id="removeUserSwalTitle" class="swal-title">¿Estás seguro de eliminar tu cuenta?</div>
            <div class="swal-password" id="swalPassword"></div>
            <div class="swal-buttons">
                <a onclick="removeUser()" id="removeUserAnchor">Estoy seguro</a>
                <a onclick="confirmRemoveUser('${id}')" style="display: none" id="confirmRemoveUserAnchor">Eliminar la cuenta</a>
                <a onclick="Swal.close()">Cancelar</a>
            </div>
        </div>
        `,
        showConfirmButton: false
    })

}

async function removeUser(){
    const swalPasswordElement = document.getElementById("swalPassword")
    const swalTitle = document.getElementById("removeUserSwalTitle")
    const removeUserAnchor = document.getElementById("removeUserAnchor")
    const confirmRemoveUserAnchor = document.getElementById("confirmRemoveUserAnchor")
    swalTitle.innerText = "Confirma tu contraseña"
    swalPasswordElement.innerHTML = `
        <div class="swal-input-group">
            <label for="swalPasswordInput">Contraseña</label>
            <input type='password' id='swalPasswordInput' autofocus>
        </div>
    `
    removeUserAnchor.style.display = 'none'
    confirmRemoveUserAnchor.style.display = 'block'
}

async function confirmRemoveUser(id){
    const passwordElement = document.getElementById("swalPasswordInput")
    const password = passwordElement.value
    if(password){
        Swal.showLoading()
        try{
            const response = await fetch("/user",  {
                method: 'DELETE',
                body: JSON.stringify({id, password}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const {message} = await response.json()
            if(message){
                await Swal.fire({
                    html: `
                        ${message}
                    `,
                    showConfirmButton: false,
                    timer: 1300
                })
            }
            location.replace("/register")
        }catch(err){
            Swal.fire({
                html: "Error al eliminar cuenta",
                showConfirmButton: false,
                timer: 1300,
            })
        }
    }
    else{
        const swalPasswordElement = document.getElementById("swalPassword")
        swalPasswordElement.innerHTML += `<div class="error-msg">Debes escribir algo</div>`
    }
}
