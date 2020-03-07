async function active(e){
    const {target} = e
    const missionId = e.target.name
    const $remindStars = `#rem-stars-${missionId}`
    let changingStarSwal 
    const missioner = e.target.getAttribute("missioner")
    const $finished = `#finished-${missionId}`
    var finished = document.querySelector($finished)
    var remindStars = Number(document.querySelector($remindStars).innerText)
    
    try{
        if(target.classList.contains("active-star")) {
            await removeStar(missionId, missioner)
        }
        else{
            if(remindStars > 0){
                await addStar(missionId, missioner)
            } else{
                Swal.fire({
                    html: "Ya has conseguido el objetivo",
                    showConfirmButton: false,
                    timer: 1700,
                });
            }
        }
        if(document.querySelector($remindStars).innerText < 1){
            finished.innerText = "Conseguido!"
            finished.classList.add("appears")
        }else {
            finished.innerText = ""
            finished.classList.remove("appears")
        }
    }
    catch(err){
        console.log(err);
        Swal.fire({
            html: "Error en la petición",
            showConfirmButton: false,
            timer: 1700,
        });
    }
    if(changingStarSwal) {
        setTimeout(() => changingStarSwal.close(), 500)
    }

    async function addStar(id, missioner){
        const data = {id, missioner}
        target.classList.add("active-star")
        
        await fetch("/mission/add-star", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const res = await fetch(`/mission/${id}`)
        const response = await res.json()
        const {mission} = response
        const totalStars = getTotalStars(mission)   
        document.querySelector($remindStars).innerText = mission.target - totalStars
    }
    
    async function removeStar(id, missioner){
        const data = {id, missioner}
        target.classList.remove("active-star")
        
        await fetch("/mission/remove-star", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const res = await fetch(`/mission/${id}`)
        
        const response = await res.json()
        
        const {mission} = response
        
        const totalStars = getTotalStars(mission)        
        document.querySelector($remindStars).innerText = mission.target - totalStars
    }
}

function getTotalStars(mission){
    var accum = 0;
    for(let i = 0; i < mission.missioners.length; i++){
        accum += mission.missioners[i].stars
    }
    return accum;  
}
