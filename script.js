const animales = [
    { nombre: "Loro", imagen: "imagenes/loro.JPG" },
    { nombre: "Ajolote", imagen: "imagenes/ajolote.JPG" },
    { nombre: "Mapache", imagen: "imagenes/mapache.JPG" },
    { nombre: "Lobo", imagen: "imagenes/lobo.JPG" },
    { nombre: "Rinoceronte", imagen: "imagenes/rinoceronte.JPG" },
    { nombre: "Delfín", imagen: "imagenes/delfin.JPG" }
];

const tablero = document.getElementById("tablero");
const contadorParejas = document.getElementById("parejas");
const contadorMovimientos = document.getElementById("movimientos");
const botonReiniciar = document.getElementById("reiniciar");

// Referencias a las ventanas independientes
const modalFelicitacion = document.getElementById("modal-felicitacion");
const modalPrevencion = document.getElementById("modal-prevencion");
const btnJugarOtraVez = document.getElementById("btn-jugar-otra-vez");

let tarjetas = [];
let primeraTarjeta = null;
let segundaTarjeta = null;
let bloqueado = false;
let parejasEncontradas = 0;
let movimientos = 0;

function mezclar(array) {
    return array.sort(() => Math.random() - 0.5);
}

function crearTablero() {
    tablero.innerHTML = "";

    // Ocultar ambas ventanas al iniciar o reiniciar
    if (modalFelicitacion) modalFelicitacion.classList.add("oculto");
    if (modalPrevencion) modalPrevencion.classList.add("oculto");

    tarjetas = mezclar([...animales, ...animales]);

    primeraTarjeta = null;
    segundaTarjeta = null;
    bloqueado = false;
    parejasEncontradas = 0;
    movimientos = 0;

    contadorParejas.textContent = 0;
    contadorMovimientos.textContent = 0;

    tarjetas.forEach((animal) => {
        const tarjeta = document.createElement("button");

        tarjeta.classList.add("tarjeta");
        tarjeta.type = "button";
        tarjeta.dataset.animal = animal.nombre;

        tarjeta.innerHTML = `
            <span class="tarjeta-interior">
                <span class="cara frente">🐾</span>
                <span class="cara reverso">
                    <img src="${animal.imagen}" alt="${animal.nombre}">
                </span>
            </span>
        `;

        tarjeta.addEventListener("click", () => {
            voltearTarjeta(tarjeta);
        });

        tablero.appendChild(tarjeta);
    });
}

function voltearTarjeta(tarjeta) {
    if (
        bloqueado ||
        tarjeta === primeraTarjeta ||
        tarjeta.disabled ||
        tarjeta.classList.contains("volteada")
    ) {
        return;
    }

    tarjeta.classList.add("volteada");

    if (!primeraTarjeta) {
        primeraTarjeta = tarjeta;
        return;
    }

    segundaTarjeta = tarjeta;
    movimientos++;
    contadorMovimientos.textContent = movimientos;

    if (
        primeraTarjeta.dataset.animal ===
        segundaTarjeta.dataset.animal
    ) {
        primeraTarjeta.disabled = true;
        segundaTarjeta.disabled = true;

        parejasEncontradas++;
        contadorParejas.textContent = parejasEncontradas;

        primeraTarjeta = null;
        segundaTarjeta = null;

        if (parejasEncontradas === animales.length) {
            setTimeout(() => {
                // 1. Muestra la ventana de felicitación al completar el memorama
                if (modalFelicitacion) {
                    modalFelicitacion.classList.remove("oculto");
                }

                // 2. Después de 2 segundos, oculta la felicitación y muestra la ventana de prevención
                setTimeout(() => {
                    if (modalFelicitacion) modalFelicitacion.classList.add("oculto");
                    if (modalPrevencion) modalPrevencion.classList.remove("oculto");
                }, 2000);

            }, 700);
        }

    } else {
        bloqueado = true;

        setTimeout(() => {
            primeraTarjeta.classList.remove("volteada");
            segundaTarjeta.classList.remove("volteada");

            primeraTarjeta = null;
            segundaTarjeta = null;
            bloqueado = false;
        }, 900);
    }
}

// Botón de reinicio principal del tablero
if (botonReiniciar) {
    botonReiniciar.addEventListener("click", crearTablero);
}

// Único botón final dentro de la ventana de prevención para jugar otra vez
if (btnJugarOtraVez) {
    btnJugarOtraVez.addEventListener("click", crearTablero);
}

crearTablero();