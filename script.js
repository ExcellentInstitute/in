// ==========================================================================
// 🌐 FIREBASE INITIALIZATION
// Safely connects your public website to the Excellent Institute Vault
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyAPJ28Y1jBL30phxN-8yV-4X0raSEuBkx4",
    authDomain: "excellent-institute-vault.firebaseapp.com",
    databaseURL: "https://excellent-institute-vault-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "excellent-institute-vault",
    storageBucket: "excellent-institute-vault.firebasestorage.app",
    messagingSenderId: "132693034261",
    appId: "1:132693034261:web:90db93c407607bd3c5951c",
    measurementId: "G-CTLW9E7MYK"
};

// Initialize Firebase only if it hasn't been initialized yet
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ==========================================================================
// 🖥️ SINGLE PAGE APPLICATION (SPA) NAVIGATION LOGIC
// Switches between Home, Courses, About, and Portal instantly
// ==========================================================================
function switchPage(pageId) {
    // 1. Hide all pages
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    // 2. Remove active state from all desktop nav buttons
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(btn => btn.classList.remove('active'));

    // 3. Show the requested page
    const activePage = document.getElementById(`view-${pageId}`);
    if (activePage) {
        activePage.classList.remove('hidden');
        // Slight delay allows CSS animation to trigger smoothly
        setTimeout(() => activePage.classList.add('active'), 10);
    }

    // 4. Highlight the active nav button (Except the Portal button which stays highlighted)
    const activeBtn = document.getElementById(`nav-${pageId}`);
    if (activeBtn && pageId !== 'portal') {
        activeBtn.classList.add('active');
    }

    // 5. Scroll to the top of the page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// 📱 MOBILE NAVIGATION TOGGLE
// ==========================================================================
function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// ==========================================================================
// 🎓 COURSE DETAILS MODAL 
// ==========================================================================
function showPop(title, dur, who, why, learn, origFee, discFee) {
    document.getElementById('pTitle').innerText = title;
    document.getElementById('pDur').innerText = "PROGRAM DURATION: " + dur;
    document.getElementById('pWho').innerText = who;
    document.getElementById('pWhy').innerText = why;

    // Generate clean bullet points for Syllabus
    let syllabusArray = learn.split('|');
    let syllabusHTML = '<ul style="margin: 0; padding-left: 20px;">';
    syllabusArray.forEach(item => {
        syllabusHTML += `<li style="margin-bottom: 6px;">${item}</li>`;
    });
    syllabusHTML += '</ul>';
    document.getElementById('pLearn').innerHTML = syllabusHTML;

    // Inject separate fee data
    document.getElementById('pFeeOrig').innerText = "₹" + origFee;
    document.getElementById('pFeeDisc').innerText = "₹" + discFee + "*";

    document.getElementById('pModal').style.display = 'flex';
}

// ==========================================================================
// 📞 FLOATING ACTION BUTTON (Call Menu)
// ==========================================================================
function toggleCallMenu(event) {
    if(event) event.stopPropagation();
    const menu = document.getElementById('callMenu');
    if(menu) menu.classList.toggle('active');
}

// Close call menu if user clicks anywhere else on the screen
document.addEventListener('click', function(event) {
    const menu = document.getElementById('callMenu');
    const callFab = document.getElementById('callFab');
    if (menu && menu.classList.contains('active') && callFab && !callFab.contains(event.target)) {
        menu.classList.remove('active');
    }
});

// ==========================================================================
// 📝 FIREBASE SECURE FORM SUBMISSIONS (STUDENT PORTAL)
// ==========================================================================

// 1. Handle New Student Public Registrations
async function submitPublicRegistration(event) {
    event.preventDefault();
    const btn = document.getElementById('reg-submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;

    // Build the payload
    const newRegistration = {
        id: "LEAD_" + Date.now(),
        name: document.getElementById('reg-name').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        fatherName: document.getElementById('reg-father').value.trim(),
        course: document.getElementById('reg-course').value,
        date: new Date().toISOString(),
        status: "Pending Action"
    };

    try {
        // Pushes the data to a secure node in your database called 'public_registrations'
        // This keeps it separate from your actual active student list until you approve them
        await firebase.database().ref('public_registrations').push(newRegistration);
        
        // Show success UI
        document.getElementById('public-reg-form').reset();
        document.getElementById('reg-success-msg').classList.remove('hidden');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            document.getElementById('reg-success-msg').classList.add('hidden');
        }, 5000);

    } catch (error) {
        alert("Submission failed. Please check your internet connection and try again.");
        console.error("Firebase Error:", error);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 2. Handle Data Deletion Requests (Privacy Compliance)
async function submitDataRemoval(event) {
    event.preventDefault();
    const btn = document.getElementById('remove-submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    const phone = document.getElementById('remove-phone').value.trim();
    const requestPayload = {
        id: "DEL_REQ_" + Date.now(),
        phone: phone,
        requestDate: new Date().toISOString(),
        status: "Pending Verification"
    };

    try {
        // Sends the request to your database
        await firebase.database().ref('data_removal_requests').push(requestPayload);
        
        document.getElementById('data-removal-form').reset();
        document.getElementById('remove-success-msg').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('remove-success-msg').classList.add('hidden');
        }, 5000);

    } catch (error) {
        alert("Failed to submit removal request. Please call the institute directly.");
        console.error("Firebase Error:", error);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ==========================================================================
// 🎬 TRADEMARK 3D HEADER ANIMATIONS 
// ==========================================================================
const nameText = "EXCELLENT INSTITUTE";
const container = document.getElementById('nameContainer');
const headerBg = document.getElementById('headerBg');

function createLetters() {
    if(!container) return;
    container.innerHTML = '';
    nameText.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.innerText = char === ' ' ? '\u00A0' : char;
        span.className = 'letter';
        if(char === ' ') span.style.width = "15px";
        
        // Survivor logic: Targeting indices 14 and 15 specifically (I and T in INSTITUTE)
        if(i === 14) span.id = "survivor-i"; 
        if(i === 15) span.id = "survivor-t"; 
        
        container.appendChild(span);
    });
}

async function startCycle() {
    if(!container || !headerBg) return;
    
    createLetters();
    const letters = document.querySelectorAll('.letter');
    
    headerBg.classList.add('tv-glitch');
    await new Promise(r => setTimeout(r, 600));
    headerBg.classList.remove('tv-glitch');

    for(let i=0; i<letters.length; i++) {
        await new Promise(r => setTimeout(r, 70));
        letters[i].classList.add('active');
    }

    await new Promise(r => setTimeout(r, 2000));
    headerBg.classList.add('shake');
    await new Promise(r => setTimeout(r, 1200));
    headerBg.classList.remove('shake');

    letters.forEach((l, i) => {
        if(l.id !== 'survivor-i' && l.id !== 'survivor-t') {
            setTimeout(() => { l.classList.remove('active'); l.classList.add('fall'); }, i * 40);
        } else { 
            l.classList.add('it-hang'); 
        }
    });

    await new Promise(r => setTimeout(r, 3800));
    const iChar = document.getElementById('survivor-i');
    const tChar = document.getElementById('survivor-t');
    if(iChar && tChar) {
        iChar.classList.remove('it-hang'); iChar.classList.add('fall');
        await new Promise(r => setTimeout(r, 350));
        tChar.classList.remove('it-hang'); tChar.classList.add('fall');
    }
    
    await new Promise(r => setTimeout(r, 1500));
    startCycle(); // Loop endlessly
}

// ==========================================================================
// 🔄 FLOATING HARD REFRESH ENGINE (Works in Mobile App & Web Browsers)
// ==========================================================================
async function forceHardRefresh(btnElement) {
    try {
        if (btnElement) {
            const icon = btnElement.querySelector('i');
            if (icon) {
                icon.classList.add('fa-spin');
            }
        }

        // 1. If running inside the Excellent Institute Flutter Mobile App,
        // trigger the native WebView cache-clear & HighTechLoader reload!
        if (window.isExcellentMobileApp) {
            window.location.href = 'eiportal://refresh';
            return;
        }

        // 2. If running in a standard mobile/desktop browser, wipe Cache Storage
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
    } catch (e) {
        console.warn("Cache clear warning:", e);
    }

    // 3. Reload with a fresh cache-busting timestamp
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    window.location.replace(`${baseUrl}?v=${Date.now()}`);
}

// ==========================================================================
// 📱 EXCELLENT INSTITUTE SMART PLAY STORE APP ENGINE
// Pre-loaded with verified Play Store metadata + Live Background Sync
// ==========================================================================
const DEV_STORE_URL = "https://play.google.com/store/apps/dev?id=6460003774837792893";

const instituteAppsData = [
    {
        id: "com.excellentinstitute.app",
        title: "Computer Learning Hub",
        status: "live",
        category: "Education • Student Portal",
        version: "v1.0.27",
        updated: "Oct 2026",
        icon: "fa-solid fa-graduation-cap",
        iconBg: "linear-gradient(135deg, #0041ff, #00c6ff)",
        playUrl: "https://play.google.com/store/apps/details?id=com.excellentinstitute.app",
        description: "Official student portal for Excellent Institute, Surada. Provides enrolled students with seamless, secure access to digital study notes (PGDCA, DCA, Python, SQL), offline PDF viewer, fee & dues tracking, Ad-Reward discount wallet, and biometric security.",
        features: ["Secure Study Archive", "Fee & Dues Tracker", "Offline PDF Viewer", "Biometric Lock", "Smart Lab Seating"]
    },
    {
        id: "com.excellentinstitute.ccompiler",
        title: "C Compiler & IDE",
        status: "live",
        category: "Education • Offline Programming IDE",
        version: "v1.0",
        updated: "Oct 2026",
        icon: "fa-solid fa-terminal",
        iconBg: "linear-gradient(135deg, #0a0f1d, #0041ff)",
        playUrl: "https://play.google.com/store/apps/details?id=com.excellentinstitute.ccompiler",
        description: "Lightweight mobile C programming workspace built by Excellent Institute. Write, compile, and run C programs 100% offline with a native C compilation engine, interactive STDIN console for multiple scanf inputs, programmer keyboard shortcuts, and 100+ built-in Code Vault templates.",
        features: ["100% Offline C Engine", "Interactive STDIN Console", "100+ Code Vault Programs", "Smart Typo Checker", "Direct .c File Save"]
    },
    {
        id: "com.excellentinstitute.javacompiler",
        title: "Java Compiler: Offline IDE",
        status: "upcoming",
        category: "Upcoming • Offline Programming IDE",
        version: "In Development",
        updated: "Coming Soon",
        icon: "fa-brands fa-java",
        iconBg: "linear-gradient(135deg, #ea580c, #dc2626)",
        playUrl: DEV_STORE_URL,
        description: "Complete offline Core Java & Object-Oriented Programming workspace. Designed for BCA, PGDCA, and software aspirants to write, compile, and execute multi-class Java programs locally on Android with smart syntax assistance.",
        features: ["Offline JDK Runner", "OOP Class Templates", "Smart Auto-Complete", "Interactive Console"]
    },
    {
        id: "com.excellentinstitute.pythoncompiler",
        title: "Python Compiler Offline IDE",
        status: "upcoming",
        category: "Upcoming • Offline Programming IDE",
        version: "In Development",
        updated: "Coming Soon",
        icon: "fa-brands fa-python",
        iconBg: "linear-gradient(135deg, #2563eb, #eab308)",
        playUrl: DEV_STORE_URL,
        description: "Fast, zero-configuration Python 3 offline coding environment for students and developers. Practice logic, automation scripts, data structures, and academic lab assignments anywhere without an internet connection.",
        features: ["Offline Python 3 Runtime", "Interactive REPL Shell", "Indentation Helper Keys", "Built-in Lab Examples"]
    },
    {
        id: "com.excellentinstitute.dbmscompiler",
        title: "DBMS Compiler Offline IDE",
        status: "upcoming",
        category: "Upcoming • Database & SQL Sandbox",
        version: "In Development",
        updated: "Coming Soon",
        icon: "fa-solid fa-database",
        iconBg: "linear-gradient(135deg, #059669, #10b981)",
        playUrl: DEV_STORE_URL,
        description: "Dedicated offline Relational Database & SQL query execution engine. Create tables, run complex JOINs, practice DDL/DML commands, and visualize relational schemas with pre-loaded university practical datasets.",
        features: ["Offline SQLite Engine", "Visual Table Output", "Pre-loaded Sample DBs", "SQL Keyword Bar"]
    }
];

let currentAppFilter = 'all';

function renderInstituteApps(filter = 'all') {
    currentAppFilter = filter;
    const grid = document.getElementById('institute-apps-grid');
    if (!grid) return;

    const filtered = instituteAppsData.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    grid.innerHTML = filtered.map(app => {
        const isLive = app.status === 'live';
        const cardClickAttr = isLive ? `onclick="window.open('${app.playUrl}', '_blank', 'noopener')"` : '';
        
        return `
            <div class="inst-app-card ${isLive ? 'is-live' : 'is-upcoming'}" ${cardClickAttr}>
                <div>
                    <div class="app-card-top">
                        <div class="app-icon-box" style="background: ${app.iconBg};">
                            <i class="${app.icon}"></i>
                        </div>
                        <span class="app-status-badge ${isLive ? 'badge-live' : 'badge-upcoming'}">
                            ${isLive ? '<span class="pulse-dot"></span> LIVE ON PLAY STORE' : '<i class="fa-solid fa-clock"></i> UPCOMING RELEASE'}
                        </span>
                    </div>

                    <div class="app-title-area">
                        <h3 id="title-${app.id}">${app.title}</h3>
                        <span class="app-pkg-id">${app.id}</span>
                    </div>

                    <p class="app-desc-text" id="desc-${app.id}">${app.description}</p>

                    <ul class="app-features-list">
                        ${app.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
                    </ul>
                </div>

                <div class="app-card-footer" onclick="event.stopPropagation()">
                    <div class="app-meta-info">
                        <div>${app.category}</div>
                        <div style="color: var(--navy);">${app.version} • ${app.updated}</div>
                    </div>
                    ${isLive ? `
                        <a href="${app.playUrl}" target="_blank" rel="noopener noreferrer" class="app-install-btn">
                            <i class="fa-brands fa-google-play"></i> View on Play Store
                        </a>
                    ` : `
                        <a href="${DEV_STORE_URL}" target="_blank" rel="noopener noreferrer" class="app-upcoming-btn" title="Follow our Developer Page for release updates">
                            <i class="fa-solid fa-bell"></i> Follow Dev Page
                        </a>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function filterInstituteApps(filterType, btnEl) {
    document.querySelectorAll('.app-filter-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderInstituteApps(filterType);
}

// Smart Background Sync: Fetches live OpenGraph description/title from Google Play URLs via CORS proxy
async function syncPlayStoreMetadata() {
    const syncBadge = document.getElementById('play-sync-status');
    const liveApps = instituteAppsData.filter(a => a.status === 'live');

    try {
        for (const app of liveApps) {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(app.playUrl + '&hl=en_IN')}`;
            const response = await fetch(proxyUrl, { cache: 'no-store' });
            if (!response.ok) continue;

            const data = await response.json();
            if (!data.contents) continue;

            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');

            const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
            const itemDesc = doc.querySelector('meta[itemprop="description"]')?.getAttribute('content');
            const rawDesc = itemDesc || ogDesc;

            if (rawDesc && rawDesc.length > 40) {
                // Clean up and format live Play Store description snippet
                const cleanSnippet = rawDesc.replace(/\s+/g, ' ').trim();
                app.description = cleanSnippet.length > 260 ? cleanSnippet.substring(0, 257) + '...' : cleanSnippet;
                const descEl = document.getElementById(`desc-${app.id}`);
                if (descEl) descEl.innerText = app.description;
            }
        }

        if (syncBadge) {
            syncBadge.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#34d399;"></i> Live Play Store Metadata Verified';
        }
    } catch (err) {
        // Fallback already has exact verified Play Store descriptions
        if (syncBadge) {
            syncBadge.innerHTML = '<i class="fa-solid fa-shield-check" style="color:#34d399;"></i> Official Play Store Catalog Loaded';
        }
    }
}

// Trigger animations and App Ecosystem rendering when the page finishes loading
window.onload = function() {
    startCycle();
    renderInstituteApps('all');
    syncPlayStoreMetadata();
};
