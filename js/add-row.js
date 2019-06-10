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

//Objeto Saldo
function Saldo(value) {
    this.saldo = value

    this.debito = function (value) {
        return this.saldo -= value
    };

    this.credito = function (value) {
        return this.saldo += value
    };

    this.updateSaldo = function () {
        return document.getElementById('saldo').value = this.saldo
    };
};

function convertDate(data) {
    var arrDate = data.split('-');
    var stringDate = arrDate[2] + '/' + arrDate[1] + '/' + arrDate[0];
    return stringDate;
};

function clearInputs() {
    inputs = document.querySelectorAll('input, select');
    for (i = 1; i < inputs.length; i++) { inputs[i].value = null; }
}

//Objeto despesa
function Despesa(despesa, estabelecimento, data, valor, valorSaldo) {
    this.tipoDespesa = despesa;
    this.estabCompra = estabelecimento;
    this.dataDespesa = data;
    this.valorDespesa = valor;

    this.addRowByTemplate = function () {
        var template = document.querySelector("#template1");
        list_td = template.content.querySelectorAll('th, td');

        list_td[0].textContent = item = item + 1;
        list_td[1].textContent = this.tipoDespesa;
        list_td[2].textContent = this.estabCompra;
        list_td[3].textContent = convertDate(this.dataDespesa);
        list_td[4].textContent = this.valorDespesa;
        list_td[5].textContent = valorSaldo.debito(this.valorDespesa);

        var newRow = document.importNode(template.content, true);
        contentTbody.appendChild(newRow);
    };

    function saveExes() {

    }

    this.gerarJson = function () {
        var tablehead = contentTbody.parentElement.querySelector('tr');
        var lastrows = contentTbody.lastElementChild.querySelectorAll('th, td');
        var contentRow = {};
        for (i = 0; i < 6; i++) {
            contentRow[tablehead.cells.item(i).textContent.toLocaleLowerCase()] = lastrows.item(i).textContent;
        };
        jsonExes['exes'].push(contentRow);
        // console.log(jsonExes);
    }
};

addButton.addEventListener('click', function () {
    if (!iptdespesa.value == "" && !iptestabelecimento.value == "" && !iptdata.value == "" && !iptvalor.value == "" && !iptSaldo.value == "") {
        var saldo = new Saldo(parseFloat(iptSaldo.value));
        var newExes = new Despesa(iptdespesa.value, iptestabelecimento.value, iptdata.value, iptvalor.value, saldo);
        newExes.addRowByTemplate();
        saldo.updateSaldo();
        clearInputs();
        newExes.gerarJson();
        document.querySelector('.alert').hidden = true
    } else {
        document.querySelector('.alert').hidden = false
    };
});

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

function showJson() {
    strJsonExes = JSON.stringify(jsonExes);
    document.querySelector('pre').innerHTML = strJsonExes;
    document.getElementById('show-json').hidden = false;
}


var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ['Aluguel', 'Condominio', 'Padaria', 'Supermercado', 'Card. Credito', 'Card. Debito', 'Corridas'],
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
});

