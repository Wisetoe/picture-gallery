const paintings = require('../data/paintingsData');

const { ERROR_TYPES, sendError } = require('../utils/errors');

const {
    applySearch,
    applyFilters,
    applyPagination,
    applySorting
} = require('../utils/paintingUtils');

const getArray = () => {
    return paintings;
};

const getPaintings = (req,res) => {
    try {
        // Извлекаем параметры запроса со значениями по умолчанию
        const {
            page = 1, // Номер страницы (по умолчанию 1)
            limit = 10, // Количество записей на страницу (по умолчанию 10)
            search, // Текстовый поиск по названию, художнику, описанию
            genre, // Фильтр по жанру
            artist,
            minyear,
            maxyear,
            featured,
            minprice,
            maxprice,
            sortBy,
            sortOrder
        } = req.query;

        // Последовательно применяем обработку данных
        // 1. Поиск по тексту
        let result = applySearch(paintings, search?.toLowerCase());

        // 2. Фильтрация по жанру
        result = applyFilters(result, { genre, artist, minyear, maxyear, featured, minprice, maxprice});

        // сортировкка
        result = applySorting(result, sortBy, sortOrder);

        // 3. Пагинация
        const {data, pagination} = applyPagination(result, page, limit);
        

        // Формируем метаинформацию о доступных фильтрах
        const availableFilters = {
            genres: [...new Set(paintings.flatMap(p => p.genre))], // Уникальные жанры
            artists: [...new Set(paintings.map(p => p.artist))], // Уникальные художники
            years: {
                min: Math.min(...paintings.map(p => p.year)), // Минимальный год
                max: Math.max(...paintings.map(p => p.year)) // Максимальный год
            },
            prices: {
                min: Math.min(...paintings.map(p => p.price).filter(p => p > 0)), // Минимальная цена (исключая 0)
                max: Math.max(...paintings.map(p => p.price)) // Максимальная цена
            }
        };

        // Формируем ответ
        const response = {
            success: true,
            pagination, // Данные о пагинации
            filters: {
                applied: Object.keys(req.query).length > 0 ? req.query : null, // Применённые фильтры
                available: availableFilters // Доступные значения для фильтров
            },
            data // Отфильтрованные картины
        };

        res.json(response);
    } catch (error) {
        console.error('Ошибка при получении картин:', error);
        sendError(res, ERROR_TYPES.SERVER_ERROR, 'Не удалось получить список картин');
    }
};

const getPaintingById = (req,res) => {
   try {
        // Преобразуем параметр id из строки в число
        const paintingId = parseInt(req.params.id);
        // Ищем картину по ID
        const painting = paintings.find(p => p.id === paintingId);
        
        // Если картина не найдена, возвращаем ошибку 404
        if (!painting) {
            return sendError(res, ERROR_TYPES.NOT_FOUND, `Картина с таким ID ${paintingId} не найдена`);
        }
    
        // Возвращаем найденную картину
        res.json({
            success: true,
            data: painting
        });
    } catch (error) {
        // Обработка ошибок сервера
        console.error(`Ошибка в getpaintingByID`, error);
        sendError(res, ERROR_TYPES.SERVER_ERROR, 'Не удалось получить данные картины');
    }
};

const getFeatured = (req,res) => {
    try {
        let result = paintings.filter(painting => painting.isFeatured);
    
        res.json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        console.error('Ошибка в getFeatured:', error);
        sendError(res, ERROR_TYPES.SERVER_ERROR, 'Не удалось получить featured картины');
    }
};

const getGenre = (req,res) => {
    try {
        const paintingGenre = req.params.genre;
        const painting = paintings.filter(p => p.genre.includes(paintingGenre));
        
        if (!paintings.find(p => p.genre.includes(paintingGenre)) ) {
            return sendError(res, ERROR_TYPES.NOT_FOUND, `Картины в жанре ${genre} не найдены`);
        }
    
        res.json({
            success: true,
            data: painting
        });
    } catch (error) {
        console.error('Ошибка в getGenre:', error);
        sendError(res, ERROR_TYPES.SERVER_ERROR, 'Не удалось отфильтровать картины по жанру');
    }
};

module.exports = {
    getPaintings,
    getPaintingById,
    getArray,
    getFeatured,
    getGenre
};