let selectedRole = "";
let selectedRegion = "";
let radarChart = null, trendChart = null;
let isLoggedIn = false;
let isSignUpMode = false;

const roleDb = {
    software_eng: {
        skills: ['Cloud Arch', 'Microservices', 'System Design', 'DevSecOps', 'Data Structures'],
        user: [45, 30, 20, 55, 70],
        market: [90, 85, 95, 80, 95],
        courses: [{ name: "IBM Full Stack Professional", provider: "Coursera" }],
        trends: [12, 22, 31, 38, 52],
        phaseVideos: [
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
        phaseVideos: [
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
        phaseVideos: [
            "https://www.youtube.com/embed/i_LwzRVP7bg", 
            "https://www.youtube.com/embed/JMUxmLdpTqA", 
            "https://www.youtube.com/embed/cKxRvEZd3Mw", 
            "https://www.youtube.com/embed/9oF_9m6oPrc"  
        ]
    },
    civil_eng: {
        skills: ['BIM', 'Structural Math', 'Project Mgmt', 'Env Impact', 'Geotech'],
        user: [70, 80, 40, 30, 60],
        market: [95, 90, 85, 75, 85],
        courses: [{ name: "Autodesk Revit Design", provider: "Coursera" }],
        trends: [8, 15, 21, 28, 35],
        phaseVideos: [
            "https://www.youtube.com/embed/yFsh4HkC_9M", 
            "https://www.youtube.com/embed/chom9hiewXI", 
            "https://www.youtube.com/embed/Nd6U2KgHI6k", 
            "https://www.youtube.com/embed/dQ6RNltrXro"  
        ]
    }
};

// UI Event Listeners
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            trigger.innerHTML = `${item.innerText} <span>▼</span>`;
            if (dropdown.id === "roleDropdown") selectedRole = item.getAttribute('data-value');
            if (dropdown.id === "regionDropdown") selectedRegion = item.getAttribute('data-value');
        });
    });
});

// Auth Logic
function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target == modal) modal.style.display = "none";
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('modalTitle').innerText = isSignUpMode ? "Create Account" : "Welcome Back";
    document.getElementById('toggleText').innerText = isSignUpMode ? "Already have an account? Login" : "Don't have an account? Sign Up";
}

function handleAuth() {
    const email = document.getElementById('userEmail').value;
    if (!email) { alert("Please enter email"); return; }
    
    isLoggedIn = true;
    document.getElementById('authBtn').innerText = "Logout";
    document.getElementById('authBtn').setAttribute('onclick', 'logout()');
    document.getElementById('profileLink').style.display = 'block';
    document.getElementById('userEmailDisplay').innerText = email;
    document.getElementById('userNameDisplay').innerText = email.split('@')[0];
    document.getElementById('userInitial').innerText = email[0].toUpperCase();
    
    toggleAuthModal();
    alert(isSignUpMode ? "Account created successfully!" : "Logged in successfully!");
}

function logout() {
    isLoggedIn = false;
    document.getElementById('authBtn').innerText = "Login";
    document.getElementById('authBtn').setAttribute('onclick', 'toggleAuthModal()');
    document.getElementById('profileLink').style.display = 'none';
    location.reload();
}

function switchPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
    document.getElementById('heroPage').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(pageId)) link.classList.add('active');
    });
    window.scrollTo(0, 0);
}

function runAnalysis() {
    if (!selectedRole || !selectedRegion) {
        alert("Please select Career Track and Region.");
        return;
    }
    document.getElementById('mainNav').classList.add('active');
    const data = roleDb[selectedRole] || roleDb['software_eng'];
    
    // Update Profile Info
    document.getElementById('savedGoal').innerText = document.getElementById('roleTrigger').innerText.replace('▼', '');
    document.getElementById('savedLocation').innerText = `Target Region: ${document.getElementById('regionTrigger').innerText.replace('▼', '')}`;

    renderCharts(data);

    document.getElementById('courseList').innerHTML = data.courses
        .map(c => `
            <div class="course-card">
                <h4>${c.name}</h4>
                <p style="color:var(--primary); font-weight:700;">${c.provider}</p>
            </div>
        `).join('');

    document.getElementById('roadmapContent').innerHTML = `
        <div class="roadmap-step"><span class="step-label">PHASE 1: Foundations</span>
            <div class="roadmap-card"><h4>Core Strategic Alignment</h4>
                <p>Start with this blueprint to understand the modern requirements of the track.</p>
                <div class="video-container"><iframe src="${data.phaseVideos[0]}" frameborder="0" allowfullscreen></iframe></div>
            </div>
        </div>
        <div class="roadmap-step"><span class="step-label">PHASE 2: Accreditation</span>
            <div class="roadmap-card"><h4>Industry-Standard Learning</h4>
                <p>Deep dive into the specific tools valued in ${selectedRegion}.</p>
                <div class="video-container"><iframe src="${data.phaseVideos[1]}" frameborder="0" allowfullscreen></iframe></div>
            </div>
        </div>
        <div class="roadmap-step"><span class="step-label">PHASE 3: Application</span>
            <div class="roadmap-card"><h4>Industrial Implementation</h4>
                <p>Build real-world projects based on current market standards.</p>
                <div class="video-container"><iframe src="${data.phaseVideos[2]}" frameborder="0" allowfullscreen></iframe></div>
            </div>
        </div>
        <div class="roadmap-step"><span class="step-label">PHASE 4: Placement</span>
            <div class="roadmap-card"><h4>Career Integration</h4>
                <p>Prepare your final professional profile for Tier-1 recruiters in ${selectedRegion}.</p>
                <div class="video-container"><iframe src="${data.phaseVideos[3]}" frameborder="0" allowfullscreen></iframe></div>
            </div>
        </div>`;
    switchPage('gapPage');
}

function renderCharts(data) {
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(document.getElementById('skillRadar').getContext('2d'), {
        type: 'radar',
        data: {
            labels: data.skills,
            datasets: [
                { label: 'You', data: data.user, borderColor: '#ff9933', backgroundColor: 'rgba(255, 153, 51, 0.1)', borderWidth: 2.5 },
                { label: '2026 Goal', data: data.market, borderColor: '#6366f1', borderDash: [4, 4], backgroundColor: 'transparent' }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    angleLines: { color: 'rgba(255,255,255,0.08)' },
                    pointLabels: { color: '#94a3b8' },
                    ticks: { display: false }
                }
            },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });

    if (trendChart) trendChart.destroy();
    trendChart = new Chart(document.getElementById('trendChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: ['2022', '2023', '2024', '2025', '2026 (Est)'],
            datasets: [{
                label: 'Demand',
                data: data.trends,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#64748b' } },
                y: { ticks: { color: '#64748b' } }
            },
            plugins: { legend: { display: false } }
        }
    });
    document.getElementById('trendSummary').innerText = `Trajectory shows ${data.trends[4]}% demand intensity for 2026 based on market projections.`;
}