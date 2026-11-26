const TOTAL_PROVINCIAS = 7;

let visitas = [];

const formulario = document.getElementById("form-visita");
const listaVisitas = document.getElementById("lista-visitas");
const filtro = document.getElementById("filtro");
const selectCompa = document.getElementById("compa");
const avisoCompas = document.getElementById("aviso-compas");
const mensajeVacio = document.getElementById("mensaje-vacio");
const campoFecha = document.getElementById("fecha");

function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mes + "-" + dia;
}

const validadores = {
  nombre: function (valor) {
    const texto = valor.trim();
    if (texto === "") return "Escribí el nombre de la soda.";
    if (texto.length < 3 || texto.length > 40) return "Debe tener entre 3 y 40 caracteres.";
    return "";
  },
  provincia: function (valor) {
    return valor === "" ? "Elegí una provincia." : "";
  },
  plato: function (valor) {
    const texto = valor.trim();
    if (texto === "") return "Escribí el plato que pidió.";
    if (texto.length < 3) return "Debe tener al menos 3 caracteres.";
    return "";
  },
  calificacion: function (valor) {
    const texto = valor.trim();
    const numero = Number(texto);
    if (texto === "" || !Number.isInteger(numero) || numero < 1 || numero > 5) {
      return "La calificación debe ser un número entero de 1 a 5.";
    }
    return "";
  },
  fecha: function (valor) {
    if (valor === "") return "Elegí la fecha de la visita.";
    if (valor > hoy()) return "La fecha no puede ser futura.";
    return "";
  }
};

function validarFormulario() {
  let valido = true;
  Object.keys(validadores).forEach(function (id) {
    const mensaje = validadores[id](document.getElementById(id).value);
    mostrarError(id, mensaje);
    if (mensaje !== "") valido = false;
  });
  return valido;
}

function visitasFiltradas() {
  const provincia = filtro.value;
  return provincia === "Todas" ? visitas : visitas.filter(function (v) { return v.provincia === provincia; });
}

function actualizarResumen() {
  const total = visitas.length;
  const suma = visitas.reduce(function (acc, v) { return acc + v.calificacion; }, 0);
  const promedio = total === 0 ? 0 : suma / total;
  const selladas = new Set(visitas.map(function (v) { return v.provincia; })).size;
  pintarResumen(total, promedio, selladas, selladas === TOTAL_PROVINCIAS);
}

function renderizar() {
  const lista = visitasFiltradas();
  pintarTarjetas(listaVisitas, lista);
  if (lista.length === 0) {
    mostrarMensajeVacio(
      mensajeVacio,
      visitas.length === 0
        ? "Aún sin visitas!"
        : "No hay visitas en esa provincia."
    );
  } else {
    mostrarMensajeVacio(mensajeVacio, "");
  }
  actualizarResumen();
}

function guardarYRenderizar() {
  guardarVisitas(visitas);
  renderizar();
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  if (!validarFormulario()) return;

  visitas.push({
    id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    soda: document.getElementById("nombre").value.trim(),
    provincia: document.getElementById("provincia").value,
    plato: document.getElementById("plato").value.trim(),
    calificacion: Number(document.getElementById("calificacion").value),
    fecha: campoFecha.value,
    compa: selectCompa.value || "Fui solo",
    volveria: document.getElementById("volveria").checked,
    favorita: false
  });

  guardarYRenderizar();
  formulario.reset();
  Object.keys(validadores).forEach(function (id) { mostrarError(id, ""); });
  document.getElementById("nombre").focus();
});

Object.keys(validadores).forEach(function (id) {
  const campo = document.getElementById(id);
  const revisar = function () {
    if (validadores[id](campo.value) === "") mostrarError(id, "");
  };
  campo.addEventListener("input", revisar);
  campo.addEventListener("change", revisar);
});

listaVisitas.addEventListener("click", function (evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const id = boton.dataset.id;

  if (boton.dataset.accion === "favorita") {
    const visita = visitas.find(function (v) { return v.id === id; });
    if (visita) {
      visita.favorita = !visita.favorita;
      guardarYRenderizar();
    }
  } else if (boton.dataset.accion === "borrar") {
    if (window.confirm("¿Seguro que querés borrar esta visita?")) {
      visitas = visitas.filter(function (v) { return v.id !== id; });
      guardarYRenderizar();
    }
  }
});

filtro.addEventListener("change", renderizar);

async function cargarCompas() {
  estadoCargandoCompas(selectCompa);
  avisoCompas.hidden = true;
  try {
    const nombres = await obtenerCompas();
    llenarCompas(selectCompa, nombres);
  } catch (error) {
    llenarCompas(selectCompa, []);
    avisoCompas.hidden = false;
  }
}

function iniciar() {
  campoFecha.max = hoy();
  visitas = cargarVisitas();
  renderizar();
  cargarCompas();
}

iniciar();
