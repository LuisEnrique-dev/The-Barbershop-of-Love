document.addEventListener("DOMContentLoaded", function() {
    console.log("¡Reseñas.js listo!");

    const form = document.getElementById('form-reseña');
    const listaReseñas = document.getElementById('lista-reseñas');
    const botonEnviar = document.getElementById('btn-enviar-resena');

    if (botonEnviar) {
        botonEnviar.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Usamos un bloque de seguridad para que la página nos avise el error exacto
            try {
                const nombreInput = document.getElementById('nombre');
                const reseñaInput = document.getElementById('reseña');
                const ratingRadio = document.querySelector('input[name="calificacion"]:checked');

                // Validamos que los elementos existan en el HTML
                if (!nombreInput || !reseñaInput) {
                    alert("Error técnico: No se encontraron los campos con ID 'nombre' o 'reseña' en tu HTML.");
                    return;
                }

                if (!nombreInput.value.trim() || !reseñaInput.value.trim()) {
                    alert("Por favor, escribe tu nombre y tu opinión antes de enviar.");
                    return;
                }

                if (!ratingRadio) {
                    alert("Por favor, selecciona una estrella para calificarnos.");
                    return;
                }

                // Si todo está bien, preparamos los datos
                const datosResena = {
                    nombre: nombreInput.value.trim(),
                    reseña: reseñaInput.value.trim(),
                    calificacion: parseInt(ratingRadio.value)
                };

                alert("¡Paso de validación exitoso! Enviando a la base de datos...");

                fetch("Reseñas.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datosResena)
                })
                .then(respuesta => respuesta.json())
                .then(datos => {
                    if (datos.status === "success") {
                        alert("¡Éxito total! Tu reseña se guardó en la base de datos.");
                        if (listaReseñas) {
                            const nuevaCard = document.createElement('div');
                            nuevaCard.classList.add('card');
                            nuevaCard.innerHTML = `<h3>${datosResena.nombre}</h3><p>"${datosResena.reseña}"</p>`;
                            listaReseñas.appendChild(nuevaCard);
                        }
                        if (form) form.reset();
                    } else {
                        alert("Error en el servidor: " + datos.message);
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert("No se pudo conectar con el archivo PHP. Asegúrate de estar usando localhost en XAMPP.");
                });

            } catch (errorFatal) {
                alert("Ocurrió un error leyendo el formulario: " + errorFatal.message);
            }
        });
    }
});