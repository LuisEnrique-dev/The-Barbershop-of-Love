/* Script para funcionalidad*/
  const form = document.getElementById('form-reseña');
  const listaReseñas = document.getElementById('lista-reseñas');
  const promedioEl = document.getElementById('promedio');

  let totalReseñas = 0;
  let sumaEstrellas = 0;

  function actualizarPromedio() {
    if (totalReseñas === 0) {
      promedioEl.textContent = "Promedio de puntuación: 0.0 ⭐";
    } else {
      const promedio = (sumaEstrellas / totalReseñas).toFixed(1);
      promedioEl.textContent = `Promedio de puntuación: ${promedio} ⭐`;
    }
  }

  function crearEstrellas(valor) {
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
      estrellas += i <= valor ? "⭐" : "☆";
    }
    return estrellas;
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const reseña = document.getElementById('reseña').value;
    const rating = parseInt(document.getElementById('estrellas').value);

    const nuevaCard = document.createElement('div');
    nuevaCard.classList.add('card');

    // Mostrar solo los primeros 120 caracteres
    const textoCorto = reseña.length > 120 ? reseña.substring(0, 120) + "..." : reseña;

    nuevaCard.innerHTML = `
      <div class="card-header">
        <h3>${nombre}</h3>
        <div class="estrellas">${crearEstrellas(rating)}</div>
      </div>
      <div class="card-body">
        <p class="texto">${textoCorto}</p>
        ${reseña.length > 120 ? '<button class="leer-mas">Leer más</button>' : ''}
      </div>
      <button class="btn-eliminar">Eliminar</button>
    `;

    listaReseñas.appendChild(nuevaCard);

    // Actualizar promedio
    totalReseñas++;
    sumaEstrellas += rating;
    actualizarPromedio();

    // Botón eliminar
    nuevaCard.querySelector('.btn-eliminar').addEventListener('click', () => {
      nuevaCard.remove();
      totalReseñas--;
      sumaEstrellas -= rating;
      actualizarPromedio();
    });

    // Botón leer más con scroll interno
    const btnLeerMas = nuevaCard.querySelector('.leer-mas');
    if (btnLeerMas) {
      btnLeerMas.addEventListener('click', () => {
        const textoEl = nuevaCard.querySelector('.texto');
        if (btnLeerMas.textContent === "Leer más") {
          textoEl.textContent = reseña;
          textoEl.classList.add("scrollable");
          btnLeerMas.textContent = "Leer menos";
        } else {
          textoEl.textContent = textoCorto;
          textoEl.classList.remove("scrollable");
          btnLeerMas.textContent = "Leer más";
        }
      });
    }

    form.reset();
  });

  actualizarPromedio();