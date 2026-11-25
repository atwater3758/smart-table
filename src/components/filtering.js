import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
    const compare = createComparison(defaultRules);


export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            // Находим родительский элемент кнопки
            const parent = action.parentElement;
            
            // Ищем input внутри родителя по атрибуту data-field
            // Значение data-field подскажет, какое именно поле нужно очистить
            const fieldName = action.dataset.field;
            const inputToClear = parent.querySelector(`input[data-field="${fieldName}"]`);
            
            if (inputToClear) {
                inputToClear.value = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
    
       const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}
