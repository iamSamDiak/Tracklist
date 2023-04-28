function disableClicks(event){
    event.preventDefault()
}

function ifErrorStart(){            
    const container = document.querySelector(".container")
    const ifError = document.querySelector(".if-error")

    container.classList.add("disabled")
    ifError.classList.remove("hidden")

    container.addEventListener('click', disableClicks)
}

function ifErrorEnd(){            
    const container = document.querySelector(".container")
    const ifError = document.querySelector(".if-error")

    container.classList.remove("disabled")
    ifError.classList.add("hidden")

    container.removeEventListener('click', disableClicks)
}

const errorButton = document.querySelector(".if-error-ok p")
errorButton.onclick = () => {
    ifErrorEnd()
}