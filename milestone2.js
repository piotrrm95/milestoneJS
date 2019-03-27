/*Stwórz aplikację 'Moje taski na dedlajnie'
1. Aplikacja powinna umożliwić dodawanie, usuwanie oraz edycje listy zadań. 
Dla każdego z zadań użytkownik może podać tytuł oraz opis.
2. Do aplikacji dodaj możliwość edycji istniejących zadań.
*3. Stwórz możliwość wyszukiwania zadań (według podanej przez użytkownika frazy).
*4. Wprowadź możliwość ustawiania statusu zadania, status powinien przyjmować wartości z zakresu 
'To do', 'In progress', 'Done'.
*5. Użyj local storage dla zachowania trwałości danych.*/

window.onload = function () {
    let taskName = document.getElementById('taskName');
    let taskDescription = document.getElementById('taskDescription');
    let addButton = document.getElementById('addButton');
    let searchInput = document.getElementById('searchInput');
    let searchButton = document.getElementById('searchButton');
    let tasksContainer = document.getElementById('tasksContainer');
    let objKey = 'tasks' //klucz pod którym będziemy pobierać wartości z localStorage
    let searchKey = 'search';
    showData();

    //obsługa zdarzenia dla przycisku 'Dodaj'
    addButton.addEventListener('click', addTask);

    //obsługa zdarzenia dla przycisku 'Szukaj'
    searchButton.addEventListener('click', searchTask);

    //dodanie nowego obiektu do tablicy obiektów i zapisanie w localStorage
    function addTask() {
        let newTask = {
            name: taskName.value,
            description: taskDescription.value,
            id: randomId()
        };
        let current = localStorage.getItem(objKey);
        let parsed = JSON.parse(current);
        if (current == null) {
            localStorage.setItem(objKey, JSON.stringify([newTask]));
        } else {
            parsed.push(newTask);
            localStorage.setItem(objKey, JSON.stringify(parsed));
        }
        showData(parsed);
    };
    //generowanie randomowego ID
    const randomId = () => {
        return (Date.now() / Math.random()) * 10000
    };

    //wyświetlanie w tabeli danych zapisanych w tablicy
    function showData() {
        let current = localStorage.getItem(objKey);
        let parsed = JSON.parse(current);
        if (parsed != null) {
            tasksContainer.innerHTML = '';
            for (let i = 0; i < parsed.length; i++) {
                let nextRow = createRow(parsed[i], i);
                tasksContainer.appendChild(nextRow);
            }
        }
    }

    //tworzenie komórki w tabeli w html
    function createCell(text) {
        let nextTd = document.createElement('td');
        nextTd.innerHTML = text;
        return nextTd;
    }

    //tworzenie wiersza w tabeli w html
    function createRow(obj) {
        let nextTr = document.createElement('tr');
        let cellName = createCell(obj.name);
        let cellDescript = createCell(obj.description);
        let cellAction = document.createElement('td');
        nextTr.appendChild(cellName);
        nextTr.appendChild(cellDescript);

        //dodawanie przycisków 'Usun' i 'Edytuj'
        const actionButtonsArr = ['Delete', 'Edit']
        for (let i = 0; i < actionButtonsArr.length; i++) {

            let actionButton = document.createElement('button');
            actionButton.innerText = actionButtonsArr[i];
            actionButton.setAttribute('id', obj.id);
            cellAction.appendChild(actionButton);
            if (actionButtonsArr[i] == 'Delete') {
                actionButton.addEventListener('click', removeTask);
                actionButton.setAttribute('class', 'removeBtn');
            } else {
                actionButton.addEventListener('click', editTask);
                actionButton.setAttribute('class', 'editBtn')
            }
            nextTr.appendChild(cellAction);
        }

        //dodawanie selecta ze statusem zadania
        let inputStatus = document.createElement('select');
        const optionsArr = ['To Do', 'In progress', 'Done'];
        inputStatus.setAttribute('id', obj.id);
        for (let i = 0; i < optionsArr.length; i++) {
            let option = document.createElement('option');
            option.innerText = optionsArr[i];
            inputStatus.appendChild(option);
            cellAction.appendChild(inputStatus);
            nextTr.appendChild(cellAction);

        }
        return nextTr;
    }

    //usuwanie obiektu z tablicy
    function removeTask(event) {
        var clickedButtonId = event.target.getAttribute('id');
        var currentClickedRmv = localStorage.getItem(objKey);
        var parsedClickedRmv = JSON.parse(currentClickedRmv);
        var indexToRemove = parsedClickedRmv.findIndex((obj) => {
            return obj.id == clickedButtonId
        });
        parsedClickedRmv.splice(indexToRemove, 1);
        localStorage.setItem(objKey, JSON.stringify(parsedClickedRmv));
        showData(parsedClickedRmv);
    }
    //edycja obiektu
    // Get the modal
    function editTask() {
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }



    /*addButton.removeEventListener('click', addTask);
    var clickedButtonId = event.target.getAttribute('id');
    var currentClickedEdt = localStorage.getItem(objKey);
    var parsedClickedEdt = JSON.parse(currentClickedEdt);
    var indexToUpdate = parsedClickedEdt.findIndex((obj) => {
        return obj.id == clickedButtonId
    });
    var getObject = parsedClickedEdt[indexToUpdate];
    taskName.value = getObject.name;
    taskDescription.value = getObject.description;
    addButton.addEventListener('click', updateTask);

    //update obiektu
    function updateTask() {
        var updatedTask = {
            name: taskName.value,
            description: taskDescription.value,
            id: randomId()
        };
        parsedClickedEdt[indexToUpdate] = updatedTask;
        localStorage.setItem(objKey, JSON.stringify(parsedClickedEdt)); //jeszcze raz wlozyc gdzies local storage
        showData(parsedClickedEdt);
        addButton.removeEventListener('click', updateTask);
        addButton.addEventListener('click', addTask);
    }*/


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