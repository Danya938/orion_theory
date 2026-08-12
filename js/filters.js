document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('filterChart');
    if (!canvas) {
        console.error('Canvas filterChart не знайдено');
        return;
    }
    if (typeof Chart === 'undefined') {
        console.error('Chart.js не завантажився');
        return;
    }

    let cutoff = 1000; // Гц

    // АЧХ фільтра низьких частот першого порядку
    // H(f) = 1 / sqrt(1 + (f/fc)^2)
    function generateResponse() {
        const points = [];
        // Логарифмічна шкала частот від 20 Гц до 20000 Гц
        for (let i = 0; i <= 200; i++) {
            const f = 20 * Math.pow(1000, i / 200); // 20 .. 20000
            const gain = 1 / Math.sqrt(1 + Math.pow(f / cutoff, 2));
            points.push({ x: f, y: gain });
        }
        return points;
    }

    const chart = new Chart(canvas.getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'АЧХ фільтра',
                data: generateResponse(),
                showLine: true,
                borderColor: '#4A9EFF',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Частота (Гц)', color: '#C5CDE0' },
                    ticks: { color: '#C5CDE0' },
                    grid: { color: 'rgba(197,205,224,0.1)' }
                },
                y: {
                    min: 0, max: 1.1,
                    title: { display: true, text: 'Коефіцієнт передачі', color: '#C5CDE0' },
                    ticks: { color: '#C5CDE0' },
                    grid: { color: 'rgba(197,205,224,0.1)' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    const slider = document.getElementById('cutoffSlider');
    const label = document.getElementById('cutoffValue');

    slider.addEventListener('input', function () {
        cutoff = parseInt(slider.value);
        label.textContent = cutoff;
        chart.data.datasets[0].data = generateResponse();
        chart.update();
    });
});