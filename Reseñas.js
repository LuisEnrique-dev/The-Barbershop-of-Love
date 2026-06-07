document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("form-reseña");
    const listaReseñas = document.getElementById("lista-reseñas");
    const botonEnviar = document.getElementById("btn-enviar-resena");

    cargarReseñas();

    function cargarReseñas() {

        fetch("obtener_reseñas.php")
            .then(response => response.json())
            .then(reseñas => {

                listaReseñas.innerHTML = "";

                reseñas.forEach(resena => {

                    const estrellas = "⭐".repeat(
                        Number(resena.calificacion)
                    );

                    const card = document.createElement("div");

                    card.classList.add("card");

                    card.innerHTML = `
                        <h3>${resena.nombre} ${estrellas}</h3>
                        <p>"${resena.reseña}"</p>
                    `;

                    listaReseñas.appendChild(card);

                });

            })
            .catch(error => {
                console.error(error);
            });

    }

    botonEnviar.addEventListener("click", function (event) {

        event.preventDefault();

        const nombreInput = document.getElementById("nombre");
        const reseñaInput = document.getElementById("reseña");
        const ratingRadio = document.querySelector(
            'input[name="calificacion"]:checked'
        );

        if (!nombreInput.value.trim()) {
            alert("Por favor escribe tu nombre.");
            return;
        }

        if (!reseñaInput.value.trim()) {
            alert("Por favor escribe tu reseña.");
            return;
        }

        if (!ratingRadio) {
            alert("Selecciona una calificación.");
            return;
        }

        const datosResena = {
            nombre: nombreInput.value.trim(),
            reseña: reseñaInput.value.trim(),
            calificacion: parseInt(ratingRadio.value)
        };

        fetch("Reseñas.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosResena)
        })
        .then(response => response.json())
        .then(datos => {

            if (datos.status === "success") {

                form.reset();

                cargarReseñas();

                alert("¡Gracias por tu reseña!");

            } else {

                alert(datos.message);

            }

        })
        .catch(error => {

            console.error(error);

            alert("Error al conectar con el servidor.");

        });

    });

});