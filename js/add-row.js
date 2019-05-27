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

function saveExes(){
    var values = contentTbody.children;
    console.log(values);
}

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
};

addButton.addEventListener('click', function () {
    if (!iptdespesa.value == "" && !iptestabelecimento.value == "" && !iptdata.value == "" && !iptvalor.value == "" && !iptSaldo.value == "") {
        var saldo = new Saldo(parseFloat(iptSaldo.value));
        var newExes = new Despesa(iptdespesa.value, iptestabelecimento.value, iptdata.value, iptvalor.value, saldo);
        newExes.addRowByTemplate();
        saldo.updateSaldo();
        clearInputs();
        document.querySelector('.alert').hidden = true
    } else {
        document.querySelector('.alert').hidden = false
    };
});

function deleteDespesa(x){
    var row = x.parentNode.parentNode.rowIndex;
    var rowSaldo = x.parentNode.parentElement.querySelectorAll('td')[3].textContent;
    document.querySelector('table').deleteRow(row);
    var saldo = new Saldo(parseFloat(iptSaldo.value));
    saldo.credito(parseFloat(rowSaldo));
    saldo.updateSaldo();
    console.log(row + ' deletada');
};


