import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
    const compare = createComparison(defaultRules);


export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        const selectEl = elements[elementName];
        if (selectEl) {
            // Очищаем селектор от старых опций (если они есть)
            selectEl.innerHTML = '';
            
            const allOption = document.createElement('option');
            allOption.value = '';
            allOption.textContent = 'Все';
            selectEl.appendChild(allOption);

            // Генерируем опции из массива значений
            // indexes[elementName] — это массив строк, например ['ООО Ромашка', 'ИП Иванов']
            indexes[elementName].forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                selectEl.appendChild(option);
            });
        }
    });
    return (data, state, action) => {
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
    
        return data.filter(row => compare(row, state));
    }
}