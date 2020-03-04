
async function active(e){
    let changingStarSwal 
    const missionId = e.target.name
    const missioner = e.target.getAttribute("missioner")
    const $finished = `#finished-${missionId}`
    var finished = document.querySelector($finished)
    const $remindStars = `#rem-stars-${missionId}`
    var remindStars = Number(document.querySelector($remindStars).innerText)
    try{
        if(e.target.classList.contains("active-star")) {
            // changingStarSwal = Swal.fire({
            //     html: "Quitando estrella",
            //     showConfirmButton: false, 
            //     scrollbarPadding: false,
            //     customClass: {
            //         container: "swal-star"
            //     }
            // })
            await removeStar(missionId, missioner)
            e.target.classList.remove("active-star")
            document.querySelector($remindStars).innerText = remindStars + 1
        }
        else{
            if(remindStars > 0){
                // changingStarSwal = Swal.fire({
                //     scrollbarPadding: true,
                //     html: "Añadiendo estrella",
                //     showConfirmButton: false,
                // })
    
                await addStar(missionId, missioner)
                e.target.classList.add("active-star")
                document.querySelector($remindStars).innerText = remindStars - 1
            } else{
                // const response = addStar(missionId, missioner)
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
    setTimeout(() => changingStarSwal.close(), 500)
}

async function addStar(id, missioner){
    const data = {id, missioner}
    await fetch("/mission/add-star", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function removeStar(id, missioner){
    const data = {id, missioner}
    await fetch("/mission/remove-star", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

{/* <form 
action="/mission/add-star/{{../../_id}}?_method=PUT" 
missionId={{../../_id}}
method="POST"
class="star-form"
>
{{!-- <input type="hidden" name="missionId" value={{../../_id}}>
<input type="hidden" name="action" value="add-star"> --}}
<button type="submit" name="missioner" value={{missioner.name}} id="star-button" class="star-btn">
    <img src="./images/star@0,1x.png" name={{../../_id}} missioner={{missioner.name}} class="missioner-star {{missioner.name}}">
</button> */}
