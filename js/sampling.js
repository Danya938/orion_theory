document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('samplingChart');
    if (!canvas) {
        console.error('Canvas samplingChart не знайдено');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js не завантажився');
        return;
    }

    const ctx = canvas.getContext('2d');


    function generateContinuous() {
        const points = [];
        for (let x = 0; x <= 1; x += 0.005) {
            points.push({ x: x, y: Math.sin(2 * Math.PI * 2 * x) });
        }
        return points;
    }


    function generateSamples(sampleCount) {
        const points = [];
        for (let i = 0; i <= sampleCount; i++) {
            const x = i / sampleCount;
            points.push({ x: x, y: Math.sin(2 * Math.PI * 2 * x) });
        }
        return points;
    }

    const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Неперервний сигнал',
                    data: generateContinuous(),
                    showLine: true,
                    borderColor: '#4A9EFF',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                },
                {
                    label: 'Дискретні відліки',
                    data: generateSamples(20),
                    showLine: false,
                    backgroundColor: '#FFD98A',
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Час', color: '#C5CDE0' },
                    ticks: { color: '#C5CDE0' },
                    grid: { color: 'rgba(197, 205, 224, 0.1)' }
                },
                y: {
                    title: { display: true, text: 'Амплітуда', color: '#C5CDE0' },
                    ticks: { color: '#C5CDE0' },
                    grid: { color: 'rgba(197, 205, 224, 0.1)' }
                }
            },
            plugins: {
                legend: { labels: { color: '#C5CDE0' } }
            }
        }
    });

    const slider = document.getElementById('sampleRateSlider');
    const valueLabel = document.getElementById('sampleRateValue');

    slider.addEventListener('input', function () {
        const count = parseInt(slider.value);
        valueLabel.textContent = count;
        chart.data.datasets[1].data = generateSamples(count);
        chart.update();
    });
});