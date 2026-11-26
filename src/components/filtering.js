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
  const filter = {};

  Object.keys(elements).forEach(key => {
    const el = elements[key];
    if (!el || !['INPUT', 'SELECT'].includes(el.tagName)) return;

    const value = el.value.trim();
    if (!value) return; 

    if (el.name === 'date') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) {
        console.warn('Неверный формат даты, фильтр по дате не применяется:', value);
        return; 
      }
      filter[`filter[date]`] = value;
    } 
    else if (el.name === 'customer') {
      filter[`filter[customer]`] = value;
    }
  });

  const updatedQuery = Object.keys(filter).length ? Object.assign({}, query, filter) : query;

  if (action && action.name === 'clear') {
    const inputsToClear = document.querySelectorAll('input[name="date"], input[name="customer"]');
    inputsToClear.forEach(input => {
      input.value = '';
    });

    state[action.dataset.field] = '';
    return query;
  }

  return updatedQuery;
};

    return {
        updateIndexes,
        applyFiltering
    }
}