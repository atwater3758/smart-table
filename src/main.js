
import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import { initPagination } from './components/pagination.js';
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js"; 
import { initSearching } from './components/searching.js';

// @todo: подключение

const api = initData(sourceData); 
let globalIndexes = null;

 /* Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    return {
        ...state,
        // Гарантируем числа, иначе сервер вернёт 400
        page: parseInt(state.page) || 1,
       // rowsPerPage: parseInt(state.rowsPerPage) || 10,
        search: state.search,
        filter: state.filter
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState();
    if (!globalIndexes) {
        return;
    }
    
    // Формируем query строго по требованиям сервера
    let query = {};

    query = applyPagination(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySearching(query, state, action);
    query = applySorting(query, state, action); 

    try {
        const { total, items } = await api.getRecords(query);
        updatePagination(total, query);
        sampleTable.render(items);
    } catch (error) {
        console.error('Ошибка API:', error);
        sampleTable.render([]); 
    }
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter', 'search'],
    after: ['pagination']
}, render);

// @todo: инициализация
const applySearching = initSearching('search'); 

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const {applyFiltering, updateIndexes}  = initFiltering(sampleTable.filter.elements, {
   }); 

const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    globalIndexes = await api.getIndexes();    
}

init().then(() => {
  // Теперь можно безопасно создать списки
  const sellersList = Object.values(globalIndexes.sellers);
  const customersList = Object.values(globalIndexes.customers);

  // Заполняем выпадающие списки данными
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: sellersList,
    searchByCustomer: customersList
  });

  // Первый рендер таблицы
  render();
}); 
