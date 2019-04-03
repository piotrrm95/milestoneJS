window.onload = function () {
    let taskName = document.getElementById('taskName');
    let taskDescription = document.getElementById('taskDescription');
    let taskStatus = document.getElementById('status');
    let addButton = document.getElementById('addButton');
    let searchInput = document.getElementById('searchInput');
    let searchButton = document.getElementById('searchButton');
    let tasksContainer = document.getElementById('tasksContainer');
    let editTask = document.getElementById('editTask');
    let editDescript = document.getElementById('editDescript')
    let editStatus = document.getElementById('editStatus')
    let box = document.getElementById('editBox');
    let span = document.getElementsByClassName("close")[0];
    let confirmButton = document.getElementById('confirmButton');
    let objKey = 'tasks';
    let searchKey = 'search';
    let current = localStorage.getItem(objKey);
    let parsed = JSON.parse(current);
    showData();

    //obsługa zdarzenia dla przycisku 'Dodaj'
    addButton.addEventListener('click', addTask);

    //obsługa zdarzenia dla przycisku 'Szukaj'
    searchButton.addEventListener('click', searchTask);

    //dodawanie selecta ze statusem zadania
    const optionsArr = ['To Do', 'In Progress', 'Done'];
    for (let i = 0; i < optionsArr.length; i++) {
        let option = document.createElement('option');
        let optionEdt = document.createElement('option');
        option.setAttribute("value", optionsArr[i]);
        optionEdt.setAttribute("value", optionsArr[i]);
        option.innerText = optionsArr[i];
        optionEdt.innerText = optionsArr[i];
        taskStatus.appendChild(option);
        editStatus.appendChild(optionEdt);
    }
    //dodanie nowego obiektu do tablicy obiektów i zapisanie w localStorage
    function addTask() {
        let newTask = {
            name: taskName.value,
            description: taskDescription.value,
            id: randomId(),
            status: taskStatus.value,
        };
        if(taskName.value==''&&taskDescription.value==''){
            alert("Are you sure you don't have any tasks to do? ;)")
        }
        else if (current == null) {
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
        cellName.setAttribute('class', obj.status)
        cellName.setAttribute('title', obj.status)
        let cellDescript = createCell(obj.description);
        let cellAction = document.createElement('td');
        nextTr.appendChild(cellName);
        nextTr.appendChild(cellDescript);

        //dodawanie przycisków 'Usun' i 'Edytuj'
        const actionButtonsArr = ['Edit', 'Delete'];
        for (let i = 0; i < actionButtonsArr.length; i++) {
            let actionButton = document.createElement('i');
            actionButton.setAttribute('id', obj.id);
            cellAction.appendChild(actionButton);
            if (actionButtonsArr[i] == 'Delete') {
                actionButton.addEventListener('click', removeTask);
                actionButton.setAttribute('class', 'far fa-trash-alt');
                actionButton.setAttribute('title', 'Remove');
            } else {
                actionButton.addEventListener('click', edit);
                actionButton.setAttribute('class', 'fas fa-edit')
                actionButton.setAttribute('title', 'Edit')
            }
            nextTr.appendChild(cellAction);
        }
        return nextTr;
    }
    //usuwanie obiektu 
    function removeTask(event) {
        let clickedButtonId = event.target.getAttribute('id');
        let indexToRemove = parsed.findIndex((obj) => {
            return obj.id == clickedButtonId
        });
        parsed.splice(indexToRemove, 1);
        localStorage.setItem(objKey, JSON.stringify(parsed));
        showData(parsed);
    }
    //edycja obiektu
    function edit(event) {
        editTask.appendChild(taskStatus);
        let clickedButtonId = event.target.getAttribute('id');
        let indexToUpdate = parsed.findIndex((obj) => {
            return obj.id == clickedButtonId
        });
        let getObject = parsed[indexToUpdate];
        editTask.value = getObject.name;
        editDescript.value = getObject.description;
        editStatus.value = getObject.status;
        box.style.display = "block";
        span.onclick = function () {
            box.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == box) {
                box.style.display = "none";
            }
        }
        confirmButton.onclick = function () {
            let updatedTask = {
                name: editTask.value,
                description: editDescript.value,
                id: randomId(),
                status: editStatus.value
            };
            parsed[indexToUpdate] = updatedTask;
            localStorage.setItem(objKey, JSON.stringify(parsed));
            showData(parsed);
            box.style.display = "none";
        }
    }
    //szukanie obiektu
    function searchTask() {
        const searchResult = [];
        for (let i = 0; i < parsed.length; i++) {
            if (parsed[i].name == searchInput.value || parsed[i].description == searchInput.value) {
                searchResult.push(parsed[i]);
            }
            localStorage.setItem(searchKey, JSON.stringify(searchResult))    
        }
        showSearchData();
    }

    function showSearchData() {
        let currentResult = localStorage.getItem(searchKey);
        let parsedResult = JSON.parse(currentResult);
        if (parsedResult.length != null) {
            tasksContainer.innerHTML = '';
            for (var i = 0; i < parsedResult.length; i++) {
                var nextRow = createRow(parsedResult[i], i);
                tasksContainer.appendChild(nextRow);
            }
            let refreshButton = document.createElement('button');
            refreshButton.innerText = 'Refresh';
            refreshButton.setAttribute('class', 'btn btn-dark btn-sm')
            refreshButton.addEventListener('click', refresh)
            tasksContainer.appendChild(refreshButton);
        }
    }
    function refresh() {
        location.reload();
    }
}