// Database of Career Paths
const roleDb = {
    software_eng: {
        skills: ['Cloud Arch', 'Microservices', 'System Design', 'DevSecOps', 'Data Structures'],
        user: [45, 30, 20, 55, 70],
        market: [90, 85, 95, 80, 95],
        courses: [{ name: "IBM Full Stack Professional", provider: "Coursera" }],
        trends: [12, 22, 31, 38, 52],
        videos: [
            "https://www.youtube.com/embed/avdDEZCcluo",
            "https://www.youtube.com/embed/pM45hWKia5o",
            "https://www.youtube.com/embed/IG3fsRmujqA",
            "https://www.youtube.com/embed/dQ6RNltrXro"
        ]
    },
    data_analyst: {
        skills: ['SQL', 'Python', 'PowerBI', 'Statistics', 'Data Ethics'],
        user: [50, 40, 60, 30, 20],
        market: [95, 90, 85, 80, 75],
        courses: [{ name: "Google Data Analytics", provider: "Coursera" }],
        trends: [18, 25, 35, 48, 65],
        videos: [
            "https://www.youtube.com/embed/7S_zhMmesqU",
            "https://www.youtube.com/embed/T_H9fXIn0Hk",
            "https://www.youtube.com/embed/ua-CiDNNj30",
            "https://www.youtube.com/embed/rG_N7xT6S90"
        ]
    },
    ai_ml: {
        skills: ['PyTorch', 'NLP', 'Computer Vision', 'Model Ops', 'Linear Algebra'],
        user: [20, 15, 10, 5, 50],
        market: [90, 85, 80, 85, 95],
        courses: [{ name: "Machine Learning (Andrew Ng)", provider: "Coursera" }],
        trends: [25, 40, 65, 90, 125],
        videos: ["https://www.youtube.com/embed/i_LwzRVP7bg", "https://www.youtube.com/embed/JMUxmLdpTqA", "https://www.youtube.com/embed/cKxRvEZd3Mw", "https://www.youtube.com/embed/9oF_9m6oPrc"]
    }
};

let selectedRole = "";
let selectedRegion = "";
let radarChart = null;
let trendChart = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dropdown Selection Logic
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const dropdown = e.target.closest('.custom-dropdown');
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const val = e.target.getAttribute('data-value');
            
            trigger.innerHTML = `${e.target.innerText} <span>▼</span>`;
            
            if (dropdown.id === "roleDropdown") selectedRole = val;
            if (dropdown.id === "regionDropdown") selectedRegion = val;
        });
    });

    // 2. Launch Button Logic
    const launchBtn = document.getElementById('launchBtn');
    if(launchBtn) {
        launchBtn.addEventListener('click', runAnalysis);
    }

    // 3. Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            switchPage(e.target.getAttribute('data-page'));
        });
    });
});

function runAnalysis() {
    if (!selectedRole || !selectedRegion) {
        alert("Please select both a Career Track and a Region.");
        return;
    }
    
    const data = roleDb[selectedRole] || roleDb['software_eng'];
    document.getElementById('mainNav').classList.add('active');
    
    // Switch page first so the canvas is visible (Chart.js needs visible canvas to calculate size)
    switchPage('gapPage');
    
    // Wrap in timeout to ensure DOM is rendered before drawing
    setTimeout(() => {
        renderCharts(data);
        updateCourses(data);
        updateRoadmap(data);
    }, 100);
}

function renderCharts(data) {
    const radarCtx = document.getElementById('skillRadar').getContext('2d');
    const trendCtx = document.getElementById('trendChart').getContext('2d');

    if (radarChart) radarChart.destroy();
    if (trendChart) trendChart.destroy();

    // Radar Chart Configuration
    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: data.skills,
            datasets: [
                { 
                    label: 'You', 
                    data: data.user, 
                    borderColor: '#ff9933', 
                    backgroundColor: 'rgba(255, 153, 51, 0.2)',
                    pointBackgroundColor: '#ff9933'
                },
                { 
                    label: '2026 Goal', 
                    data: data.market, 
                    borderColor: '#6366f1', 
                    borderDash: [5, 5],
                    backgroundColor: 'transparent',
                    pointBackgroundColor: '#6366f1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#94a3b8', font: { size: 12 } },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });

    // Trend Chart Configuration
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['2022', '2023', '2024', '2025', '2026'],
            datasets: [{
                label: 'Demand Intensity',
                data: data.trends,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    document.getElementById('trendSummary').innerText = `Trajectory shows ${data.trends[4]}% demand intensity for 2026 in ${selectedRegion}.`;
}

function switchPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
    document.getElementById('heroPage').style.display = 'none';
    
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.style.display = 'block';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) link.classList.add('active');
    });
}

function updateCourses(data) {
    const list = document.getElementById('courseList');
    list.innerHTML = data.courses.map(c => `
        <div class="course-card">
            <h4>${c.name}</h4>
            <p style="color:#ff9933; font-weight:bold;">${c.provider}</p>
        </div>
    `).join('');
}

function updateRoadmap(data) {
    const content = document.getElementById('roadmapContent');
    const phases = ["Foundations", "Accreditation", "Application", "Placement"];
    content.innerHTML = phases.map((p, i) => `
        <div class="roadmap-step">
            <div class="roadmap-card">
                <h3>PHASE ${i+1}: ${p}</h3>
                <div class="video-container">
                    <iframe src="${data.videos[i]}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `).join('');
}