express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let paintings = [
     { id: 1, title: 'Девочка с персиками', artist: 'Валентин Серов', year: 1887 },
     { id: 2, title: 'Черный квадрат', artist: 'Казимир Малевич', year: 1915 },
     { id: 3, title: 'Бурлаки на Волге', artist: 'Илья Репин', year: 1873 },
     { id: 4, title: 'Богатыри', artist: 'Виктор Васнецов', year: 1019 },
     { id: 5, title: 'Мона Лиза', artist: 'Леонрадо Да Винчи', year: 1503 }
];

app.get('/api/paintings', (req,res)=>{
    res.json(paintings);
});

app.get('/api/paintings/:id', (req,res)=>{
    const painting = paintings.find(p => p.id === parseInt(req.params.id));

    if(!painting){
        return res.status(404).json({ message: 'Картина с таким ID не найдена'});
    };

    res.json(painting);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте в браузере http://localhost:${PORT}/api/paintings`);
});