import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    // Пока оставляем пустым, это будет реализовано позже через createPage
        const pageTemplate = pages.firstElementChild.cloneNode(true);
        pages.firstElementChild.remove();

    let pageCount; // Хранит число страниц после последней отрисовки

    // Функция 1: формирует параметры запроса к API
    const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // Обработка действий пользователя
    if (action) {
        switch (action.name) {
            case 'prev':
            page = Math.max(1, page - 1);
        break;
            case 'next':
            page = Math.min(pageCount, page + 1); // Используем pageCount
        break;
            case 'first':
            page = 1;
        break;
            case 'last':
            page = pageCount;
        break;
            default:
        if (action.page) {
          page = action.page;
        }
    }
  }

  return Object.assign({}, query, {
    limit,
    page
  });
};

// Функция 2: обновляет состояние пагинации (кнопки, счётчики и т. п.)
const updatePagination = (total, { page, limit }) => {
  pageCount = Math.ceil(total / limit); // Сохраняем число страниц

  // @todo: #2.4 — получить список видимых страниц и вывести их
  const visiblePages = getPages(page, pageCount, 5);
  const pagesToRender = visiblePages.length > 0
    ? visiblePages
    : Array.from({ length: 5 }, (_, i) => i + 1);

  pages.replaceChildren(...pagesToRender.map(pageNumber => {
    const el = pageTemplate.cloneNode(true);
    return createPage(el, pageNumber, pageNumber === page);
  }));

  // @todo: #2.5 — обновить статус пагинации
  fromRow.textContent = (page - 1) * limit + 1;
  toRow.textContent = Math.min(page * limit, total);
  totalRows.textContent = total;
};

// Возвращаем обе функции
return {
  updatePagination,
  applyPagination
};
}; 