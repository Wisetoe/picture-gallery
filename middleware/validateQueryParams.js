const {ERROR_TYPES, sendError} = require('../utils/errors');
// Middleware для валидации числовых параметров запроса
const validateQueryParams = (req, res, next) => {
    const { page, limit, minyear, maxyear, minprice, maxprice} = req.query;

    // Проверка page
    if (page && isNaN(parseInt(page))) {
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `Параметр 'page' должен быть числом`);
    };

// Проверка limit
    if (limit && isNaN(parseInt(limit))) {
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `Параметр 'limit' должен быть числом`);
    }

    if (minyear && isNaN(parseInt(minyear))){
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `Параметр minyear должен быть числом`);
    }

    if(maxyear && isNaN(parceInt(maxyear))){
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `Параметр maxyear должен быть числом`);
    }

    if(minprice && isNaN(parceInt(minprice))){
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `Параметр minprice должен быть числом`);
    }

    if(maxprice && isNaN(parceInt(maxprice))){
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `Парамтер maxprice должен быть числом`);
    }

    //валидация диапозонов
    if (minyear && maxyear && parceInt(minyear) > parseInt(maxyear)){
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `minyear не может быть больше maxyear`);
    }

    if (minprice && maxprice && parseInt(minprice) > parceInt(maxprice)){
        return sendError(res, ERROR_TYPES.VALIDATION_ERROR, `minprice не может быть больше maxprice`);
    }

    next(); // Передаём управление следующему middleware или контроллеру
};

module.exports = validateQueryParams;
