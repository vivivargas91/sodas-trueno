function crearLinea(etiqueta, valor) {
  const p = document.createElement("p");
  const fuerte = document.createElement("strong");
  fuerte.textContent = etiqueta + ": ";
  p.append(fuerte, document.createTextNode(valor));
  return p;
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return partes.length === 3 ? partes[2] + "/" + partes[1] + "/" + partes[0] : fecha;
}

function crearTarjeta(visita) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta" + (visita.favorita ? " favorita" : "");

  const titulo = document.createElement("h3");
  titulo.textContent = visita.soda;

  const estrellas = document.createElement("p");
  estrellas.className = "estrellas";
  estrellas.textContent = "★".repeat(visita.calificacion) + "☆".repeat(5 - visita.calificacion);
  estrellas.setAttribute("aria-label", "Calificación " + visita.calificacion + " de 5");

  const acciones = document.createElement("div");
  acciones.className = "acciones";

  const btnFav = document.createElement("button");
  btnFav.type = "button";
  btnFav.className = "boton";
  btnFav.dataset.accion = "favorita";
  btnFav.dataset.id = visita.id;
  btnFav.setAttribute("aria-pressed", String(visita.favorita));
  btnFav.textContent = (visita.favorita ? "★" : "☆") + " Favorita";

  const btnBorrar = document.createElement("button");
  btnBorrar.type = "button";
  btnBorrar.className = "boton boton-borrar";
  btnBorrar.dataset.accion = "borrar";
  btnBorrar.dataset.id = visita.id;
  btnBorrar.textContent = "Borrar";

  acciones.append(btnFav, btnBorrar);

  tarjeta.append(
    titulo,
    estrellas,
    crearLinea("Provincia", visita.provincia),
    crearLinea("Plato", visita.plato),
    crearLinea("Fecha", formatearFecha(visita.fecha)),
    crearLinea("Compa", visita.compa),
    crearLinea("¿Volvería?", visita.volveria ? "Sí" : "No"),
    acciones
  );
  return tarjeta;
}

function pintarTarjetas(contenedor, visitas) {
  contenedor.replaceChildren(...visitas.map(crearTarjeta));
}

function mostrarMensajeVacio(elemento, texto) {
  elemento.textContent = texto;
  elemento.hidden = texto === "";
}

function pintarResumen(total, promedio, selladas, completo) {
  document.getElementById("total").textContent = String(total);
  document.getElementById("promedio").textContent = total === 0 ? "—" : promedio.toFixed(1);
  document.getElementById("selladas").textContent = selladas + " de 7";
  document.getElementById("mensaje-completo").hidden = !completo;
}

function mostrarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  document.getElementById("error-" + idCampo).textContent = mensaje;
  campo.classList.toggle("invalido", mensaje !== "");
  campo.setAttribute("aria-invalid", mensaje !== "" ? "true" : "false");
}

function estadoCargandoCompas(select) {
  select.replaceChildren(new Option("Cargando compas...", ""));
  select.disabled = true;
}

function llenarCompas(select, nombres) {
  const opciones = [new Option("Fui solo", "Fui solo")];
  nombres.forEach(function (nombre) {
    opciones.push(new Option(nombre, nombre));
  });
  select.replaceChildren(...opciones);
  select.disabled = false;
}
