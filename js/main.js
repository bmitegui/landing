let ready = () => {
    console.log('DOM está listo')
}

let loaded = () => {
    console.log('Iframes e Images cargadas')
    let myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();

        const emailElement = document.querySelector('.form-control-lg');

        emailElement.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(25px)" },
                { transform: "translateX(-25px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 400,
                easing: "linear",
            }
        )

        const emailText = emailElement.value;

        if (emailText.length === 0) {
            emailElement.focus()
        }
    })

}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)