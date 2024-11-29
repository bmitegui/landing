const databaseURL = 'https://landing-678d3-default-rtdb.firebaseio.com/collection.json';

// Función para enviar datos al servidor
let sendData = () => {
    // Obtén los datos del formulario
    const formData = new FormData(document.getElementById('contact-form'));
    const data = Object.fromEntries(formData.entries()); // Convierte FormData a objeto
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    // Realizar la solicitud POST a Firebase
    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(data) // Convierte los datos a JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json(); // Procesa la respuesta como JSON
        })
        .then(result => {
            alert('Gracias por contactarnos, nos aseguraremos de mantenernos en contacto!'); // Respuesta exitosa
            document.getElementById('contact-form').reset(); // Resetear el formulario
            getData(); // Actualizar la lista de datos mostrada
        })
        .catch(error => {
            alert('Hubo un error al procesar tu solicitud. ¡Intenta de nuevo más tarde!'); // Manejar error
        });
}

// Función para obtener los datos de los contactos desde Firebase
let getData = async () => {
    try {
        // Realiza la petición fetch para obtener los datos
        const response = await fetch(databaseURL);

        if (!response.ok) {
            alert('Hubo un error al obtener los datos. ¡Vuelve pronto!'); // Manejar error
            return; // Salir de la función si no hay respuesta
        }

        const data = await response.json();

        if (data != null) {
            // Mapas para contar suscriptores y votos por personaje
            let countContacts = new Map();
            let countCharacters = {
                meredith: 0,
                derek: 0,
                bailey: 0
            };

            // Recorrer los datos recibidos y contar las entradas
            for (let key in data) {
                let { email, saved, 'favorite-character': character } = data[key];

                // Obtener solo la fecha (sin la hora)
                let date = saved.split(",")[0];

                // Contar suscriptores por fecha
                let count = countContacts.get(date) || 0;
                countContacts.set(date, count + 1);

                // Contar votos por personaje
                if (character === 'meredith') {
                    countCharacters.meredith++;
                } else if (character === 'derek') {
                    countCharacters.derek++;
                } else if (character === 'bailey') {
                    countCharacters.bailey++;
                }
            }

            // Mostrar los datos en una tabla
            const dataTable = document.getElementById('data-table');
            dataTable.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            // Mostrar los suscriptores por fecha y votos por personaje
            for (let [date, count] of countContacts) {
                const rowTemplate = `
                    <tr>
                        <th scope="row">${date}</th>
                        <td>${count}</td>
                    </tr>`;
                dataTable.innerHTML += rowTemplate;
            }

            // Mostrar los votos por personaje de manera separada
            const characterVotesSection = document.getElementById('character-votes');
            characterVotesSection.innerHTML = `
                <p>Meredith Grey: ${countCharacters.meredith} votos</p>
                <p>Derek Shepherd: ${countCharacters.derek} votos</p>
                <p>Miranda Bailey: ${countCharacters.bailey} votos</p>
            `;
        }

    } catch (error) {
        alert('Hubo un error al procesar la solicitud. ¡Intenta de nuevo más tarde!');
    }
}


// Función para asegurarse de que el DOM esté listo
let ready = () => {
    console.log('DOM está listo');
}

// Función para manejar los eventos de carga
let loaded = () => {
    console.log('Iframes e imágenes cargadas');
    const myform = document.getElementById('contact-form');
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault(); // Prevenir el comportamiento por defecto

        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;

        if (emailText.length === 0) {
            // Animación si no se ingresa un email
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
            );
            emailElement.focus();
            return;
        }

        sendData(); // Llamar a la función para enviar los datos
    });
}

// Esperar que el DOM se cargue
window.addEventListener("DOMContentLoaded", () => {
    // Llamar a getData cuando la página se cargue
    getData();
});
// Esperar que todo se haya cargado completamente
window.addEventListener("load", loaded);
