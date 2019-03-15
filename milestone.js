/*Stwórz aplikację 'Moje taski na dedlajnie'
1. Aplikacja powinna umożliwić dodawanie, usuwanie oraz edycje listy zadań. 
Dla każdego z zadań użytkownik może podać tytuł oraz opis.
2. Do aplikacji dodaj możliwość edycji istniejących zadań.
*3. Stwórz możliwość wyszukiwania zadań (według podanej przez użytkownika frazy).
*4. Wprowadź możliwość ustawiania statusu zadania, status powinien przyjmować wartości z zakresu 
'To do', 'In progress', 'Done'.
*5. Użyj local storage dla zachowania trwałości danych.*/

window.onload = function () {
    var taskName = document.getElementById('taskName');
    var taskDescription = document.getElementById('taskDescription');
    var addButton = document.getElementById('addButton');
    var searchInput = document.getElementById('searchInput');
    var searchButton = document.getElementById('searchButton');
    var tasksContainer = document.getElementById('tasksContainer');
    var objKey = 'tasks' //klucz pod którym będziemy pobierać wartości z localStorage
    var searchKey = 'search';
    showData();

    //obsługa zdarzenia dla przycisku 'Dodaj'
    addButton.addEventListener('click', addTask);

    //obsługa zdarzenia dla przycisku 'Szukaj'
    searchButton.addEventListener('click', searchTask);

    //dodanie nowego obiektu do tablicy obiektów i zapisanie w localStorage
    function addTask() {
        var newTask = { name: taskName.value, description: taskDescription.value, id: randomId() };
        var current = localStorage.getItem(objKey);
        if (current == null) {
            localStorage.setItem(objKey, JSON.stringify([newTask]));
        }
        else {
            var parsed = JSON.parse(current);
            parsed.push(newTask);
            localStorage.setItem(objKey, JSON.stringify(parsed));
        }
        showData(parsed);
    };
    //generowanie randomowego ID
    function randomId() {
        return (Date.now() / Math.random()) * 10000;
    }

    //wyświetlanie w tabeli danych zapisanych w tablicy
    function showData() {
        var currentObj = localStorage.getItem(objKey);
        var parsedObj = JSON.parse(currentObj);
        if (parsedObj != null) {
            tasksContainer.innerHTML = '';
            for (var i = 0; i < parsedObj.length; i++) {
                var nextRow = createRow(parsedObj[i], i);
                tasksContainer.appendChild(nextRow);
            }
        }
    }

    //tworzenie komórki w tabeli w html
    function createCell(text) {
        var nextTd = document.createElement('td');
        nextTd.innerHTML = text;
        return nextTd;
    }

    //tworzenie wiersza w tabeli w html
    function createRow(obj) {
        var nextTr = document.createElement('tr');
        var cell1 = createCell(obj.name);
        var cell2 = createCell(obj.description);
        nextTr.appendChild(cell1);
        nextTr.appendChild(cell2);

        //dodawanie przycisków 'Usun' i 'Edytuj'
        var actionButtonsArr = ['Usun', 'Edytuj']
        for (var i = 0; i < actionButtonsArr.length; i++) {
            var cell = document.createElement('td');
            var actionButton = document.createElement('button');
            actionButton.innerText = actionButtonsArr[i];
            actionButton.setAttribute('id', obj.id);
            cell.appendChild(actionButton);
            if (actionButtonsArr[i] == 'Usun') {
                actionButton.addEventListener('click', removeTask);
                actionButton.setAttribute('class', 'removeBtn');
            }
            else {
                actionButton.addEventListener('click', editTask)
            }
            nextTr.appendChild(cell);
        }

        //dodawanie selecta ze statusem zadania
        var cell5 = document.createElement('td');
        var inputStatus = document.createElement('select');
        var optionsArr = ['To Do', 'In progress', 'Done'];
        for (var i = 0; i < optionsArr.length; i++) {
            var option = document.createElement('option');
            var optionText = document.createTextNode(optionsArr[i]);
            option.appendChild(optionText);
            inputStatus.appendChild(option);
            cell5.appendChild(inputStatus);
        }
        nextTr.appendChild(cell5);
        return nextTr;
    }

    //usuwanie obiektu z tablicy
    function removeTask(event) {
        var clickedButtonId = event.target.getAttribute('id');
        var currentClickedRmv = localStorage.getItem(objKey);
        var parsedClickedRmv = JSON.parse(currentClickedRmv);
        var indexToRemove = parsedClickedRmv.findIndex((obj) => { return obj.id == clickedButtonId });
        parsedClickedRmv.splice(indexToRemove, 1);
        localStorage.setItem(objKey, JSON.stringify(parsedClickedRmv));
        showData(parsedClickedRmv);
    }
    //edycja obiektu
    function editTask(event) {
        addButton.removeEventListener('click', addTask);
        var clickedButtonId = event.target.getAttribute('id');
        var currentClickedEdt = localStorage.getItem(objKey);
        var parsedClickedEdt = JSON.parse(currentClickedEdt);
        var indexToUpdate = parsedClickedEdt.findIndex((obj) => { return obj.id == clickedButtonId });
        var getObject = parsedClickedEdt[indexToUpdate];
        taskName.value = getObject.name;
        taskDescription.value = getObject.description;
        addButton.addEventListener('click', updateTask);

        //update obiektu
        function updateTask() {
            var updatedTask = { name: taskName.value, description: taskDescription.value, id: randomId() };
            parsedClickedEdt[indexToUpdate] = updatedTask;
            localStorage.setItem(objKey, JSON.stringify(parsedClickedEdt));//jeszcze raz wlozyc gdzies local storage
            showData(parsedClickedEdt);
            addButton.removeEventListener('click', updateTask);
            addButton.addEventListener('click', addTask);
        }
    }

    //szukanie obiektu
    function searchTask() {
        var searchResult = [];
        var currentInSearch = localStorage.getItem(objKey);
        var parsedInSearch = JSON.parse(currentInSearch);
        for (var i = 0; i < parsedInSearch.length; i++) {
            if (parsedInSearch[i].name == searchInput.value || parsedInSearch[i].description == searchInput.value) {
                searchResult.push(parsedInSearch[i]);
                localStorage.setItem(searchKey, JSON.stringify(searchResult))
            }
        }
        var currentResult = localStorage.getItem(searchKey);
        var parsedResult = JSON.parse(currentResult);
        showSearchData(parsedResult);
    }

    function showSearchData() {
        var currentInSearch = localStorage.getItem(searchKey);
        var parsedInSearch = JSON.parse(currentInSearch);
        if (parsedInSearch != null) {
            tasksContainer.innerHTML = '';
            for (var i = 0; i < parsedInSearch.length; i++) {
                var nextRow = createRow(parsedInSearch[i], i);
                tasksContainer.appendChild(nextRow);
            }
        }
    }
}
