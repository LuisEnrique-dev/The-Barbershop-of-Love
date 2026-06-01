document.addEventListener("DOMContentLoaded", function() {
    console.log("¡Contacto.js iniciado con éxito!");

    const botonContacto = document.getElementById("btn-contacto");
    console.log("¿El botón existe en el HTML?:", botonContacto);

    if (!botonContacto) {
        console.error("ERROR CRÍTICO: No se encontró el elemento con ID 'btn-contacto'. El script se detuvo.");
        return;
    }

    botonContacto.addEventListener("click", function(evento) {
        evento.preventDefault();
        console.log("¡Clic detectado con éxito! Procesando formulario...");

        // Usamos try/catch por si algún input no existe en el HTML y rompe el flujo
        try {
            const elCorreo = document.getElementById("contacto-correo");
            const elServicio = document.getElementById("contacto-servicio");
            const elNotas = document.getElementById("contacto-notas");

            if (!elCorreo || !elServicio) {
                alert("Error técnico: Faltan los campos obligatorios en el HTML (contacto-correo o contacto-servicio).");
                return;
            }

            const datosContacto = {
                correo: elCorreo.value,
                servicio: elServicio.value,
                notas: elNotas ? elNotas.value : ""
            };

            if (!datosContacto.correo || !datosContacto.servicio) {
                alert("Por favor, introduce tu correo electrónico y selecciona un servicio VIP.");
                return;
            }

            console.log("Datos listos para enviar:", datosContacto);

            fetch("Contacto.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosContacto)
            })
            .then(respuesta => {
                console.log("Respuesta cruda del servidor:", respuesta);
                return respuesta.json();
            })
            .then(datos => {
                console.log("JSON decodificado:", datos);
                if (datos.status === "success") {
                    alert("¡Tu solicitud de contacto ha sido enviada con éxito!");
                    elCorreo.value = "";
                    elServicio.value = "";
                    if(elNotas) elNotas.value = "";
                } else {
                    alert("Hubo un error en el servidor: " + datos.message);
                }
            })
            .catch(error => {
                console.error("Error en la petición Fetch:", error);
                alert("No se pudo conectar con el servidor de contacto. Revisa la consola.");
            });

        } catch (errorInterno) {
            console.error("Ocurrió un error leyendo las variables dentro del evento click:", errorInterno);
        }
    });
});