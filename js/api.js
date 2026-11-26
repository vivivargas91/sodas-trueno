const URL_COMPAS = "https://jsonplaceholder.typicode.com/users";

async function obtenerCompas() {
  const respuesta = await fetch(URL_COMPAS);
  if (!respuesta.ok) {
    throw new Error("Error HTTP " + respuesta.status);
  }
  const usuarios = await respuesta.json();
  return usuarios.map(function (usuario) {
    return usuario.name;
  });
}
