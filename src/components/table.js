import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    if (before && Array.isArray(before)) {
        before.reverse().forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.prepend(root[subName].container);
        });
    }

    if (after && Array.isArray(after)) {
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.append(root[subName].container);
        });
    }

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', (e) => {
        setTimeout(() => {
            onAction();
        }, 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    })


    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const templateId = rowTemplate;
        const nextRows = data.map(item => {
        // 2. Клонируем шаблон СРАЗУ со всеми найденными элементами
        const row = cloneTemplate(templateId);
        
        // 3. Перебираем все поля в данных (date, customer, seller, total...)
        Object.keys(item).forEach(key => {
            // 4. Если в шаблоне есть элемент с таким именем (row.elements.date), заполняем его
            if (row.elements[key]) {
                row.elements[key].textContent = item[key];
            }
        });
        
        // Возвращаем готовый DOM-элемент строки (container)
        return row.container;
    });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}