// Поиск по тексту в полях title, artist, description
const applySearch = (paintings, searchTerm) => {
    if (!searchTerm) return paintings;
    return paintings.filter(painting => painting.title.toLowerCase().includes(searchTerm) || painting.artist.toLowerCase().includes(searchTerm) || painting.description.toLowerCase().includes(searchTerm));
};

const applySorting = (paintings, sortBy, sortOrder = 'asc') => {
    if (!sortBy) return paintings;
    
    const sorted = [...paintings];
    const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
    
    sorted.sort((a, b) => {
        let aValue, bValue;
        
        if (sortBy.includes('.')) {
            const keys = sortBy.split('.');
            aValue = keys.reduce((obj, key) => obj?.[key], a);
            bValue = keys.reduce((obj, key) => obj?.[key], b);
        } else {
            aValue = a[sortBy];
            bValue = b[sortBy];
        }
        
        if (aValue < bValue) return -1 * order;
        if (aValue > bValue) return 1 * order;
        return 0;
    });
    
    return sorted;
};

// Применение фильтров
const applyFilters = (paintings, filters) => {
    let filtered = [...paintings];
    
    // Фильтрация по жанру
    if (filters.genre) {
        const genreTerm = filters.genre.toLowerCase();
        filtered = filtered.filter(painting => painting.genre.some(g => g.toLowerCase().includes(genreTerm)));
    }

    // Фильтрация по художнику
    if (filters.artist) {
        const artistTerm = filters.artist.toLowerCase();
        filtered = filtered.filter(painting => painting.artist.toLowerCase().includes(artistTerm));
    }

    if (filters.minyear) {
        const minyear = parseInt(filters.minyear);
        filtered = filtered.filter(painting => painting.year >= minyear);
    }

    if (filters.maxyear){
        const maxyear = parseInt(filters.maxyear);
        filtered = filtered.filter(painting => painting.year <= maxyear);
    }

    if (filters.minprice){
        const minprice = parseInt(filters.minprice);
        filtered = filtered.filter(painting => painting.price >= minprice);
    }

    if (filters.maxprice){
        const maxprice = parseInt(filters.maxprice);
        filtered = filtered.filter(painting => painting.price <= maxprice);
    }

    if (filters.featured !== undefined) {
        const featured = filters.featured === 'true';
        filtered = filtered.filter(painting => painting.isFeatured === featured);
    }

    return filtered;
};

// Применение пагинации
const applyPagination = (paintings, page, limit) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
  
    return {
        data: paintings.slice(startIndex, endIndex), // Выборка данных для текущей страницы
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(paintings.length / limitNum),
            itemsPerPage: limitNum,
            totalItems: paintings.length,
            hasNextPage: pageNum < Math.ceil(paintings.length / limitNum),
            hasPrevPage: pageNum > 1
        }
    };
};

module.exports = {
    applySearch,
    applyFilters,
    applyPagination,
    applySorting
};