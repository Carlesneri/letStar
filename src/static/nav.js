const userLinks = document.getElementById("user-links")
const downLinksArrow = document.getElementById("downLinksArrow")

downLinksArrow.addEventListener("click", clickArrowHandler)

function clickArrowHandler(){
    if(!userLinks.classList.contains("down-links")){
        userLinks.classList.add("down-links")
        setTimeout(addBodyListener, 1)
    }
}

function addBodyListener(){
    document.body.addEventListener("click", clickBodyHandler)
}

function clickBodyHandler(event){
    if(!event.target.classList.contains("down-links")) {
        userLinks.classList.remove("down-links")
    }
    document.body.removeEventListener("click", clickBodyHandler)
}