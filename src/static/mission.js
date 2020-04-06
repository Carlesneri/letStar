function closeSwal(){
    return Swal.close()
}

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
    await Swal.fire({
        html:
        `<h2>Editar estrella</h2>
        <div><input type="text" id="comment" class="comment" value="${comment}"></input></div>
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

function viewerMissionHandler(missionId, viewers){
    Swal.fire({
        html:
        `<h2>Compartir misión</h2>
        <p class="viewers-info">Sólo tú puedes editar la misión</p>
        <ul class="viewers" id="viewersUl"></ul>
        <input class="email-share-mission" type="email" id="missionViewer" placeholder="Email"></input> 
        <div id="isEmail" class="is-email"></div>       
        <a class="btn-text" onclick="shareMission('${missionId}')">Compartir</a>
        </div>`,
        showConfirmButton: false,
    })    
    const viewersArr = viewers.split(',')   
    const viewersUl = document.getElementById("viewersUl")
    if (viewers && viewersArr.length > 0){
        viewersUl.innerHTML = `<div>Compartido con: </div>`
        viewersArr.forEach(viewer => {
            viewersUl.innerHTML += 
            `
                <li>
                    <div>
                        ${viewer}
                    </div>
                    <i class="fas fa-trash custom-icon" 
                    title="Eliminar"
                    onclick="removeViewer('${missionId}', '${viewer}')"></i>
                </li>
            `
        })
    }
}
    
async function shareMission(missionId){
    const missionViewerInput = document.getElementById("missionViewer")
    const viewer = missionViewerInput.value.trim()
    const isEmail = validateEmail(viewer)
    const isEmailNode = document.getElementById("isEmail")
    if(!isEmail){
        isEmailNode.innerText = "Email no válido"
        missionViewerInput.focus()
    }    
    else{
        isEmailNode.innerText = ""
        Swal.showLoading()
        try{
            const data = {missionId, viewer}
            await fetch("/viewers", {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            Swal.close()
            location.reload()        
        }catch(err){
            console.log('Error al compartir misión. Error: ', err);
            Swal.fire({
                html: "Error compartir misión",
                showConfirmButton: false,
                timer: 1300,
            })
        }
        Swal.close()
        location.reload()
    }    
}

async function removeViewer(id, viewer){
    const missionId = id
    Swal.showLoading()
    try{
        const data = { missionId, viewer }
        await fetch("/viewers", {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        Swal.close()
        location.reload()        
    }catch(err){
        console.log('Error al eliminar usuario. Error: ', err);
        Swal.fire({
            html: "Error al eliminar usuario",
            showConfirmButton: false,
            timer: 1300,
        })
    }
    Swal.close()
    location.reload()
}

function validateEmail(email){
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRe.test(email)
}

function showStarInfo(comment, date){
    Swal.fire({
        html: `<div>${comment}</div>
            <div>${date}</div>
            <a class="btn-text" onclick="Swal.close()">Cerrar</a>`,
        showConfirmButton: false
    })
}

async function getOwner(id){
    const response = await fetch(`/user/${id}`)
    const user = await response.json()
    Swal.fire({
        html: 
            `<div>
                Compartida por ${user.email}
            </div>
            <div>
                <a onclick="closeSwal()">Cerrar</a>
            </div>`, 
        showConfirmButton: false
    })
}

async function removeMeAsAViewerHandler(missionId){
    Swal.fire({
        html:
        `
            <p >¿Quieres eliminar esta misión de tu lista?</p>
            <div class="remove-viewer">
                <a class="btn-text" onclick="removeMeAsAViewer('${missionId}')">Sí</a>
                <a class="btn-text" onclick="closeSwal()">Cancelar</a>
            </div>
        `,
        showConfirmButton: false,
    })
}

async function removeMeAsAViewer(missionId){
    Swal.fire({
        html: "Eliminado misión de tu lista",
        showConfirmButton: false
    })
    Swal.showLoading()
    try{
        const viewer = '_myEmail'
        const data = { missionId, viewer }
        await fetch("/viewers", {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        Swal.close()
        location.reload()        
    }catch(err){
        console.log('Error al eliminar misión. Error: ', err);
        Swal.fire({
            html: "Error al eliminar misión",
            showConfirmButton: false,
            timer: 1300,
        })
    }
    Swal.close()
    location.reload()
}
