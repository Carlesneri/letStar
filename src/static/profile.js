function removeUserHandler(id){
    Swal.fire({
        html: `
        <div class="remove-user">
            <div>¿Estás seguro de eliminar tu cuenta?</div>
            <div>
                <a onclick="removeUser('${id}')">Estoy seguro</a>
                <a onclick="Swal.close()">Cancelar</a>
            </div>
        </div>
        `,
        showConfirmButton: false
    })
}

async function removeUser(id){
    Swal.showLoading()
    try{
        await fetch("/user",  {
            method: 'DELETE',
            body: JSON.stringify({id}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        Swal.close()
        location.replace('/register')
    }catch(err){
        console.log('Error al eliminar usuario. Error: ', error)
        Swal.fire({
            html: "Error al eliminar misión",
            showConfirmButton: false,
            timer: 1300,
        })
    }
}