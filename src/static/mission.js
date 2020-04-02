async function removeMissionHandler(event){
    const mission = event.target.getAttribute("mission")
    Swal.fire({
        html: 
            `<h2>¿Quieres eliminar la misión?</h2>
            <div class="swal-remove-mission">
                <a mission=${mission} onclick="deleteMission(event)">Sí</a>
                <a onclick="closeSwal()">Cancelar</a>
            </div>`,
        showConfirmButton: false
    })
}

function closeSwal(){
    return Swal.close()
}

async function deleteMission(event){
    const mission = event.target.getAttribute("mission")
    closeSwal()
    Swal.fire({
        html: 
            `<h2>Eliminando</h2>`,
        showConfirmButton: false,
    })
    Swal.showLoading();
    try{
        const response = await fetch('/mission/'+ mission, {
            method: "DELETE"
        })
        const missionDeleted = await response.json()
        await Swal.fire({
            html: `Misión "${missionDeleted.title}" eliminada`,
            showConfirmButton: false,
            timer: 1300,
        })
    }catch(err){
        console.log('Error al eliminar misión. Error: ', err);
        await Swal.fire({
            html: "Error al eliminar misión",
            showConfirmButton: false,
            timer: 1300,
        })
    }
    location.reload()
}

async function addStar(event){   
    event.target.style.visibility = 'hidden' 
    const mission = event.target.getAttribute("mission")
    const missioner = event.target.getAttribute("missioner")
    await Swal.fire({
        html: 
        `<h2>Nueva estrella</h2>
        <div class="new-star-form">
        <input type="text" id="star-comment" class="comment" autofocus placeholder="Comentario"></input>
        <a class="btn-text" onclick="newStar(event)" missionId=${mission} missionerId=${missioner} >Guardar</>
        </div>`,
        showConfirmButton: false
    })
    event.target.style.visibility = 'visible' 
}

async function newStar(event) {
    const missionId = event.target.getAttribute("missionId")
    const missionerId = event.target.getAttribute("missionerId")
    const comment = document.getElementById("star-comment").value || null
    Swal.fire({
        html: 
            `<h2>Guardando</h2>`,
        showConfirmButton: false,
    })
    Swal.showLoading();
    try{
        const data = {missionId, missionerId, comment}
        await fetch("/star", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }catch(err){
        console.log('Error al añadir estrella. Error: ', err);
        Swal.fire({
            html: "Error al añadir estrella",
            showConfirmButton: false,
            timer: 1300,
        })
    }
    Swal.close();
    location.reload()
}

async function editStar(event) {
    const mission = event.target.getAttribute("mission")
    const missioner = event.target.getAttribute("missioner")
    const star = event.target.getAttribute("star")
    const date = event.target.getAttribute("date")
    const comment = event.target.getAttribute("comment")
    //const comment = await getComment(star) || ''
    await Swal.fire({
        html:
        `<h2>Editar estrella</h2>
        <div><textarea type="text" id="comment" class="comment">${comment}</textarea></div>
        <div>${date}</div>
        <div class="edit-star-form">
            <a class="btn-text" onclick="removeStar(event)" missionId=${mission} missionerId=${missioner} starId=${star}>Eliminar Estrella</>
            <a class="btn-text" onclick="saveStar(event)" missionId=${mission} missionerId=${missioner} starId=${star}>Guardar Cambios</a>
        </div>`,
        showConfirmButton: false,
    })    
}

async function saveStar(event) {
    const newComment = document.getElementById("comment").value
    const missionId = event.target.getAttribute("missionId")
    const missionerId = event.target.getAttribute("missionerId")
    const starId = event.target.getAttribute("starId")   
    Swal.fire({
        html: 
            `<h2>Guardando</h2>`,
        showConfirmButton: false,
    })
    Swal.showLoading()
    try{
        const data = {missionId, missionerId, starId, newComment}
        await fetch("/star", {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }catch(err){
        console.log('Error al añadir estrella. Error: ', err);
        Swal.fire({
            html: "Error al añadir estrella",
            showConfirmButton: false,
            timer: 1300,
        })
    }
    Swal.close()
    location.reload()
}

async function removeStar(event){    
    const missionId = event.target.getAttribute("missionId")
    const missionerId = event.target.getAttribute("missionerId")
    const starId = event.target.getAttribute("starId")
    Swal.fire({
        html: 
            `<h2>Guardando</h2>`,
        showConfirmButton: false,
    })
    Swal.showLoading()
    try {
        const data = { missionId, missionerId, starId }
        await fetch('/star', {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch(error) {
        console.log(error)        
    }
    Swal.close()
    location.reload()
}

async function getComment(starId) {
    const data = await fetch(`/star/${starId}`)
    const star = await data.json()
    const {comment} = star.star
    return comment   
}