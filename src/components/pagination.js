import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    // Пока оставляем пустым, это будет реализовано позже через createPage
        const pageTemplate = pages.firstElementChild.cloneNode(true);
        pages.firstElementChild.remove();

        return (data, state, action) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const rowsPerPage = state.rowsPerPage; 
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        // --- ПУНКТ 2.6: Обработка действий ---
        // Мы не меняем state напрямую. Мы вычисляем локальную переменную currentPage.
        // По умолчанию берем из state.
        let currentPage = state.page;

        if (action) {
            switch(action.name) {
                case 'prev': 
                    currentPage = Math.max(1, currentPage - 1); 
                    break;
                case 'next': 
                    // Исправлено: используем totalPages вместо несуществующего pageCount
                    currentPage = Math.min(totalPages, currentPage + 1); 
                    break;
                case 'first': 
                    currentPage = 1; 
                    break;
                case 'last': 
                    currentPage = totalPages; 
                    break;
                default:
                    // Если клик был по номеру страницы (а не по стрелкам),
                    // action.page уже содержит нужный номер.
                    if (action.page) {
                        currentPage = action.page;
                    }
            }
        }

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(currentPage, totalPages, 5);
        
        // Защита: если getPages вернул пустоту, рисуем хотя бы 1..5, чтобы не было пусто
        const pagesToRender = visiblePages.length > 0 ? visiblePages : Array.from({ length: 5 }, (_, i) => i + 1);
        
        pages.replaceChildren(...pagesToRender.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === currentPage);
        }));

        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (currentPage - 1) * rowsPerPage + 1;
        toRow.textContent = Math.min((currentPage * rowsPerPage), data.length);
        totalRows.textContent = data.length;

        // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (currentPage - 1) * rowsPerPage;
        
        return data.slice(skip, skip + rowsPerPage);
    };
}; 