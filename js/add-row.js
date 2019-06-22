// Get input values
var iptdespesa = document.getElementById('despesa');
var iptestabelecimento = document.getElementById('estabelecimento');
var iptdata = document.getElementById('data');
var iptvalor = document.getElementById('valor');
var addButton = document.getElementById('addButton');
var iptSaldo = document.getElementById('saldo');
var saveButton = document.getElementById('btnSave');
var statisticsBtn = document.getElementById('showStatistics');
var showJsonButton = document.getElementById('showJson');
var modal = document.getElementById('modalRecuperaDados');
var spanBadge = document.getElementById('cont');

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

// settings chart
var config;

// div alerts
var divAlert = document.querySelector('.alert');

// alert unsaved expenses
var saveExes = false;

// count unsaved expenses
var numUnsavedExes = 0;

// get btn yes modal recover data
var btnYesModal;

/* =================================================================================================================== */

//Objeto Saldo
function Saldo(value) {
    this.saldo = value

    this.debito = function (value) {
        this.saldo -= value
        return this.saldo;
    };

    this.credito = function (value) {
        return this.saldo += value
    };

    this.updateSaldo = function () {
        return iptSaldo.value = this.saldo;
    };
};

// Convert a date
function convertDate(data) {
    if (data.includes('-')) {
        var arrDate = data.split('-');
        var stringDate = arrDate[2] + '/' + arrDate[1] + '/' + arrDate[0];
        return stringDate;
    } else {
        return data;
    }
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
        list_td[4].textContent = Number(this.valorDespesa);
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
};


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
    var strJsonExes = JSON.stringify(jsonExes);
    document.querySelector('pre').innerHTML = strJsonExes;
    btn = document.getElementById('show-json')
    showOrHideElement(btn);
};

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
        sumExes[x] = 0;
    });
    for (var i = 0; i < jsonExes.exes.length; i++) {
        var v = jsonExes.exes[i].despesa;
        if (sumExes.hasOwnProperty(jsonExes.exes[i].despesa)) {
            sumExes[jsonExes.exes[i].despesa] += Number(jsonExes.exes[i].valor);;
        };
    };
    dataChartExes = Object.values(sumExes);
    return dataChartExes;
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
};

//Generates statistics graph
function showStatistics() {
    ctx.getContext('2d');
    config = {
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
                data: dataChartExes,
            }]
        }
    };
    var chart = new Chart(ctx, config);
    showOrHideElement(ctx);
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
        hiddenElement(divAlert);
        labelChart();
        dataChart();
        saveExes = true;
        if (saveExes == true) {
            spanBadge.innerHTML = numUnsavedExes += 1;
        };
        if (ctx.hidden == false) {
            showStatistics();
            showElement(ctx);
        };
    } else {
        if (divAlert.hidden == false) {
            divAlert.className = "col alert alert-danger"
            divAlert.textContent = "***ATENÇÃO*** - Algum campo está vazio!";
        } else {
            showElement(divAlert);
            divAlert.textContent = "***ATENÇÃO*** - Algum campo está vazio!";
        }
    };
});

/* localStorage - Save jsonExes */
function saveJsonExes() {
    var strJsonExes = JSON.stringify(jsonExes);
    localStorage.setItem('docExes', strJsonExes);
    saveButton.addEventListener('click', function () {
        divAlert.className = "col alert alert-success";
        divAlert.textContent = 'A tabela de despesas foi salva localmente';
        showElement(divAlert);
        saveExes = false;
        spanBadge.innerHTML = '';
    });
};

function recoverJsonExes() {
    try {
        jsonExes = JSON.parse(localStorage.getItem('docExes'));
        var len = Number(jsonExes.exes.length);
        var sum = Number(0);
        jsonExes.exes.forEach(function (x) { sum += Number(x.valor); });
        var saldo = new Saldo(Number(jsonExes.exes[len - 1].saldo) + sum);
        jsonExes.exes.forEach(function (i) {
            new Despesa(i.despesa, i.estabelecimento, i.data, i.valor, saldo).addRowByTemplate();
        });
        iptSaldo.valor = saldo.updateSaldo();
    } catch (error) {
        console.log('Nunhuma despesa encontra!' + ' '+error);
        iptSaldo.focus();
    }

}


// load types expenses when page ready
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var newExes = new Despesa();
        newExes.loadItemExesList();
        hiddenElement(ctx); 
        saveButton.onclick = saveJsonExes;
        statisticsBtn.onclick = showStatistics;
        showJsonButton.onclick = showJson;
        $('#modalRecuperaDados').modal('show');
        btnYesModal = document.getElementById('btnModalYes');
        btnYesModal.addEventListener('click', function () {
            recoverJsonExes();
            labelChart();
            dataChart();
            $('#modalRecuperaDados').modal('hide');
        });
    };
};