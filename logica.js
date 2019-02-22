/***********************
 * M O D E L
 **********************/
const ANO_ATUAL = (new Date(Date.now())).getFullYear();
const MES_ATUAL = (new Date(Date.now())).getMonth()
const DIA_ATUAL = (new Date(Date.now())).getDate();
const HORA_ATUAL = (new Date(Date.now())).getHours();
const MINUTO_ATUAL = (new Date(Date.now())).getMinutes();
const CINCO_HORAS = 5 * 60 * 60 * 1000;
const OITO_HORAS = 8 * 60 * 60 * 1000;
const NOVE_HORAS = 9 * 60 * 60 * 1000;
const INICIO_EXPEDIENTE = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 7, 0, 0, 0);
const INICIO_NUCLEO = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 9, 0, 0, 0);
const INICIO_ALMOCO = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 11, 0, 0, 0);
const FIM_ALMOCO = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 16, 0, 0, 0);
const FIM_NUCLEO = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 18, 0, 0, 0);
const FIM_EXPEDIENTE = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 20, 0, 0, 0);

function Expediente() {
    //this.marcacoes = new Array();
    this.marcacoes = [];
    this.nucleoFlex = false;
    this.jornada;
    this.incluirMarcacao = function(hora, minuto) {
        if (this.buscarMarcacao(hora, minuto) == -1) {
            this.marcacoes.push(new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, hora, minuto, 0, 0));
            this.marcacoes.sort();
        }
    }
    this.buscarMarcacao = function(hora, minuto) {
        for (var i = 0; i < this.marcacoes.length; i++)
            if (this.marcacoes[i].getHours() == hora && this.marcacoes[i].getMinutes() == minuto)
                return i;
        return -1;
    }
    this.excluirMarcacao = function(hora, minuto) {
        var indice = this.buscarMarcacao(hora, minuto);
        if (indice >= 0) {
            this.marcacoes[indice].setFullYear(ANO_ATUAL + 1);
            this.marcacoes.sort();
            this.marcacoes.pop();
        }
    }
    this.calcularUltimaSaida = function() {
        var zeroHora = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 0, 0, 0, 0);
        var onzeHoras = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 11, 0, 0, 0);
        var vinteHoras = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 20, 0, 0, 0);
        if (this.marcacoes.length > 0) {
            if (this.marcacoes[0] <= onzeHoras) {
                return new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, this.marcacoes[0].getHours() + 9, this.marcacoes[0].getMinutes(), 0, 0);
            } else {
                return vinteHoras;
            }
        } else {
            return zeroHora;
        }
    }
    this.calcularPrimeiraEntrada = function() { // funcionalidade FUTURA
        var primeiraHora = new Date(ANO_ATUAL, MES_ATUAL, DIA_ATUAL, 7, 0, 0, 0);
        // outras linhas
        return primeiraHora;
    }
    this.obterMarcacao = function(indice) {
        return this.marcacoes[indice];
    }
    this.formatarDataHora = function(dataHora) {
        var dataHoraFormatado;
        dataHoraFormatado = (dataHora.getHours() < 10) ? '0' + dataHora.getHours() : dataHora.getHours();
        dataHoraFormatado += ':';
        dataHoraFormatado += (dataHora.getMinutes() < 10) ? '0' + dataHora.getMinutes() : dataHora.getMinutes();
        return dataHoraFormatado;
    }
    this.estaDentroHorarioAlmoco = function(marcacao) {
        return (marcacao >= INICIO_ALMOCO && marcacao <= FIM_ALMOCO);
    }
}
//var exp = new Expediente();
// A DIFERENÇA ENTRE DATAS SE APRESENTA EM MILISEGUNDOS
// document.write(new Date(10000).getTime(),"<br/>");

/***********************
 * C O N T R O L L E R
 **********************/
function incluirMarcacao() {
    var exp = new Expediente();
    var horaSelecionada = document.getElementById("hora").selectedIndex;
    var valorHora = document.getElementById("hora")[horaSelecionada].value;
    var minutoSelecionado = document.getElementById("minuto").selectedIndex;
    var valorMinuto = document.getElementById("minuto")[minutoSelecionado].value;
    var marcacoes = document.getElementById("marcacoes");
    var modoSaida = document.getElementById("modoSaida");
    exp.incluirMarcacao(valorHora, valorMinuto);
    while (marcacoes.firstChild) {
        exp.incluirMarcacao(marcacoes.firstChild.value.substr(0, 2), marcacoes.firstChild.value.substr(3, 2));
        marcacoes.removeChild(marcacoes.firstChild);
    }
    // popular lista
    for (var i = 0; i < exp.marcacoes.length; i++) {
        var item = document.createElement("option");
        item.value = exp.formatarDataHora(exp.obterMarcacao(i));
        item.text = exp.formatarDataHora(exp.obterMarcacao(i));
        marcacoes.add(item);
    }
    atualizarMomentoProposto(modoSaida, exp);
}

function excluirMarcacao() {
    var exp = new Expediente();
    var modoSaida = document.getElementById("modoSaida");
    var selecionado = document.getElementById("marcacoes").selectedIndex;
    var horaminuto, hora, minuto;
    if (selecionado != -1) {
        horaminuto = document.getElementById("marcacoes")[selecionado].value;
        hora = horaminuto.substr(0, 2);
        minuto = horaminuto.substr(3, 2);
        exp.excluirMarcacao(hora, minuto);
        document.getElementById("marcacoes").remove(selecionado);
    }
    var horaMinuto = document.getElementById("marcacoes");
    for (var i = 0; i < horaMinuto.length; i++) {
        exp.incluirMarcacao(horaMinuto.item(i).value.substr(0, 2), horaMinuto.item(i).value.substr(3, 2));
    }
    atualizarMomentoProposto(modoSaida, exp);
}

function atualizarMomentoProposto(modoSaida, exp) {
    var momentoProposto = document.getElementById("momentoProposto");
    if (modoSaida.checked)
        momentoProposto.value = exp.formatarDataHora(exp.calcularUltimaSaida());
    else
        momentoProposto.value = exp.formatarDataHora(exp.calcularPrimeiraEntrada());
    exp = {};
}

function popularHoraMinuto() {
    var horaAtual = new Date().getHours();
    var minutoAtual = new Date().getMinutes();
    var hora = document.getElementById("hora");
    var minuto = document.getElementById("minuto");
    while (hora.firstChild)
        hora.removeChild(hora.firstChild);
    while (minuto.firstChild)
        minuto.removeChild(minuto.firstChild);
    var texto, valor;
    for (var i = 7; i < 21; i++) {
        if (i < 10)
            texto = '0' + i;
        else
            texto = i;
        var item = document.createElement("option");
        item.value = texto;
        item.text = texto;
        hora.add(item);
    }
    for (var i = 0; i < 60; i++) {
        if (i < 10)
            texto = '0' + i;
        else {
            if (horaAtual != 20)
                texto = i;
            else {
                texto = '00';
                break;
            }
        }
        var item = document.createElement("option");
        item.value = texto;
        item.text = texto;
        minuto.add(item);
    }
    if (horaAtual < 7 || horaAtual > 20) {
        hora.value = '07';
        minuto.value = '00';
    } else {
        hora.value = (horaAtual < 10) ? '0' + horaAtual : horaAtual;
        minuto.value = (minutoAtual < 10) ? '0' + minutoAtual : minutoAtual;
    }
}

function alternarModo(radio) {

    /*
     * Percebi que este evento como todos os outros que mexem no cálculo 
     * devem trabalhar com a persistência do expediente.
     * Talvez deva ser criada uma função utilitária que persista 
     * essa lista 
     */

    if (radio.id == "modoSaida") {
        /*
        Neste trecho, capturar as marcações caso existam 
        e chamar a atualização do momento proposto para última saída
        */
        alert('inverter cálculo para última saída');
    } else {
        /*
        Neste trecho, capturar as marcações caso existam 
        e chamar a atualização do momento proposto para primeira entrada
        */
        alert('inverter cálculo para primeira entrada');
    }


}

// Utilitários

function vinteHoras(hora) {
    var item, texto;
    var minuto = document.getElementById("minuto");
    var indiceAnterior = document.getElementById("minuto").selectedIndex;
    if (hora == '20') {
        while (minuto.firstChild)
            minuto.removeChild(minuto.firstChild);
        item = document.createElement("option");
        item.value = '00';
        item.text = '00';
        minuto.add(item);
    } else {
        while (minuto.firstChild)
            minuto.removeChild(minuto.firstChild);
        for (var i = 0; i < 60; i++) {
            if (i < 10) {
                texto = '0' + i;
            } else {
                if (HORA_ATUAL != 20) {
                    texto = i;
                } else {
                    texto = '00';
                    break;
                }
            }
            item = document.createElement("option");
            item.value = texto;
            item.text = texto;
            minuto.add(item);
            if (indiceAnterior == i)
                minuto.selectedIndex = i;
        }
    }
}

function mensagemPendente() {
    alert('Implemantação pendente!');
}