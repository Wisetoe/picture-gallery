const paintings = require('../data/paintingsData');

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
        res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера',
            error: error.message
        });
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
            return res.status(404).json({
                success: false,
                message: 'Картина с таким ID не найдена'
            });
        }
    
        // Возвращаем найденную картину
        res.json({
            success: true,
            data: painting
        });
    } catch (error) {
        // Обработка ошибок сервера
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении картины',
            error: error.message
        });
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
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении картин',
            error: error.message
        });
    }
};

const getGenre = (req,res) => {
    try {
        const paintingGenre = req.params.genre;
        const painting = paintings.filter(p => p.genre.includes(paintingGenre));
        
        if (!paintings.find(p => p.genre.includes(paintingGenre)) ) {
            return res.status(404).json({
                success: false,
                message: 'Картина с таким жанром не найдена'
            });
        }
    
        res.json({
            success: true,
            data: painting
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении картин',
            error: error.message
        });
    }
};

module.exports = {
    getPaintings,
    getPaintingById,
    getArray,
    getFeatured,
    getGenre
};