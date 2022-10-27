let turno = 1;
let fichas = ["O", "X"];
let puestas = 0;
let partidaAcabada = false;
let textoVictoria = document.getElementById("textoVictoria");
//Botones menú
let btnIniciar = document.getElementById("iniciar");
let btnReiniciar = document.getElementById("resetGame");
let btnReset = document.getElementById("reset");
let btnMuestraDatos = document.getElementById("muestraDatos");
let btnGuardaDatos = document.getElementById("guardarDatos");
let btnCargarDatos = document.getElementById("cargarDatos");
let btnSalir = document.getElementById("salir");

let tablero = (document.getElementById("tablero").style.visibility = "hidden");
let partidasJugadas = 0;
let puntosJugador = 0;
let empates = 0;
let botones = Array.from(document.getElementsByName("botonesJuego"));

botones.forEach((x) => x.addEventListener("click", ponerFicha));
//addEventListener para los botones del menu
btnReiniciar.addEventListener("click", reiniciarJuego);
btnReset.addEventListener("click", resetear);
btnMuestraDatos.addEventListener("click", muestraDatos);
btnIniciar.addEventListener("click", function () {
  document.getElementById("tablero").style.visibility = "visible";
});

//
btnGuardaDatos.addEventListener("click", function () {
	if (typeof(Storage) !== "undefined") {
		// LocalStorage disponible
		localStorage.setItem("partidasJugadas", partidasJugadas);
		localStorage.setItem("puntosJugador", puntosJugador);
		localStorage.setItem("empates", empates);
		alert("LocalStorage disponible y se han guardado los datos");

	} else {
		// LocalStorage no soportado en este navegador
		alert("LocalStorage no disponible , no se ha podido guardar los datos");
	}
	
  localStorage.setItem("partidasJugadas", partidasJugadas);
  localStorage.setItem("puntosJugador", puntosJugador);
  localStorage.setItem("empates", empates);
});

btnCargarDatos.addEventListener("click", function () {
  partidasJugadas = localStorage.getItem("partidasJugadas");
  puntosJugador = localStorage.getItem("puntosJugador");
  empates = localStorage.getItem("empates");
  document.getElementById("puntosJugador").innerHTML = puntosJugador;
  document.getElementById("partidasJugadas").innerHTML = partidasJugadas;
  document.getElementById("empates").innerHTML = empates;
});

btnSalir.addEventListener("click", function () {
  localStorage.clear();
  window.open("", "_self", "");
  window.close();
});

//Funcion para muestraDatos
function muestraDatos() {
  let datos = document.getElementById("datos");
  // si esta oculto lo muestra y si esta visible lo oculta
  if (datos.style.visibility == "hidden") {
    datos.style.visibility = "visible";
  } else {
    datos.style.visibility = "hidden";
  }
} //Funcion para resetear contadores
function resetear() {
  partidasJugadas = 0;
  puntosJugador = 0;
  empates = 0;
  document.getElementById("puntosJugador").innerHTML = puntosJugador;
  document.getElementById("partidasJugadas").innerHTML = partidasJugadas;
  document.getElementById("empates").innerHTML = empates;
}

//Funcion para reiniciar el juego
function reiniciarJuego() {
  textoVictoria.style.visibility = "hidden";
  botones.forEach((x) => {
    x.innerHTML = "";
    x.style.backgroundColor = "white";
  });
  partidaAcabada = false;
  puestas = 0;
  turno = 1;
}

function ponerFicha(event) {
  let botonPulsado = event.target;
  if (!partidaAcabada && botonPulsado.innerHTML == "") {
    botonPulsado.innerHTML = fichas[turno];
    puestas += 1;

    let estadoPartida = estado();
    if (estadoPartida == 0) {
      //Compruebo por cada movimiento si hay ganador
      cambiarTurno();
      if (puestas < 9) {
        turnoMaquina();
        estadoPartida = estado();
        puestas += 1;
        cambiarTurno();
      }
    }

    if (estadoPartida == 1) {
      textoVictoria.style.visibility = "visible";
      partidaAcabada = true;
    } else if (estadoPartida == -1) {
      textoVictoria.innerHTML = "Has perdido ;(";
      partidaAcabada = true;
      textoVictoria.style.visibility = "visible";
    }
  }
}

function cambiarTurno() {
  if (turno == 1) {
    turno = 0;
  } else {
    turno = 1;
  }
}

function estado() {
  posicionVictoria = 0;
  nEstado = 0;

  function sonIguales(...args) {
    valores = args.map((x) => x.innerHTML);
    if (valores[0] != "" && valores.every((x, i, arr) => x === arr[0])) {
      args.forEach((x) => (x.style.backgroundColor = "green"));
      return true;
    } else {
      return false;
    }
  }

  //Comprobamos si hay alguna linea
  if (sonIguales(botones[0], botones[1], botones[2])) {
    posicionVictoria = 1;
  } else if (sonIguales(botones[3], botones[4], botones[5])) {
    posicionVictoria = 2;
  } else if (sonIguales(botones[6], botones[7], botones[8])) {
    posicionVictoria = 3;
  } else if (sonIguales(botones[0], botones[3], botones[6])) {
    posicionVictoria = 4;
  } else if (sonIguales(botones[1], botones[4], botones[7])) {
    posicionVictoria = 5;
  } else if (sonIguales(botones[2], botones[5], botones[8])) {
    posicionVictoria = 6;
  } else if (sonIguales(botones[0], botones[4], botones[8])) {
    posicionVictoria = 7;
  } else if (sonIguales(botones[2], botones[4], botones[6])) {
    posicionVictoria = 8;
  }

  //Comprobamos quien ha ganado
  if (posicionVictoria > 0) {
    //Si la posicion de victoria es mayor que 0, es que hay ganador
    if (turno == 1) {
      nEstado = 1;
      textoVictoria.innerHTML = "Has ganado!";
      //Sumamos uno a los puntos del jugador
      puntosJugador++;
      //Actualizamos el marcador
      document.getElementById("puntosJugador").innerHTML = puntosJugador;
      //Sumamos uno a las partidas jugadas
      partidasJugadas++;
      //Actualizamos el marcador
      document.getElementById("partidasJugadas").innerHTML = partidasJugadas;
    } else {
      nEstado = -1;
    }
    //Si no hay ganador, comprobamos si hay empate
  } else if (puestas == 9) {
    //Si has perdido, sumamos uno a las partidas jugadas
    partidasJugadas++;
    //Actualizamos el marcador
    document.getElementById("partidasJugadas").innerHTML = partidasJugadas;
    //Si hay empate, sumamos uno a los empates
    empates++;
    //Actualizamos el marcador
    document.getElementById("empates").innerHTML = empates;
  }

  return nEstado;
}

function turnoMaquina() {
  function randomizador(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let valores = botones.map((x) => x.innerHTML);
  let pos = -1;

  if (valores[4] == "") {
    pos = 4;
  } else {
    let n = randomizador(0, botones.length - 1);
    while (valores[n] != "") {
      n = randomizador(0, botones.length - 1);
    }
    pos = n;
  }

  botones[pos].innerHTML = "O";
  return pos;
}
