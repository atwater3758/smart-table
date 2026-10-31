import { rules, createComparison } from "../lib/compare.js";

// src/components/search.js

export function initSearching(searchField) {
    return (data, state, action) => {
        const query = (state[searchField] || '').toLowerCase().trim();

        // Если строка поиска пустая, возвращаем все данные сразу
        if (!query) {
            return data;
        }

        // 2. Фильтруем данные вручную
        return data.filter(row => {
            // Собираем текст из нужных полей в одну строку
            const textToSearchIn = `${row.date} ${row.customer} ${row.seller}`.toLowerCase();
            
            // Проверяем, содержит ли эта строка наш запрос
            return textToSearchIn.includes(query);
        });
    };
}