const nameInput = document.querySelector('#name')
const fillName = nameInput.getAttribute("fill")
const passwordInput = document.querySelector('#password')
const fillPassword = passwordInput.getAttribute("fill")
nameInput.value = fillName
passwordInput.value = fillPassword
nameInput.focus()
if(fillName){
    Swal.fire({
        html: 'El usuario ya existe',
        showConfirmButton: false,
        timer: 1700,
    });
}
