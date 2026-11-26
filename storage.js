const CLAVE_VISITAS = "pasaporteSodas.visitas";

function cargarVisitas() {
  try {
    const texto = localStorage.getItem(CLAVE_VISITAS);
    if (texto === null) {
      return [];
    }
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function guardarVisitas(visitas) {
  try {
    localStorage.setItem(CLAVE_VISITAS, JSON.stringify(visitas));
    return true;
  } catch (error) {
    return false;
  }
}