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
        <div class="swal-buttons">
            <a class="btn-text" onclick="newStar(event)" missionId=${mission} missionerId=${missioner} >Guardar</>
            <a class="btn-text" onclick="closeSwal()">Cancelar</>
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

function editStar(event) {
    const mission = event.target.getAttribute("mission")
    const missioner = event.target.getAttribute("missioner")
    const star = event.target.getAttribute("star")
    const date = event.target.getAttribute("date")
    const comment = event.target.getAttribute("comment")
    Swal.fire({
        html:
        `<h2>Editar estrella</h2>
        <div>
            <input type="text" id="comment" class="comment" value="${comment}"></input>
        </div>
        <div>${date}</div>
        <div class="edit-star-form swal-buttons">
            <a class="btn-text" onclick="saveStar(event)" missionId=${mission} missionerId=${missioner} starId=${star}>Guardar Cambios</a>
            <a class="btn-text" onclick="removeStar(event)" missionId=${mission} missionerId=${missioner} starId=${star}>Eliminar Estrella</>
            <a class="btn-text" onclick="closeSwal()">Cancelar</>
        </div>`,
        showConfirmButton: false,
    })    
    document.getElementById("comment").blur()
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

function viewerMissionHandler(missionId, observersEmail, observersRol){
    Swal.fire({
        html:
        `<h2>Compartir misión</h2>
        <ul class="viewers" id="viewersUl"></ul>
        <div>
            <label for="missionViewer">Email</label>
            <input class="email-share-mission" type="email" id="missionViewer" placeholder="Email"></input> 
        </div>
        <div class="swal-share-mission-select">
            <label for="missionViewerRole">Rol</label>
            <select id="missionViewerRole">
                <option value="read" selected>Observador</option>
                <option value="write">Editor</option>
            </select>
        </div>
        <div id="isEmail" class="is-email"></div>  
            <div class="swal-buttons">     
                <a class="btn-text" onclick="shareMission('${missionId}')">Compartir</a>
                <a class="btn-text" onclick="closeSwal()">Cerrar</a>
            </div>
        </div>`,
        showConfirmButton: false,
    })    
    
    const observersEmailArr = observersEmail.split(',')   
    const observersRoleArr = observersRol.split(',')   
    const viewersUl = document.getElementById("viewersUl")
    if (observersEmail !== '' && observersEmailArr.length > 0){
        viewersUl.innerHTML = `<div>Compartido con: </div>`
        observersEmailArr.forEach((email, index) => {
        const role = observersRoleArr[index] === "write" ? "Editor" : "Observador"
            viewersUl.innerHTML += 
            `
                <li>
                    <div id="sharedUsers">
                        <span class="shared-email">${email} </span>
                        <span> (${role})</span>
                    </div>
                    <i class="fas fa-user-times custom-icon" 
                    title="Eliminar" 
                    onclick="removeViewer('${missionId}', '${email}')"></i>
                </li>
            `
        })
    }
}
    
async function shareMission(missionId){
    const missionViewerInput = document.getElementById("missionViewer")
    const missionViewerRoleInput = document.getElementById("missionViewerRole")
    const viewer = missionViewerInput.value.trim()
    const role = missionViewerRoleInput.value
    const isEmail = validateEmail(viewer)
    const isEmailNode = document.getElementById("isEmail")
    if(!isEmail){
        isEmailNode.innerText = "Email no válido"
        missionViewerInput.focus()
    }    
    else{
        let isShared = false
        const $sharedEmails = document.querySelectorAll(".shared-email") 
        if ($sharedEmails){
            const sharedEmails = []
            $sharedEmails.forEach(el => sharedEmails.push(el.innerText.trim()))
            sharedEmails.forEach(sharedEmail => {
                if (sharedEmail === viewer){                
                    isShared = true
                    isEmailNode.innerText = `Ya has compartido la misión con ${viewer}`
                    missionViewerInput.focus()
                }
            })
        }
        if(isShared === false){
            isEmailNode.innerText = ""
            Swal.showLoading()
            try{
                const data = {missionId, viewer, role}
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
}

async function removeViewer(missionId, email){
    Swal.showLoading()
    try{
        const data = { missionId, email }
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
    Swal.showLoading()
    try{
        const data = { missionId, email: '_myEmail' }
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

function editMissionHandler(missionId){
    const missionElement = document.getElementById(missionId)
    const titleText = missionElement.getElementsByClassName("mission-name")[0].innerText
    const missionersText = []
    const missionerElements = missionElement.getElementsByClassName("missioner-name")
    for(let i in missionerElements){
        if(missionerElements[i].innerText) missionersText.push(missionerElements[i].innerText)
    }
    const descText = missionElement.getElementsByClassName("desc")[0].innerText    
    const targetText = missionElement.getElementsByClassName("mission-title-data-item")[0].innerText.split(': ')[1]    
    Swal.fire({
        html: `
            <form class="swal-edit-mission" action="/mission/${missionId}" method="POST">
                <h2>Editar misión</h2>
                <div>
                    <label for="title">Título</label>
                    <input type="text" id="title" name="title" value="${titleText}" autofocus>
                </div>
                <div class="new-mission-desc input-desc">
                    <label for="desc">Descripción</label>
                    <textarea id="desc" name="desc" value="descText">${descText}</textarea>  
                </div>
                <div class="missioners" id="missioners">
                    <!-- Aquí los input de los misioneros -->
                </div>
                <div class="target-container">
                    <label for="input-target">Objetivo:</label>
                    <div class="target" id="target">
                        <input type="number" name="target" min="1" max="1000" id="input-target" class="input-target" value=${targetText} plac>
                    </div>
                </div>
                <div class="swal-date-container">
                    <label for="input-date">Fecha límite</label>
                    <div class="date" id="date">
                        <input type="date" name="date" id="input-date" class="input-date">
                    </div>
                </div>
                <div class="swal-buttons">
                    <button class="empty-button" type="submit">Guardar</button>
                    <a onclick="closeSwal()">Cancelar</a>
                </div>
            </form>
        `,
        showConfirmButton:false
    })
    
    const missionersElement = document.getElementById("missioners")
    missionersText.forEach((missioner, index) => {
        missionersElement.innerHTML += `
            <div>
                <label for="missioner-${index}">Misionero ${index + 1}</label>
                <input type="text" name="missioner" id="missioner-${index}" value=${missioner}>
            </div>
        `
    })
}

