//x = 1
//o = 2

var mesa = document.getElementById("mesa");
var iniciar = document.getElementById("iniciar");
var reiniciar = document.getElementById("reiniciar");
var modoJuego = document.getElementById("modoJuego");
var numJugadores = document.getElementById("numJugadores");


var num = numJugadores.options[numJugadores.selectedIndex].value;

//Modulos

const controlJuego = (() => {
    let turn = 1;
    var jugadores = 2;

    const cambioTurno = function(jugador) {
        if (jugador == 1)
            this.turn = 2;
        else
            this.turn = 1;
        if (this.jugadores == 1 && this.turn == 2) {
            tresEnRaya.escogerMovimiento();
        }
    }

    var getTurno = function() {
        return this.turn;
    };

    var juegoNuevo = function(num) {
        this.turn = 1;
        JuegoBase.limpiar();
        vistaJuego.borrarVista();
        this.jugadores = num;
    }

    return { turn: turn, getTurno: getTurno, cambioTurno: cambioTurno, juegoNuevo };
})();

const JuegoBase = (() => {
    var estadoInicial = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const comprobarGanador = function(tabla) {
        //Victoria horizontal
        if (tabla[0] != 0 && tabla[0] == tabla[1] && tabla[1] == tabla[2])
            return tabla[0];
        if (tabla[3] != 0 && tabla[3] == tabla[4] && tabla[4] == tabla[5])
            return tabla[3];
        if (tabla[6] != 0 && tabla[6] == tabla[7] && tabla[7] == tabla[8])
            return tabla[6];
        //Victoria vertical
        //
        if (tabla[0] != 0 && tabla[0] == tabla[3] && tabla[3] == tabla[6])
            return tabla[0];
        if (tabla[1] != 0 && tabla[1] == tabla[4] && tabla[4] == tabla[7])
            return tabla[1];
        if (tabla[2] != 0 && tabla[2] == tabla[5] && tabla[5] == tabla[8])
            return tabla[2];

        //Victoria diagonal
        if (tabla[0] != 0 && tabla[0] == tabla[4] && tabla[4] == tabla[8])
            return tabla[0];
        if (tabla[2] != 0 && tabla[2] == tabla[4] && tabla[4] == tabla[6])
            return tabla[2];

        //Empate
        if (tabla[0] != 0 && tabla[1] != 0 && tabla[2] != 0 &&
            tabla[3] != 0 && tabla[4] != 0 && tabla[5] != 0 &&
            tabla[6] != 0 && tabla[7] != 0 && tabla[8] != 0)
            return 3;

        return 0;
    }

    const agregarTab = function(espacio, jugador) {

        estadoInicial[espacio] = jugador;
        var ganador = comprobarGanador(estadoInicial);
        finalizarJuego(ganador);
    }

    const finalizarJuego = function(ganador) {
        if (ganador != 0 && ganador != 3) {
            var reiniciar = confirm("GANA JUGADOR " + ganador + "\n¿Reiniciar?");
            if (reiniciar) {
                modoJuego.style.display = "block"
            }
        }
        if (ganador == 3) {
            var reiniciar = confirm("¡EMPATE!\n¿Reiniciar?");
            if (reiniciar) {
                modoJuego.style.display = "block"
            }
        }
    }

    const getTabla = function() {
        return estadoInicial;
    }

    const getCuadrado = function(index) {
        return estadoInicial[index];
    }

    const limpiar = () => {
        for (i = 0; i < 9; i++) {
            estadoInicial[i] = 0;
        }
    }

    const hayAbierto = () => {
        for (i = 0; i < 9; i++) {
            if (estadoInicial[i] == 0)
                return true;
        }
        return false;
    }

    const getEspaciosLibres = function(board) {
        var spaces = [];
        for (i = 0; i < 9; i++) {
            if (board[i] == 0)
                spaces.push(i);
        }
        return spaces;
    }

    return { agregarTab: agregarTab, getCuadrado, limpiar, hayAbierto, getTabla: getTabla, getEspaciosLibres, comprobarGanador };

})();

const vistaJuego = (() => {
    var iconoX = "imgs/x.png";
    var iconoO = "imgs/o.png";

    const actualizarVista = (cuadrado, jugador) => {
        if (jugador == 1)
            cuadrado.children[0].src = iconoX;
        else
            cuadrado.children[0].src = iconoO;
    }

    const borrarVista = () => {
        for (var i = 0; i < mesa.children.length; i++) {
            mesa.children[i].children[0].src = "";
        }
    }

    return { actualizarVista, borrarVista };
})();

tresEnRaya = (() => {

    const minimax = (nuevaTab, turn) => {

        var getEspaciosLibres = JuegoBase.getEspaciosLibres(nuevaTab);


        var ganador = JuegoBase.comprobarGanador(nuevaTab);
        if (ganador == 1) //Gana jugador
            return { puntuacion: -1 };
        else if (ganador == 2) //Gana la máquina
            return { puntuacion: 1 };
        else if (ganador == 3) //Empate
            return { puntuacion: 0 };

        else {
            var movimientos = [];
            for (j = 0; j < getEspaciosLibres.length; j++) {

                var movi = {};
                movi.index = getEspaciosLibres[j];
                nuevaTab[getEspaciosLibres[j]] = turn;

                var res = 0;
                if (turn == 2)
                    res = minimax(nuevaTab, 1);
                else
                    res = minimax(nuevaTab, 2);

                movi.puntuacion = res.puntuacion;

                nuevaTab[getEspaciosLibres[j]] = 0;
                movimientos.push(movi);
            }


            var movimiento;
            if (turn === 2) {
                var bestpuntuacion = -10000;
                for (var i = 0; i < movimientos.length; i++) {

                    if (movimientos[i].puntuacion > bestpuntuacion) {
                        bestpuntuacion = movimientos[i].puntuacion;
                        movimiento = i;
                    }

                }
            } else {
                var bestpuntuacion = 10000;
                for (var i = 0; i < movimientos.length; i++) {

                    if (movimientos[i].puntuacion < bestpuntuacion) {
                        bestpuntuacion = movimientos[i].puntuacion;
                        movimiento = i;
                    }
                }
            }
            return movimientos[movimiento];
        }

    }
    const escogerMovimiento = () => {

        movimiento = minimax(JuegoBase.getTabla().slice(), 2);

        const curr = controlJuego.getTurno();
        vistaJuego.actualizarVista(mesa.children[movimiento.index], curr);
        JuegoBase.agregarTab(movimiento.index, curr);
        controlJuego.cambioTurno(curr);
    }

    return { escogerMovimiento };
})();


creaJugador = (esX) => {
    var simbolo = 2;
    if (esX)
        simbolo = 1;
    return { simbolo };
}


for (var i = 0; i < mesa.children.length; i++) {
    const index = i;
    mesa.children[i].addEventListener("click", () => {
        const cuadrado = JuegoBase.getCuadrado(index);
        if (cuadrado == 0) {
            const curr = controlJuego.getTurno();
            //controlJuego.cambioTurno(curr);
            vistaJuego.actualizarVista(mesa.children[index], curr);
            JuegoBase.agregarTab(index, curr);
            controlJuego.cambioTurno(curr);
        }
    });
}


function iniciarJuego() {
    const jugador1 = creaJugador(true);
    const jugador2 = creaJugador(false);
}

iniciar.addEventListener("click", function(e) {
    e.preventDefault();
    var num = numJugadores.options[numJugadores.selectedIndex].value;
    modoJuego.style.display = "none";
    controlJuego.juegoNuevo(num);
});

/*iniciar.addEventListener("click", () => {
        controlJuego.juegoNuevo();
    });
*/
reiniciar.addEventListener("click", () => {
    modoJuego.style.display = "block";
});