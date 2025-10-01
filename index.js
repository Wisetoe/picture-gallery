express = require('express');

const cors = require('cors');
const logger = require('./middleware/logger');

const paintingRoutes = require('./routes/paintingRoutes');
const quantityRoutes = require('./routes/quantityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use(logger);

app.use('/api/paintings', paintingRoutes);
app.use('/api/quantity', quantityRoutes);

app.use('/{*splat}', (req,res) => {
    res.status(404).json({message: 'Маршрут не найден'});
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});