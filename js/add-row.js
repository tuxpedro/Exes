// Get input values
var iptdespesa = document.getElementById('despesa');
var iptestabelecimento = document.getElementById('estabelecimento');
var iptdata = document.getElementById('data');
var iptvalor = document.getElementById('valor');
var addButton = document.getElementById('addButton');
var iptSaldo = document.getElementById('saldo');

// cria um índice
var item = 0;

// get velues table
var contentTbody = document.querySelector('tbody');
var jsonExes = { 'exes': [] };

// List type exes
var exesItem = { "Debito": "Cartão de Debito", "Credito": "Cartão de Credito", "Domesticas": "Despesas da Casa" };

//Datalist exes
var listExes = document.getElementById('optDespesas');

// Get canva
var ctx = document.getElementById('myChart');

//Labels of the chart
var labelsChartExes = [];

//Datas of the chart
var dataChartExes = [];

/* =================================================================================================================== */

//Objeto Saldo
function Saldo(value) {
    this.saldo = value

    this.debito = function (value) {
        this.saldo -= value
        return this.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    this.credito = function (value) {
        return this.saldo += value
    };

    this.updateSaldo = function () {
        return document.getElementById('saldo').value = this.saldo
    };
};

// Convert a date
function convertDate(data) {
    var arrDate = data.split('-');
    var stringDate = arrDate[2] + '/' + arrDate[1] + '/' + arrDate[0];
    return stringDate;
};

//Clear inputs forms
function clearInputs() {
    inputs = document.querySelectorAll('input, select');
    for (i = 1; i < inputs.length; i++) { inputs[i].value = null; }
}

//Object Exes
function Despesa(despesa, estabelecimento, data, valor, valorSaldo) {
    this.tipoDespesa = despesa;
    this.estabCompra = estabelecimento;
    this.dataDespesa = data;
    this.valorDespesa = valor;

    //Add rows in table of expenses
    this.addRowByTemplate = function () {
        var template = document.querySelector("#template1");
        list_td = template.content.querySelectorAll('th, td');

        list_td[0].textContent = item = item + 1;
        list_td[1].textContent = this.tipoDespesa;
        list_td[2].textContent = this.estabCompra;
        list_td[3].textContent = convertDate(this.dataDespesa);
        list_td[4].textContent = Number(this.valorDespesa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        list_td[5].textContent = valorSaldo.debito(this.valorDespesa);

        var newRow = document.importNode(template.content, true);
        contentTbody.appendChild(newRow);
    };

    //loads the types of expenses when the page loads
    this.loadItemExesList = function () {
        var keys = Object.keys(exesItem);
        var values = Object.values(exesItem);
        var options = '';
        for (var i = 0; i < keys.length; i++) {
            /* opt.value = keys[i];
            opt.innerHTML = values[i]; */
            options += '<option value="' + keys[i] + '">' + values[i] + '</option>';
        }
        listExes.innerHTML = options;
    };

    //Add itens in the datalist of type expenses
    this.appendItemDataList = function () {
        var append = true;
        var opt = document.createElement('option');
        for (i = 0; i < listExes.options.length; i++) {
            if (this.tipoDespesa == listExes.options[i].value) {
                append = false;
            };
        };
        if (append == true) {
            opt.value = this.tipoDespesa;
            listExes.appendChild(opt);
        };
    };

    //generates Json with the rows of the table 
    this.gerarJson = function () {
        var tablehead = contentTbody.parentElement.querySelector('tr');
        var lastrows = contentTbody.lastElementChild.querySelectorAll('th, td');
        var contentRow = {};
        for (i = 0; i < 6; i++) {
            contentRow[tablehead.cells.item(i).textContent.toLocaleLowerCase()] = lastrows.item(i).textContent;
        };
        jsonExes['exes'].push(contentRow);
    };

    // save the generated json from the expense table
    function saveExes() { console.log('Saved Exes;') };
};

/*
    Listen to the event click the add button and add rows to the expense table, 
    update the balance, clear the form entries, 
    generate the Json and add expense types
*/
addButton.addEventListener('click', function () {
    if (!iptdespesa.value == "" && !iptestabelecimento.value == "" && !iptdata.value == "" && !iptvalor.value == "" && !iptSaldo.value == "") {
        var saldo = new Saldo(parseFloat(iptSaldo.value));
        var newExes = new Despesa(iptdespesa.value, iptestabelecimento.value, iptdata.value, iptvalor.value, saldo);
        newExes.addRowByTemplate();
        saldo.updateSaldo();
        clearInputs();
        newExes.gerarJson();
        newExes.appendItemDataList();
        document.querySelector('.alert').hidden = true;
    } else {
        document.querySelector('.alert').hidden = false;
    };
});

//Delete expenses
function deleteDespesa(x) {
    var row = x.parentNode.parentNode.rowIndex;
    var rowSaldo = x.parentNode.parentNode.cells.item(4).textContent;
    var rowItem = x.parentNode.parentNode.cells.item(0).textContent
    document.querySelector('table').deleteRow(row);
    var saldo = new Saldo(parseFloat(iptSaldo.value));
    saldo.credito(parseFloat(rowSaldo));
    saldo.updateSaldo();

    for (i = 0; i < jsonExes["exes"].length; i++) {
        if (jsonExes["exes"][i].item == rowItem) {
            var exesItem = jsonExes["exes"][i];
            index = jsonExes["exes"].indexOf(exesItem);
            itemDel = jsonExes["exes"].splice(index, 1);
            console.log(itemDel);
        }
    }

    if (document.getElementById('show-json').hidden = false) { showJson(); }
};

// Show Json when click button 'Exibir Json'
function showJson() {
    strJsonExes = JSON.stringify(jsonExes);
    document.querySelector('pre').innerHTML = strJsonExes;
    btn = document.getElementById('show-json')
    showOrHideElement(btn);
}

var labelChart = function () {
    for (var k = 0; k < jsonExes.exes.length; k++) {
        if (!labelsChartExes.includes(jsonExes.exes[k].despesa)) {
            labelsChartExes.push(jsonExes.exes[k].despesa);
        };
    }
    return labelsChartExes;
};

var dataChart = function () {
    var sumExes = {};

    labelChart().forEach(function (x) {
        sumExes[x] = 0
    });

    jsonExes.exes.forEach(function (x) {
        if (sumExes.hasOwnProperty(Object.values(x)[1])) {
            sumExes[Object.values(x)[1]] += parseFloat(x.valor);
            console.log(Object.values(x)[1] +' = '+sumExes[Object.values(x)[1]]);
        }
    });

    return Object.values(sumExes);
}

var config = {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: labelsChartExes,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: 'rgb(0, 0, 0, 0)',
            data: [90, 10, 5, 2, 20, 30, 45]
        }]
    },

    // Configuration options go here
    options: {}
};

//Generates statistics graph
function showStatistics() {
    ctx.getContext('2d');
    var chart = new Chart(ctx, config);
    showOrHideElement(ctx);
};

// load types expenses when page ready
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var newExes = new Despesa();
        newExes.loadItemExesList();
        hiddenElement(ctx);
        iptSaldo.value = Number(200);
    };
};

function showElement(element) {
    element.hidden = false;
};

function hiddenElement(element) {
    element.hidden = true;
};

// show or hide elements
function showOrHideElement(element) {
    if (element.hidden == true) {
        showElement(element);
    } else {
        hiddenElement(element);
    }
}

