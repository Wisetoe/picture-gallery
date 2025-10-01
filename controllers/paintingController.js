const paintings = require('../data/paintingsData');

const getArray = () => {
    return paintings;
};

const getPaintings = (req,res) => {
    try {
        // Проверяем наличие query-параметра featured
        const featuredOnly = req.query.featured === 'true';
        // Если featuredOnly=true, фильтруем массив, иначе возвращаем все картины
        let result = featuredOnly ? paintings.filter(painting => painting.isFeatured) : paintings;
    
        // Формируем успешный ответ с количеством и данными
        res.json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        // Обработка ошибок сервера
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении картин',
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