document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('distortionChart');
    if (!canvas) {
        console.error('Canvas distortionChart не знайдено');
        return;
    }
    if (typeof Chart === 'undefined') {
        console.error('Chart.js не завантажився');
        return;
    }

    let gain = 1;

    // Чиста синусоїда для порівняння
    function generateClean() {
        const points = [];
        for (let x = 0; x <= 1; x += 0.005) {
            points.push({ x: x, y: Math.sin(2 * Math.PI * x) });
        }
        return points;
    }

    // Синусоїда після дисторшна через tanh
    function generateDistorted() {
        const points = [];
        for (let x = 0; x <= 1; x += 0.005) {
            const clean = Math.sin(2 * Math.PI * x);
            points.push({ x: x, y: Math.tanh(gain * clean) });
        }
        return points;
    }

    const chart = new Chart(canvas.getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Чистий сигнал',
                    data: generateClean(),
                    showLine: true,
                    borderColor: 'rgba(197, 205, 224, 0.4)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                },
                {
                    label: 'Після дисторшна',
                    data: generateDistorted(),
                    showLine: true,
                    borderColor: '#FF6B4A',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: '#C5CDE0' }, grid: { color: 'rgba(197,205,224,0.1)' } },
                y: { min: -1.2, max: 1.2, ticks: { color: '#C5CDE0' }, grid: { color: 'rgba(197,205,224,0.1)' } }
            },
            plugins: { legend: { labels: { color: '#C5CDE0' } } }
        }
    });

    const slider = document.getElementById('gainSlider');
    const label = document.getElementById('gainValue');

    slider.addEventListener('input', function () {
        gain = parseInt(slider.value);
        label.textContent = gain;
        chart.data.datasets[1].data = generateDistorted();
        chart.update();
    });
});