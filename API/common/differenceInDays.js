function differenceInDays(d1, d2){
    // Convertendo as strings de datas para objetos Date
    var date1 = new Date(d1);
    var date2 = new Date(d2);

    // Calculando a diferença em milissegundos
    var diferencaEmMilissegundos = Math.abs(date2 - date1);

    // Convertendo a diferença para dias
    var diferencaEmDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

    return diferencaEmDias;
}

module.exports = differenceInDays