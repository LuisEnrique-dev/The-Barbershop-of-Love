function generarIdTicket() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `#${ts}-${rand}`;
}

function formatearFecha(date) {
  return date.toLocaleDateString("es-DO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function convertirHora12a24(horaStr) {
  const [time, period] = horaStr.split(" ");
  let [h, m] = time.split(":").map(Number);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function calcularVencimiento(fechaStr, horaStr) {
  try {
    const [year, month, day] = fechaStr.split("-").map(Number);
    const hora24 = convertirHora12a24(horaStr);

    const [hh, mm] = hora24.split(":").map(Number);

    const cita = new Date(year, month - 1, day, hh, mm);

    cita.setHours(cita.getHours() + 2);

    return formatearFecha(cita) + ` a las ${horaStr} (+2 h)`;

  } catch {
    const fallback = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return formatearFecha(fallback);
  }
}

function mostrarError(inputId) {
  const el = document.getElementById(inputId);

  el.style.borderColor = "#ff4444";
  el.style.boxShadow = "0 0 10px rgba(255,68,68,0.4)";

  el.addEventListener("input", () => {
    el.style.borderColor = "";
    el.style.boxShadow = "";
  }, { once: true });

  el.addEventListener("change", () => {
    el.style.borderColor = "";
    el.style.boxShadow = "";
  }, { once: true });
}

function validarFormulario(nombre, servicio, barbero, fecha, hora) {

  let ok = true;

  if (!nombre.trim()) {
    mostrarError("nombre");
    ok = false;
  }

  if (!servicio) {
    mostrarError("servicio");
    ok = false;
  }

  if (!barbero) {
    mostrarError("barbero");
    ok = false;
  }

  if (!fecha) {
    mostrarError("fecha");
    ok = false;

  } else {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    if (new Date(fecha + "T00:00:00") < hoy) {
      mostrarError("fecha");
      ok = false;
    }
  }

  if (!hora) {
    mostrarError("hora");
    ok = false;
  }

  // NUEVA ALERTA
  if (!ok) {
    alert("Debes completar todos los campos antes de reservar.");
  }

  return ok;
}

function generarTicket() {

  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const barbero = document.getElementById("barbero").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!validarFormulario(
      nombre,
      servicio,
      barbero,
      fecha,
      hora
  )) return;

  document.getElementById("ticketNum").textContent = generarIdTicket();

  document.getElementById("tk-nombre").textContent = nombre.trim();
  document.getElementById("tk-servicio").textContent = servicio;
  document.getElementById("tk-barbero").textContent = barbero;
  document.getElementById("tk-fecha").textContent =
      formatearFecha(new Date(fecha + "T00:00:00"));

  document.getElementById("tk-hora").textContent = hora;

  document.getElementById("tk-vence").textContent =
      calcularVencimiento(fecha, hora);

  document.getElementById("reserva").style.display = "none";

  document.getElementById("ticket-section").style.display = "block";

  document.getElementById("ticket-section")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
}

function nuevoTicket() {

  ["nombre","servicio","barbero","fecha","hora"]
    .forEach(id => document.getElementById(id).value = "");

  document.getElementById("ticket-section").style.display = "none";

  document.getElementById("reserva").style.display = "block";

  document.getElementById("reserva")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}

window.addEventListener("DOMContentLoaded", () => {

  const hoy = new Date()
      .toISOString()
      .split("T")[0];

  document
      .getElementById("fecha")
      .setAttribute("min", hoy);

});