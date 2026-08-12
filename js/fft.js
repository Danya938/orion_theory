document.addEventListener('DOMContentLoaded', function () {
    const timeCanvas = document.getElementById('timeChart');
    const freqCanvas = document.getElementById('freqChart');
    if (!timeCanvas || !freqCanvas) {
        console.error('Canvas не знайдено');
        return;
    }
    if (typeof Chart === 'undefined') {
        console.error('Chart.js не завантажився');
        return;
    }

    // Амплітуди трьох гармонік
    let amp = [1.0, 0.5, 0.3];

    // Генеруємо сигнал у часовій області як суму трьох синусоїд
    function generateSignal() {
        const points = [];
        for (let x = 0; x <= 1; x += 0.005) {
            let y = 0;
            for (let h = 0; h < 3; h++) {
                y += amp[h] * Math.sin(2 * Math.PI * (h + 1) * x);
            }
            points.push({ x: x, y: y });
        }
        return points;
    }

    // Часовий графік
    const timeChart = new Chart(timeCanvas.getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Сигнал',
                data: generateSignal(),
                showLine: true,
                borderColor: '#4A9EFF',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: '#C5CDE0' }, grid: { color: 'rgba(197,205,224,0.1)' } },
                y: { min: -2, max: 2, ticks: { color: '#C5CDE0' }, grid: { color: 'rgba(197,205,224,0.1)' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Спектральний графік (стовпчики)
    const freqChart = new Chart(freqCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['1', '2', '3'],
            datasets: [{
                label: 'Амплітуда',
                data: amp.slice(),
                backgroundColor: '#FFD98A'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Номер гармоніки', color: '#C5CDE0' },
                    ticks: { color: '#C5CDE0' }, grid: { color: 'rgba(197,205,224,0.1)' } },
                y: { min: 0, max: 1.2, ticks: { color: '#C5CDE0' }, grid: { color: 'rgba(197,205,224,0.1)' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Оновлення при русі повзунків
    function updateCharts() {
        timeChart.data.datasets[0].data = generateSignal();
        timeChart.update();
        freqChart.data.datasets[0].data = amp.slice();
        freqChart.update();
    }

    function bindSlider(sliderId, valueId, index) {
        const slider = document.getElementById(sliderId);
        const label = document.getElementById(valueId);
        slider.addEventListener('input', function () {
            amp[index] = parseInt(slider.value) / 100;
            label.textContent = amp[index].toFixed(1);
            updateCharts();
        });
    }

    bindSlider('h1Slider', 'h1Value', 0);
    bindSlider('h2Slider', 'h2Value', 1);
    bindSlider('h3Slider', 'h3Value', 2);
});