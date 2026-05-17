/* ========================= */
/* SISTEMA DE OFERTAS */
/* ========================= */

const ofertas = [

  {
    nombre: "Outline & Fresh Up",
    descripcion: "Sharp hairline and clean outlines.",
    precioAntes: "15€",
    precioAhora: "10€",
    tiempo: "20 min",
    imagen: "img/outline.jpg",
    finaliza: "2026-06-25T23:59:59"
  },

  {
    nombre: "Haircut & Beard",
    descripcion: "Crisp haircut & beard combo fade & shape.",
    precioAntes: "45€",
    precioAhora: "30€",
    tiempo: "1 hora",
    imagen: "img/beard.jpg",
    finaliza: "2026-06-20T23:59:59"
  },

  {
    nombre: "Men Cornrows",
    descripcion: "Done with your natural hair.",
    precioAntes: "75€",
    precioAhora: "50€",
    tiempo: "1h 40m",
    imagen: "img/cornrows.jpg",
    finaliza: "2026-06-18T23:59:59"
  }

];

const contenedor = document.getElementById("contenedorOfertas");

function crearOfertas(){

  contenedor.innerHTML = "";

  ofertas.forEach((oferta,index)=>{

    const fechaFinal = new Date(oferta.finaliza);
    const ahora = new Date();

    if(fechaFinal > ahora){

      contenedor.innerHTML += `

      <div class="card-oferta">

        <div class="badge">
          OFERTA 🔥
        </div>

        <div class="img-oferta">
          <img src="${oferta.imagen}">
        </div>

        <div class="info-oferta">

          <h3>${oferta.nombre}</h3>

          <p>${oferta.descripcion}</p>

          <div class="precios">

            <span class="precio-viejo">
              ${oferta.precioAntes}
            </span>

            <span class="precio-nuevo">
              ${oferta.precioAhora}
            </span>

          </div>

          <div class="extra">

            <span>⏱ ${oferta.tiempo}</span>

            <span>💈 BarberShop</span>

          </div>

          <button class="btn-reservar">
            Reservar Oferta
          </button>

          <div class="contador" id="contador-${index}">
            Cargando oferta...
          </div>

        </div>

      </div>

      `;
    }

  });

}

crearOfertas();

/* ========================= */
/* CONTADOR EN TIEMPO REAL */
/* ========================= */

function actualizarContadores(){

  ofertas.forEach((oferta,index)=>{

    const contador = document.getElementById(`contador-${index}`);

    if(!contador) return;

    const ahora = new Date().getTime();

    const final = new Date(oferta.finaliza).getTime();

    const distancia = final - ahora;

    if(distancia <= 0){

      contador.innerHTML = "Oferta Finalizada";

      return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));

    const horas = Math.floor(
      (distancia % (1000 * 60 * 60 * 24))
      / (1000 * 60 * 60)
    );

    const minutos = Math.floor(
      (distancia % (1000 * 60 * 60))
      / (1000 * 60)
    );

    const segundos = Math.floor(
      (distancia % (1000 * 60))
      / 1000
    );

    contador.innerHTML = `
      Termina en:
      ${dias}d ${horas}h ${minutos}m ${segundos}s
    `;
  });

}

setInterval(actualizarContadores,1000);

actualizarContadores();



