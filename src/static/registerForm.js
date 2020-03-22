const nameInput = document.querySelector('#name')
const fillName = nameInput.getAttribute("fill")
const emailInput = document.querySelector('#email')
const fillEmail = emailInput.getAttribute("fill")
const passwordInput = document.querySelector('#password')
const fillPassword = passwordInput.getAttribute("fill")
nameInput.value = fillName
emailInput.value = fillEmail
passwordInput.value = fillPassword
nameInput.focus()
