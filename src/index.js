const { v4: uuidv4 } = require('uuid');

// enable this func before using, for save first workers in localStorage

// window.onload = function() {
//     let firstWorker = [{
//             id: uuidv4(),
//             name: 'Иванов Иван',
//             position: 'Менеджер',
//             email: 'IvanovI@ukr.net',
//             phone: '0631112223',
//         },
//         {
//             id: uuidv4(),
//             name: 'Петров Петр',
//             position: 'Менеджер',
//             email: 'PetrovP@ukr.net',
//             phone: '0632223334',
//         }
//     ];

//     saveWorker(firstWorker);
// };

const workerData = {},
    workerListContainer = document.querySelector('.worker-list__container'),
    workerFormInput = document.querySelectorAll('.worker-form__input'),
    submitButton = document.querySelector('.submit-button'),
    tooltip = document.querySelectorAll('#tooltip');

const validName = /^[\D]*[\s][\D]{2,}$/,
    validPosition = /^[\D]{5,}$/,
    validEmail = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
    validPhone = /[\+\(]{0,2}\d{1,4}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}[\.\-\s\(\)]*\d{1}/;

const STORAGE_KEY = 'WORKERS';

function saveWorker(workers) {
    const data = JSON.stringify(workers);
    localStorage.setItem(STORAGE_KEY, data);

    workerFormInput.forEach(el => el.value = '');
    workerListContainer.innerHTML = '';

    workersList.forEach(el => {
        if (el) { drawWorkerCard(el) }
    });
};

function loadWorkers() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return JSON.parse(data)
    } catch (e) {
        console.log(e);
        return null
    }
};

function drawWorkerCard(temp) {
    let template = document.querySelector('#worker-list').innerHTML,
        compiled = _.template(template);
    $('.worker-list__container').append(compiled({ data: temp }));
};

const workersList = loadWorkers() || [];
saveWorker(workersList);


submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    tooltip.forEach(el => { el.style.display = "none" })
    if (!validName.test($("#name").val())) {
        tooltip[0].style.display = "block";
        return false
    } else if (!validPosition.test($("#position").val())) {
        tooltip[1].style.display = "block";
        return false
    } else if (!validEmail.test($("#email").val())) {
        tooltip[2].style.display = "block";
        return false
    } else if (!validPhone.test($("#phone").val())) {
        tooltip[3].style.display = "block";
        return false
    };

    $('.worker-form__form').find('input').each(function() {
        workerData[this.name] = $(this).val();
    });

    let worker = workersList.find(item => item.id === workerData.id),
        workerIndex = workersList.findIndex(item => item == worker);

    if (worker) {
        Object.assign(worker, workerData);
        workersList.splice(workerIndex, 1, workerData);
    } else {
        workerData.id = uuidv4();
        workersList.push(workerData);
    }

    saveWorker(workersList);
    window.location.reload();
});

let editButton = document.querySelectorAll('.edit-button'),
    deleteButton = document.querySelectorAll('.delete-button');

editButton.forEach(elem => elem.addEventListener('click', (event) => {
    event.preventDefault();

    let worker = workersList.find(item => item.id == event.currentTarget.attributes.id.value);

    workerFormInput.forEach(elem => {
        let item = Object.keys(worker);

        for (let i = 0; i < item.length; i++) {
            if (elem.attributes.id && elem.attributes.id.value === item[i]) {
                elem.value = worker[item[i]]
            }
        }
    });
    Object.assign(workerData, worker);
}));

deleteButton.forEach(elem => elem.addEventListener('click', (event) => {
    event.preventDefault();

    let worker = workersList.find(item => item.id == event.currentTarget.attributes.id.value),
        workerIndex = workersList.indexOf(worker, 0),
        confirmToDelete = confirm(`Удалить "${worker.name}"?`);

    if (confirmToDelete) {
        workersList.splice(workerIndex, 1);
        saveWorker(workersList);
    };

    window.location.reload();
}))