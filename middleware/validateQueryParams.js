// Middleware для валидации числовых параметров запроса
const validateQueryParams = (req, res, next) => {
    const { page, limit } = req.query;

    // Проверка page
    if (page && isNaN(parseInt(page))) {
        return res.status(400).json({
            success: false,
            message: 'Параметр page должен быть числом'
        });
    }
// Проверка limit
    if (limit && isNaN(parseInt(limit))) {
        return res.status(400).json({
            success: false,
            message: 'Параметр limit должен быть числом'
        });
    }

    next(); // Передаём управление следующему middleware или контроллеру
};

module.exports = validateQueryParams;
