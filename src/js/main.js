/**
 * Nombre del Archivo: main.js
 * Descripción: Este archivo se encarga de la lógica del examen de programación del calendario.
 * Autor: Roberto Lorenzo Aguilar Maldonado
 * Versión: 1.0
 */

// Declaración de Globales
//Emulación de enum para los días del mes
const diasDelMes = {
    1: 31,  // enero
    2: 28,  // febrero Considerando años no bisiestos
    3: 31,  // marzo
    4: 30,  // abril
    5: 31,  // mayo
    6: 30,  // junio
    7: 31,  // julio
    8: 31,  // agosto
    9: 30,  // septiembre
    10: 31, // octubre
    11: 30, // noviembre
    12: 31  // diciembre
};

//Emulación de enum para los nombres del mes
const nombreDelMes = {
    1: "Enero",  // enero
    2: "Febrero",  // febrero Considerando años no bisiestos
    3: "Marzo",  // marzo
    4: "Abril",  // abril
    5: "Mayo",  // mayo
    6: "Junio",  // junio
    7: "Julio",  // julio
    8: "Agosto",  // agosto
    9: "Septiembre",  // septiembre
    10: "Octubre", // octubre
    11: "Noviembre", // noviembre
    12: "Diciembre"  // diciembre
};

function Calcular() {
    /**
    * Función que se manda a llamar cuando se ejecuta el botón generar calendario.
    * @return: none.
    */
    
    LimpiarTabla(); // func que limpia la tabla

    let fechaInicio = $("#txtFechaInicio").val();
    let diasMostrar = $("#txtDiasMostrar").val();

    // Obtiene el mes 
    let mesInicio = fechaInicio.substr(5, 2).replace(/^0/, ' ');  //elimina el cero del mes siempre y cuando este al comienzo de la cadena por que afectaria a octubre        
    let diasMes = diasDelMes[+mesInicio];  // el operador + convierte a entero como alternativa podría usarse number o parseInt  
    let mesSelector = nombreDelMes[+mesInicio];   // el operador + convierte a entero como alternativa podría usarse number o parseInt   

    // Setea el Encabezado del mes
    const miEncabezado = document.getElementById('EncabezadoMes');
    miEncabezado.textContent = mesSelector;

     // Válida que no estén vacíos los inputs y que tengan valores válidos
    if (diasMostrar > diasMes) {
        swal({
            title: 'Formato Inválido',
            text: 'El número de días a mostrar no puede ser mayor a los días disponibles del mes',
        })

    } else if (!ValidarFormatoFecha(fechaInicio)) {
         // Swal librería de JavaScript para mostrar alertas un poco más fancys
        swal({
            title: 'Formato Inválido',
            text: 'Ex: YYYY-MM-DD',
        })
    } else if (fechaInicio == "" || diasMostrar == "") {
        swal({
            title: 'Favor Completar Todos Los Campos',
        })
    } else {
        let diaEmpieza = ObtenerDiaDeLaSemana(fechaInicio.slice(0, -2) + "01");
        var diafinaliza = ObtenerDiaDeLaSemana(fechaInicio.slice(0, -2) + diasMes);
         // Func para dibujar la tabla de días del calendario
        RenderRenglones();
        // Delimita los días anteriores a la fecha de inicio
        ColoRangoSemana(diaEmpieza.toUpperCase(), 0, true);
        renderDiasMostrar(diasMostrar, mesSelector);
        // Delimita los días posteriores a la fecha de inicio
        ColoRangoSemana(diafinaliza.toUpperCase(), 4, false);
        // Setea el último día del mes
        $(`#${diafinaliza}${4}`).html(diasMes);
        // Colorea en rojo el último día del mes
        document.getElementById(`${diafinaliza}${4}`).className = "red-cell";
    }
}

function renderDiasMostrar(diasMostrar, mesSelector) {    
    /*
        Función para asignar los colores según las reglas de negocio
        diasMostrar (int) Ex: 13
        mes seleccionado (string )  Ex: Agosto
        return: none
   */
    let contador = 0;
    var table = document.getElementById("tbl_dias").getElementsByTagName('tbody')[0];;
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            let colorCel = col.className;
            if (colorCel != "gray-cell") {
                contador = contador + 1;
                if (contador <= diasMostrar) {
                    var dia = col.id.replace(/\d+/g, '').trim().toLowerCase();
                    evaluarDiasSemanas(dia, col);
                    col.innerText = contador;
                    // sabado domingo agrega color estilo amarillo
                    if (dia == "sabado" || dia == "domingo") {
                        col.className = "yellow-cell";
                    } else {
                        // Lunes a Viernes Verde
                        col.className = "green-cell";
                    }
                    // Dias festivos Naranja
                    evaluarDiasFestivos(contador, mesSelector.toLowerCase(), col);  
                } else if (contador == diasMostrar) {
                    break;
                }
            }
            // Dias no seleccionados a mostrar antes de la fecha del ultimo dia del mes azul
            if (col.className == "") {
                col.className = "spec-cell";
            }
        }
    }
}

function evaluarDiasSemanas(dia, col) {
    /*
        Función para asignar los colores día de la semana
        dia (string) Ex: lunes
        col (objeto tipo TD) Ex: celda para aplicar cambio
        return: none
    */
    var diaSemana = [
        { dia: "lunes" },
        { dia: "martes" },
        { dia: "miercoles" },
        { dia: "jueves" },
        { dia: "viernes" }

    ];
    for (var i = 0; i < diaSemana.length; i++) {
        if (diaSemana[i].dia === dia) {
            col.className = "green-cell";
            break;
        }
    }
}

function evaluarDiasFestivos(numeroDia, mesSelector, col) {
    /*
        Función para asignar los colores día de la semana festivos
        numeroDia (int) Ex: 5
        mes seleccionado (string )  Ex: emerp
        col (objeto tipo TD) Ex: celda para aplicar cambio
        return: none
   */
    var diaFestivo = [
        { mes: "enero", dia: 1 },     // 1 de enero
        { mes: "febrero", dia: 5 },     // 5 de febrero
        { mes: "marzo", dia: 18 },    // 18 de marzo
        { mes: "mayo", dia: 1 },     // 1 de mayo
        { mes: "septiembre", dia: 16 },    // 16 de septiembre
        { mes: "noviembre", dia: 20 },   // 20 de noviembre
        { mes: "diciembre", dia: 25 }    // 25 de diciembre
    ];
    for (var i = 0; i < diaFestivo.length; i++) {
        if (diaFestivo[i].mes === mesSelector && diaFestivo[i].dia === numeroDia) {            
            col.className = "orange-cell";
            break;
        }
    }
}

function setGris(elementIds) {
    /*
        Función para asignar los colores gris para los días anteriores de inicio del mes y posteriores
        elementIds (string) Ex: Jueves0                       
        return: none
   */
    elementIds.forEach(id => {
        document.getElementById(id).className = "gray-cell";
    });
}

function ColoRangoSemana(dia, digito, reverse) {
     /*
        Función para asignar los colores gris para los días anteriores de inicio del mes y posteriores
        dia (string) Ex: MARTES                       
        digito (int) Ex: 4                       
        reverse (bool) Ex: true
        return: none
   */
    switch (dia) {
        case 'MARTES':
            if (reverse) {
                document.getElementById(`Lunes${digito}`).className = "gray-cell";
            } else {
                setGris([
                    `Miercoles${digito}`,
                    `Jueves${digito}`,
                    `Viernes${digito}`,
                    `Sabado${digito}`,
                    `Domingo${digito}`
                ]);
            }
            break;
        case 'MIERCOLES':
            if (reverse) {
                setGris([
                    `Martes${digito}`,
                    `Lunes${digito}`
                ]);
            } else {
                setGris([
                    `Jueves${digito}`,
                    `Viernes${digito}`,
                    `Sabado${digito}`,
                    `Domingo${digito}`
                ]);
            }
            break;
        case 'JUEVES':
            if (reverse) {
                setGris([
                    `Miercoles${digito}`,
                    `Martes${digito}`,
                    `Lunes${digito}`
                ]);
            } else {
                setGris([
                    `Viernes${digito}`,
                    `Sabado${digito}`,
                    `Domingo${digito}`
                ]);
            }
            break;
        case 'VIERNES':
            if (reverse) {
                setGris([
                    `Jueves${digito}`,
                    `Miercoles${digito}`,
                    `Martes${digito}`,
                    `Lunes${digito}`
                ]);
            } else {
                setGris([
                    `Sabado${digito}`,
                    `Domingo${digito}`
                ]);
            }
            break;
        case 'SABADO':
            if (reverse) {
                setGris([
                    `Viernes${digito}`,
                    `Jueves${digito}`,
                    `Miercoles${digito}`,
                    `Martes${digito}`,
                    `Lunes${digito}`
                ]);
            } else {
                document.getElementById(`Domingo${digito}`).className = "gray-cell";
            }
            break;
        case 'DOMINGO':
            if (reverse) {
                setGris([
                    `Sabado${digito}`,
                    `Viernes${digito}`,
                    `Jueves${digito}`,
                    `Miercoles${digito}`,
                    `Martes${digito}`,
                    `Lunes${digito}`
                ]);
            }
            break;
        default:
            break;
    }
}

function LimpiarTabla() {
    /*
        Función para limpiar taBLA
        return: none
   */
    $('#days > tr > td').remove();
}

function RenderRenglones() {
    /*
        Func para dibujar la tabla de días del calendario
        return: none
   */
    for (var i = 0; i < 5; i++) {

        $('tbody#days').append(
            '<tr id="renglon' + i + '"> '
            + '<td id="Lunes' + i + '">'
            // + 1
            + '</td>'

            + '<td id="Martes' + i + '">'
            // + 2
            + '</td>'

            + '<td id="Miercoles' + i + '">'
            // + 3
            + '</td>'

            + '<td id="Jueves' + i + '">'
            // + 4
            + '</td>'

            + '<td id="Viernes' + i + '"> '
            // + 5
            + '</td>'

            + '<td id="Sabado' + i + '" >'
            // + 6
            + '</td>'
            + '<td id="Domingo' + i + '">'
            // + 7
            + '</td>'

            + '</tr>')
    };
}

function ObtenerDiaDeLaSemana(fechaCalcular) {   
    /*
        Función para Obtener el día de la semana
        fechaCalcular (string) Ex: 2023-08-01, 2023-08-31
        return dia (string) Ex: Lunes                             
   */
    const fecha = new Date(fechaCalcular);
    const diasSemanas = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    const dayOfWeekIndex = fecha.getDay();

    const dia = diasSemanas[dayOfWeekIndex];
    return dia;
}


function ValidarFormatoFecha(dateString) {
    /*
        Función para validar la fecha inicio
        dateString (string) Ex: 2023-08-01, 2023-08-31
        return bool  Ex: true si comple y false si no                             
   */
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }

    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(5, 7), 10);
    const day = parseInt(dateString.slice(8, 10), 10);

    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

// Listener para validación de permitir solo números en días a mostrar
txtDiasMostrar.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
});