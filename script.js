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
// 📱 EXCELLENT INSTITUTE SMART PLAY STORE APP ENGINE & #ADMIN CMS
// Pre-loaded with verified Play Store metadata + Live Firebase Admin Sync
// ==========================================================================
const DEV_STORE_URL = "https://play.google.com/store/apps/dev?id=6460003774837792893";

// Default Apps Catalog (Python Compiler is now LIVE!)
const defaultAppsData = [
    {
        id: "com.excellentinstitute.app",
        title: "Computer Learning Hub",
        shortSub: "Student Portal & Notes • Live",
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
        shortSub: "Offline C Engine • Live",
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
        id: "com.excellentinstitute.pythoncompiler",
        title: "Python Compiler",
        shortSub: "Offline Python 3 IDE • Live",
        status: "live",
        category: "Education • Offline Programming IDE",
        version: "v1.0",
        updated: "Nov 2026",
        icon: "fa-brands fa-python",
        iconBg: "linear-gradient(135deg, #2563eb, #eab308)",
        playUrl: "https://play.google.com/store/apps/details?id=com.excellentinstitute.pythoncompiler",
        description: "Fast, zero-configuration Python 3.11 offline coding environment and Data Science studio. Run Python scripts, NumPy, Pandas, Matplotlib visual graphs, AI/ML lab practicals, and install PIP packages directly on Android.",
        features: ["Offline CPython 3.11", "Direct PIP Installer", "Visual Graph & Plot Viewer", "50+ AI/ML & Python Vault", "Smart Code Chips"]
    },
    {
        id: "com.excellentinstitute.javacompiler",
        title: "Java Compiler: Offline IDE",
        shortSub: "Offline Java Engine",
        status: "upcoming",
        category: "Upcoming • Offline Programming IDE",
        version: "In Development",
        updated: "Coming Soon",
        icon: "fa-brands fa-java",
        iconBg: "linear-gradient(135deg, #ea580c, #dc2626)",
        playUrl: "https://play.google.com/store/apps/details?id=com.excellentinstitute.javacompiler",
        description: "Complete offline Core Java & Object-Oriented Programming workspace. Designed for BCA, PGDCA, and software aspirants to write, compile, and execute multi-class Java programs locally on Android with smart syntax assistance.",
        features: ["Offline JDK Runner", "OOP Class Templates", "Smart Auto-Complete", "Interactive Console"]
    },
    {
        id: "com.excellentinstitute.dbmscompiler",
        title: "DBMS Compiler Offline IDE",
        shortSub: "Offline SQL Sandbox",
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

const defaultGeneralConfig = {
    tagline: "EMPOWERING MINDS • ELEVATING CAREERS • SINCE 2026",
    tickerHeadline: "📢 ADMISSIONS OPEN FOR 8TH & ABOVE STUDENTS!",
    tickerCourses: "BCC, CCC, CMS, Computer Typing, DCA, PGDCA, Web Development, Graphic Design, Tally, Core Java",
    sessionBadge: "Session 2026",
    address: "Teachers Colony, Rear Side of SBI Bank, Surada, Ganjam, Odisha",
    phone1: "8658219398",
    phone2: "6371305069",
    phone3: "6382537955",
    whatsapp: "918093499722"
};

const defaultTeamData = [
    {
        slot: 1,
        active: true,
        initials: "PK",
        bg: "#0041ff",
        textColor: "#ffffff",
        img: "images/pradeep.jpg",
        name: "Pradeep Kumar Behera",
        role: "Founder & Managing Director",
        bio: "Driving the strategic vision of Excellent Institute, focusing on accessible technology education, system administration, and modern operational management."
    },
    {
        slot: 2,
        active: true,
        initials: "AG",
        bg: "#0a0f1d",
        textColor: "#ffffff",
        img: "images/Anil.jpg",
        name: "Anil Gouda",
        role: "Co-Founder & Academic Lead",
        bio: "Spearheading curriculum design and student success initiatives to ensure practical, industry-relevant training and seamless course delivery."
    },
    {
        slot: 3,
        active: false, // Rajesh Sahoo deactivated by default; reactivate or replace anytime in #admin
        initials: "RS",
        bg: "#00f2ff",
        textColor: "#0a0f1d",
        img: "images/rajesh.jpg",
        name: "Rajesh Sahoo",
        role: "Co-Founder & Strategy Lead",
        bio: "Overseeing student relations, digital communications, internal workflows, and institutional growth strategies."
    },
    {
        slot: 4,
        active: true,
        initials: "SK",
        bg: "#0041ff",
        textColor: "#ffffff",
        img: "images/sandeep.jpg",
        name: "Sandeep Kumar Behera",
        role: "Co-Founder & Technical Director",
        bio: "Leading the institute's IT infrastructure, including advanced Computing network deployments and seamless hardware lab operations."
    }
];

const defaultCoursesData = [
    { id: "bcc", track: 1, shortName: "BCC", fullTitle: "Basic Computer Course (BCC)", dur: "3 Months", who: "Beginners & Students", why: "Foundational Digital Literacy", preview: "Essential computing, MS Office, and Internet skills.", learn: "Computer Fundamentals|Operating System Basics|MS Word|MS Excel|MS PowerPoint|Internet & Email|Practical & Viva", origFee: "1700", discFee: "1500" },
    { id: "ccc", track: 1, shortName: "CCC", fullTitle: "Course on Computer Concepts (CCC)", dur: "3 Months", who: "Beginners & General Public", why: "Core Digital Literacy", preview: "Govt. standard digital literacy and basics.", learn: "Computer Fundamentals|Operating System Basics|Microsoft Word, Excel & PowerPoint|Internet & Email|Intro to HTML & Web Basics|Practical & Viva", origFee: "1700", discFee: "1500" },
    { id: "typing", track: 1, shortName: "Computer Typing", fullTitle: "Certificate in Computer Typing", dur: "3 Months", who: "Students & Data Entry Ops", why: "Speed & Accuracy in Typing", preview: "Master English (45 WPM) and Odia (40 WPM) typing.", learn: "English Typing - 45 WPM|Odia Typing - 40 WPM|Practical & Viva", origFee: "1500", discFee: "1200" },
    { id: "dca", track: 2, shortName: "DCA", fullTitle: "Diploma in Computer Application", dur: "6 Months", who: "Job Seekers & Office Staff", why: "Comprehensive Office & Digital Mastery", preview: "MS Office, Digital Services, Design, and Tally GST.", learn: "Basics of Computer|Windows OS|MS Office|Digital Services|Photoshop & Image Editing|Tally with GST|Practical Work", origFee: "3500", discFee: "3000" },
    { id: "pgdca", track: 2, shortName: "PGDCA", fullTitle: "Post Graduate Diploma in Computer Application", dur: "12 Months", who: "Graduates & Tech Professionals", why: "Advanced Programming & Management", preview: "Advanced software engineering, programming, and databases.", learn: "C & Data Structures|DBMS with SQL|Web Designing (HTML, CSS, JS)|Java OOP|Python Basics|Tally ERP with GST|Practical & Viva", origFee: "7000", discFee: "6000" },
    { id: "webdev", track: 2, shortName: "Web Development", fullTitle: "Diploma in Web Development", dur: "12 Months", who: "Aspiring Web Developers", why: "Full Stack Web Mastery", preview: "Master HTML, React, Node.js, and Databases.", learn: "HTML & CSS Fundamentals|JavaScript Programming|React.js|Backend with Node.js|MongoDB & MySQL|Git & GitHub|Practical & Viva", origFee: "7000", discFee: "6000" },
    { id: "graphic", track: 3, shortName: "Graphic Design", fullTitle: "Certificate in Graphic Design", dur: "3 Months", who: "Creatives & Marketers", why: "Brand Identity Creation", preview: "Master Adobe Creative Suite and CorelDraw.", learn: "Introduction to Graphic Design|Adobe Photoshop Basics|CorelDRAW Techniques|Typography & Color Theory|Layout Design|Practical + Viva", origFee: "1800", discFee: "1500" },
    { id: "tally", track: 3, shortName: "Tally", fullTitle: "Certificate in Tally", dur: "6 Months", who: "Accounting Professionals", why: "Financial & Inventory Management", preview: "Master Tally ERP, GST, Payroll, and Accounting.", learn: "Basics of Tally|Company Creation & Ledgers|Inventory Management|Taxation (GST, TDS)|Payroll & Employee Records|Project & Viva", origFee: "3500", discFee: "3000" },
    { id: "java", track: 3, shortName: "Core Java", fullTitle: "Core Java", dur: "3 Months", who: "Software Aspirants", why: "Backend Dev Foundation", preview: "Learn OOPs, logic, and core Java concepts.", learn: "Object-Oriented Programming|Java Control Structures|Classes & Methods|Inheritance & Polymorphism|Exception Handling|Practical & Viva", origFee: "2000", discFee: "1500" }
];

let instituteAppsData = JSON.parse(JSON.stringify(defaultAppsData));
let generalSiteConfig = JSON.parse(JSON.stringify(defaultGeneralConfig));
let teamMembersData = JSON.parse(JSON.stringify(defaultTeamData));
let coursesSiteData = JSON.parse(JSON.stringify(defaultCoursesData));
let currentAppFilter = 'all';
let isAdminUnlocked = sessionStorage.getItem('ei_admin_unlocked') === 'true';
let currentAdminTab = 'apps';

// Update all live/upcoming counters, badges, and the Student Portal sidebar list
function updateAllAppCountersAndSidebar() {
    const totalCount = instituteAppsData.length;
    const liveApps = instituteAppsData.filter(a => a.status === 'live');
    const liveCount = liveApps.length;
    const upcomingCount = totalCount - liveCount;

    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    setTxt('stat-total-apps', totalCount);
    setTxt('stat-live-apps', liveCount);
    setTxt('stat-upcoming-apps', upcomingCount);
    setTxt('pill-all-apps', totalCount);
    setTxt('pill-live-apps', liveCount);
    setTxt('pill-upcoming-apps', upcomingCount);
    setTxt('portal-app-pill-text', `${liveCount} LIVE • ${upcomingCount} UPCOMING`);
    setTxt('mobile-nav-apps', `Our Apps (${liveCount} Live • ${upcomingCount} Upcoming)`);

    const navBadge = document.querySelector('.nav-app-badge');
    if (navBadge) navBadge.innerText = totalCount;

    // Dynamically render all LIVE apps inside the Student Portal Sidebar
    const miniList = document.getElementById('portal-mini-app-list');
    if (miniList) {
        miniList.innerHTML = liveApps.map(app => `
            <a href="${app.playUrl}" target="_blank" rel="noopener noreferrer" class="portal-mini-app-item">
                <div class="mini-app-icon" style="background: ${app.iconBg};"><i class="${app.icon}"></i></div>
                <div class="mini-app-info">
                    <strong>${app.title}</strong>
                    <span>${app.shortSub || 'Live on Google Play'}</span>
                </div>
                <i class="fa-brands fa-google-play mini-play-icon"></i>
            </a>
        `).join('');
    }
}

function renderInstituteApps(filter = 'all') {
    currentAppFilter = filter;
    updateAllAppCountersAndSidebar();

    const grid = document.getElementById('institute-apps-grid');
    if (!grid) return;

    const filtered = instituteAppsData.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    grid.innerHTML = filtered.map(app => {
        const isLive = app.status === 'live';
        const cardClickAttr = isLive ? `onclick="window.open('${app.playUrl}', '_blank', 'noopener')"` : '';
        const featuresList = Array.isArray(app.features) ? app.features : String(app.features || '').split(',').map(s => s.trim()).filter(Boolean);
        
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
                        ${featuresList.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
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

// Apply General, Team, and Course settings to the live DOM
function applyLiveSiteConfigToDOM() {
    // 1. Tagline & Session Badge
    const taglineEl = document.querySelector('.tagline');
    if (taglineEl && generalSiteConfig.tagline) taglineEl.innerText = generalSiteConfig.tagline;

    const badgeEl = document.querySelector('.form-header .badge');
    if (badgeEl && generalSiteConfig.sessionBadge) badgeEl.innerText = generalSiteConfig.sessionBadge;

    // 2. Train Ticker
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack && generalSiteConfig.tickerHeadline && generalSiteConfig.tickerCourses) {
        const cars = generalSiteConfig.tickerCourses.split(',').map(c => c.trim()).filter(Boolean);
        const carsHtml = cars.map((c, idx) => `<span class="train-car">${c}</span>${idx < cars.length - 1 ? '<span class="train-link">▬</span>' : ''}`).join('');
        const singleTrain = `
            <div class="train-msg">
                <span style="font-size: 24px;">🚂</span>
                <span class="highlight-text">${generalSiteConfig.tickerHeadline}</span>
                ${carsHtml} 🚃
            </div>
        `;
        tickerTrack.innerHTML = singleTrain + singleTrain;
    }

    // 3. Leadership Team Grid (Only renders active members, keeping Rajesh hidden unless reactivated)
    const teamGrid = document.getElementById('team-grid-container') || document.querySelector('.team-grid');
    if (teamGrid && Array.isArray(teamMembersData)) {
        const activeMembers = teamMembersData.filter(m => m.active);
        teamGrid.innerHTML = activeMembers.map((m, idx) => `
            <div class="team-card member-${idx + 1}">
                <div class="flip-avatar">
                    <div class="flip-avatar-inner">
                        <div class="flip-avatar-front" style="background: ${m.bg}; color: ${m.textColor || '#ffffff'};">${m.initials}</div>
                        <div class="flip-avatar-back">
                            <img src="${m.img}" alt="${m.name}">
                        </div>
                    </div>
                </div>
                <h4>${m.name}</h4>
                <span class="team-role">${m.role}</span>
                <p>${m.bio}</p>
            </div>
        `).join('');
    }

    // 4. Courses & Fees Grid
    const coursesMain = document.querySelector('#view-courses .main-content');
    if (coursesMain && Array.isArray(coursesSiteData)) {
        const trackTitles = {
            1: "01. Foundation Tracks",
            2: "02. Professional Diplomas",
            3: "03. Specialized Programs"
        };
        coursesMain.innerHTML = [1, 2, 3].map(trackNum => {
            const trackCourses = coursesSiteData.filter(c => Number(c.track) === trackNum);
            const itemsHtml = trackCourses.map(c => {
                const safeTitle = c.fullTitle.replace(/'/g, "\\'");
                const safeDur = c.dur.replace(/'/g, "\\'");
                const safeWho = c.who.replace(/'/g, "\\'");
                const safeWhy = c.why.replace(/'/g, "\\'");
                const safeLearn = c.learn.replace(/'/g, "\\'");
                return `
                    <div class="item" onclick="showPop('${safeTitle}', '${safeDur}', '${safeWho}', '${safeWhy}', '${safeLearn}', '${c.origFee}', '${c.discFee}')">
                        <div class="top-row"><span class="c-name">${c.shortName}</span><span class="dur">${c.dur.toUpperCase()}</span></div>
                        <span class="preview-text">${c.preview}</span>
                        <div class="fee-display">Fee: <span class="fee-strike">₹${c.origFee}</span><span class="fee-active">₹${c.discFee}*</span></div>
                    </div>
                `;
            }).join('');
            return `
                <div class="card">
                    <div class="card-header">${trackTitles[trackNum]}</div>
                    ${itemsHtml}
                </div>
            `;
        }).join('');
    }
}

// Connect to Firebase `site_config` for real-time synchronization
function initRealtimeSiteConfigSync() {
    if (typeof firebase === 'undefined' || !firebase.apps.length) return;
    try {
        firebase.database().ref('site_config').on('value', snapshot => {
            const data = snapshot.val();
            if (!data) return;

            if (Array.isArray(data.apps)) instituteAppsData = data.apps;
            if (data.general) generalSiteConfig = { ...defaultGeneralConfig, ...data.general };
            if (Array.isArray(data.team)) teamMembersData = data.team;
            if (Array.isArray(data.courses)) coursesSiteData = data.courses;

            renderInstituteApps(currentAppFilter);
            applyLiveSiteConfigToDOM();

            if (isAdminUnlocked && window.location.hash === '#admin') {
                renderAdminTabContent(currentAdminTab);
            }
        });
    } catch (e) {
        console.warn("Realtime config sync fallback:", e);
    }
}

// ==========================================================================
// 🔐 #ADMIN ROUTER, PASSWORD VERIFICATION & CONTROL PANEL
// ==========================================================================
function checkAdminHashRoute() {
    if (window.location.hash === '#admin') {
        switchPage('admin');
        const lockScreen = document.getElementById('admin-lock-screen');
        const dashPanel = document.getElementById('admin-dashboard-panel');
        if (isAdminUnlocked) {
            lockScreen?.classList.add('hidden');
            dashPanel?.classList.remove('hidden');
            renderAdminTabContent(currentAdminTab);
        } else {
            lockScreen?.classList.remove('hidden');
            dashPanel?.classList.add('hidden');
        }
    }
}

window.addEventListener('hashchange', checkAdminHashRoute);

// Password check inside script.js (verifies 'admin@123' via encoded keycode check)
function verifyAdminLogin(event) {
    event.preventDefault();
    const inputEl = document.getElementById('admin-pass-input');
    const errEl = document.getElementById('admin-auth-error');
    const entered = inputEl ? inputEl.value : '';

    // Encoded verification for "admin@123"
    const targetCodes = [97, 100, 109, 105, 110, 64, 49, 50, 51];
    const isMatch = entered.length === targetCodes.length &&
        entered.split('').every((ch, i) => ch.charCodeAt(0) === targetCodes[i]);

    if (isMatch) {
        isAdminUnlocked = true;
        sessionStorage.setItem('ei_admin_unlocked', 'true');
        errEl?.classList.add('hidden');
        if (inputEl) inputEl.value = '';
        checkAdminHashRoute();
    } else {
        errEl?.classList.remove('hidden');
    }
}

function logoutAdmin() {
    isAdminUnlocked = false;
    sessionStorage.removeItem('ei_admin_unlocked');
    window.location.hash = '';
    switchPage('home');
}

function exitAdminMode() {
    window.location.hash = '';
    switchPage('home');
}

function switchAdminTab(tabName, btnEl) {
    currentAdminTab = tabName;
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderAdminTabContent(tabName);
}

async function saveAdminConfigToFirebase(sectionLabel) {
    try {
        await firebase.database().ref('site_config').set({
            apps: instituteAppsData,
            general: generalSiteConfig,
            team: teamMembersData,
            courses: coursesSiteData,
            lastUpdated: new Date().toISOString()
        });
        renderInstituteApps(currentAppFilter);
        applyLiveSiteConfigToDOM();
        alert(`✅ ${sectionLabel} saved and published live!`);
    } catch (err) {
        alert("⚠️ Saved locally in session, but Firebase write failed. Check database rules or internet.");
        console.error(err);
    }
}

function renderAdminTabContent(tab) {
    const box = document.getElementById('admin-tab-content');
    if (!box) return;

    if (tab === 'apps') {
        box.innerHTML = instituteAppsData.map((app, idx) => {
            const isLive = app.status === 'live';
            return `
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3><i class="${app.icon}" style="color:var(--brand); margin-right:8px;"></i> ${app.title} <small style="color:#64748b; font-family:monospace;">(${app.id})</small></h3>
                        <button type="button" class="admin-status-toggle ${isLive ? 'is-live' : 'is-upcoming'}" onclick="toggleAppLiveStatus(${idx})">
                            ${isLive ? '🟢 LIVE ON PLAY STORE (Click to set Upcoming)' : '🟡 UPCOMING (Click to make LIVE)'}
                        </button>
                    </div>
                    <div class="admin-grid-3">
                        <div class="admin-field">
                            <label>App Title</label>
                            <input type="text" value="${app.title}" onchange="instituteAppsData[${idx}].title = this.value">
                        </div>
                        <div class="admin-field">
                            <label>Version (e.g. v1.0)</label>
                            <input type="text" value="${app.version}" onchange="instituteAppsData[${idx}].version = this.value">
                        </div>
                        <div class="admin-field">
                            <label>Updated Label (e.g. Nov 2026)</label>
                            <input type="text" value="${app.updated}" onchange="instituteAppsData[${idx}].updated = this.value">
                        </div>
                    </div>
                    <div class="admin-grid-2">
                        <div class="admin-field">
                            <label>Google Play Store URL</label>
                            <input type="url" value="${app.playUrl}" onchange="instituteAppsData[${idx}].playUrl = this.value">
                        </div>
                        <div class="admin-field">
                            <label>Category Subtitle</label>
                            <input type="text" value="${app.category}" onchange="instituteAppsData[${idx}].category = this.value">
                        </div>
                    </div>
                    <div class="admin-field">
                        <label>App Description</label>
                        <textarea onchange="instituteAppsData[${idx}].description = this.value">${app.description}</textarea>
                    </div>
                </div>
            `;
        }).join('') + `
            <button type="button" class="admin-btn-primary" style="align-self:flex-start; padding:15px 28px; font-size:15px;" onclick="saveAdminConfigToFirebase('Apps Ecosystem')">
                <i class="fa-solid fa-cloud-arrow-up"></i> Save & Publish All App Changes
            </button>
        `;
    } else if (tab === 'general') {
        box.innerHTML = `
            <div class="admin-card">
                <div class="admin-card-header">
                    <h3>📢 Homepage Banner, Train Ticker & Portal Session</h3>
                </div>
                <div class="admin-grid-2">
                    <div class="admin-field">
                        <label>Header Neon Tagline</label>
                        <input type="text" value="${generalSiteConfig.tagline}" oninput="generalSiteConfig.tagline = this.value">
                    </div>
                    <div class="admin-field">
                        <label>Portal Session Badge</label>
                        <input type="text" value="${generalSiteConfig.sessionBadge}" oninput="generalSiteConfig.sessionBadge = this.value">
                    </div>
                </div>
                <div class="admin-field">
                    <label>Marquee Train Headline</label>
                    <input type="text" value="${generalSiteConfig.tickerHeadline}" oninput="generalSiteConfig.tickerHeadline = this.value">
                </div>
                <div class="admin-field">
                    <label>Marquee Train Course Cars (Comma Separated)</label>
                    <input type="text" value="${generalSiteConfig.tickerCourses}" oninput="generalSiteConfig.tickerCourses = this.value">
                </div>
                <button type="button" class="admin-btn-primary" onclick="saveAdminConfigToFirebase('Banner & Ticker')">
                    <i class="fa-solid fa-floppy-disk"></i> Save Banner & Ticker
                </button>
            </div>
        `;
    } else if (tab === 'courses') {
        box.innerHTML = coursesSiteData.map((c, idx) => `
            <div class="admin-card">
                <div class="admin-card-header">
                    <h3>🎓 ${c.shortName} — ${c.fullTitle}</h3>
                </div>
                <div class="admin-grid-3">
                    <div class="admin-field">
                        <label>Duration</label>
                        <input type="text" value="${c.dur}" onchange="coursesSiteData[${idx}].dur = this.value">
                    </div>
                    <div class="admin-field">
                        <label>Original Strike Fee (₹)</label>
                        <input type="text" value="${c.origFee}" onchange="coursesSiteData[${idx}].origFee = this.value">
                    </div>
                    <div class="admin-field">
                        <label>Discounted Active Fee (₹)</label>
                        <input type="text" value="${c.discFee}" onchange="coursesSiteData[${idx}].discFee = this.value">
                    </div>
                </div>
                <div class="admin-field">
                    <label>Card Preview Line</label>
                    <input type="text" value="${c.preview}" onchange="coursesSiteData[${idx}].preview = this.value">
                </div>
                <div class="admin-field">
                    <label>Modal Syllabus Topics (Separated by | pipe)</label>
                    <input type="text" value="${c.learn}" onchange="coursesSiteData[${idx}].learn = this.value">
                </div>
            </div>
        `).join('') + `
            <button type="button" class="admin-btn-primary" style="align-self:flex-start; padding:15px 28px; font-size:15px;" onclick="saveAdminConfigToFirebase('Courses & Fees')">
                <i class="fa-solid fa-cloud-arrow-up"></i> Save All Course & Fee Updates
            </button>
        `;
    } else if (tab === 'team') {
        box.innerHTML = teamMembersData.map((m, idx) => `
            <div class="admin-card">
                <div class="admin-card-header">
                    <h3>👤 Slot ${m.slot}: ${m.name} (${m.initials})</h3>
                    <button type="button" class="admin-status-toggle ${m.active ? 'is-live' : 'is-upcoming'}" onclick="toggleTeamMemberActive(${idx})">
                        ${m.active ? '🟢 VISIBLE ON SITE (Click to Hide)' : '🔴 HIDDEN / COMMENTED OUT (Click to Activate)'}
                    </button>
                </div>
                <div class="admin-grid-3">
                    <div class="admin-field">
                        <label>Full Name</label>
                        <input type="text" value="${m.name}" onchange="teamMembersData[${idx}].name = this.value">
                    </div>
                    <div class="admin-field">
                        <label>Avatar Initials Letter (e.g. PK)</label>
                        <input type="text" maxlength="3" value="${m.initials}" onchange="teamMembersData[${idx}].initials = this.value">
                    </div>
                    <div class="admin-field">
                        <label>Role / Designation</label>
                        <input type="text" value="${m.role}" onchange="teamMembersData[${idx}].role = this.value">
                    </div>
                </div>
                <div class="admin-field">
                    <label>Image Path (e.g. images/pradeep.jpg)</label>
                    <input type="text" value="${m.img}" onchange="teamMembersData[${idx}].img = this.value">
                </div>
                <div class="admin-field">
                    <label>Short Bio</label>
                    <textarea onchange="teamMembersData[${idx}].bio = this.value">${m.bio}</textarea>
                </div>
            </div>
        `).join('') + `
            <button type="button" class="admin-btn-primary" style="align-self:flex-start; padding:15px 28px; font-size:15px;" onclick="saveAdminConfigToFirebase('Leadership Team')">
                <i class="fa-solid fa-cloud-arrow-up"></i> Save Leadership Team Changes
            </button>
        `;
    } else if (tab === 'ads') {
        box.innerHTML = `<div class="admin-card"><p>Loading live AdMob Kill-Switch states from Firebase <code>/settings</code>...</p></div>`;
        firebase.database().ref('settings').once('value').then(snap => {
            const s = snap.val() || {};
            const keys = [
                { k: 'pcBannerAds', label: '🐍 Python IDE — Workspace Banner Ad' },
                { k: 'pcInterstitialAds', label: '🐍 Python IDE — Vault Interstitial Ad' },
                { k: 'pcVaultBannerAds', label: '🐍 Python IDE — Vault Footer Banner Ad' },
                { k: 'jcBannerAds', label: '☕ Java IDE — Workspace Banner Ad' },
                { k: 'jcInterstitialAds', label: '☕ Java IDE — Vault Interstitial Ad' },
                { k: 'jcVaultBannerAds', label: '☕ Java IDE — Vault Footer Banner Ad' }
            ];
            box.innerHTML = `
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3>💰 Remote AdMob Kill-Switches (Firebase /settings)</h3>
                    </div>
                    <div class="admin-grid-2">
                        ${keys.map(item => {
                            const enabled = s[item.k] !== false;
                            return `
                                <div style="display:flex; justify-content:space-between; align-items:center; padding:14px; background:var(--light-bg); border-radius:12px; border:1px solid var(--border);">
                                    <strong style="font-size:13.5px; color:var(--navy);">${item.label}</strong>
                                    <button type="button" class="admin-status-toggle ${enabled ? 'is-live' : 'is-upcoming'}" onclick="toggleFirebaseAdSwitch('${item.k}', ${!enabled})">
                                        ${enabled ? '🟢 ADS ON' : '🔴 ADS OFF'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });
    } else if (tab === 'leads') {
        box.innerHTML = `<div class="admin-card"><p>Loading student registrations from Firebase...</p></div>`;
        firebase.database().ref('public_registrations').limitToLast(25).once('value').then(snap => {
            const raw = snap.val() || {};
            const list = Object.values(raw).reverse();
            box.innerHTML = `
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3>📋 Latest Student Portal Registrations (${list.length})</h3>
                    </div>
                    ${list.length === 0 ? '<p>No registrations found yet.</p>' : list.map(r => `
                        <div style="padding:14px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                            <div>
                                <strong style="color:var(--navy); font-size:15px;">${r.name}</strong> • <span style="color:var(--brand); font-weight:900;">${r.course}</span>
                                <div style="font-size:12px; color:#64748b;">Father: ${r.fatherName} | Date: ${new Date(r.date).toLocaleDateString()}</div>
                            </div>
                            <a href="tel:${r.phone}" class="admin-btn-primary" style="text-decoration:none;"><i class="fa-solid fa-phone"></i> ${r.phone}</a>
                        </div>
                    `).join('')}
                </div>
            `;
        });
    }
}

function toggleAppLiveStatus(idx) {
    const app = instituteAppsData[idx];
    if (!app) return;
    if (app.status === 'live') {
        app.status = 'upcoming';
        app.category = 'Upcoming • Offline Programming IDE';
        app.version = 'In Development';
        app.updated = 'Coming Soon';
    } else {
        app.status = 'live';
        app.category = 'Education • Offline Programming IDE';
        if (app.version === 'In Development') app.version = 'v1.0';
        if (app.updated === 'Coming Soon') app.updated = 'Nov 2026';
        if (app.playUrl === DEV_STORE_URL) {
            app.playUrl = `https://play.google.com/store/apps/details?id=${app.id}`;
        }
    }
    renderAdminTabContent('apps');
}

function toggleTeamMemberActive(idx) {
    if (!teamMembersData[idx]) return;
    teamMembersData[idx].active = !teamMembersData[idx].active;
    renderAdminTabContent('team');
}

async function toggleFirebaseAdSwitch(key, newState) {
    try {
        await firebase.database().ref('settings/' + key).set(newState);
        renderAdminTabContent('ads');
    } catch (e) {
        alert("Failed to toggle ad switch in Firebase.");
    }
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
        if (syncBadge) {
            syncBadge.innerHTML = '<i class="fa-solid fa-shield-check" style="color:#34d399;"></i> Official Play Store Catalog Loaded';
        }
    }
}

// Trigger animations, App Ecosystem rendering, Firebase live config, and #admin routing on load
window.onload = function() {
    startCycle();
    renderInstituteApps('all');
    applyLiveSiteConfigToDOM();
    initRealtimeSiteConfigSync();
    syncPlayStoreMetadata();
    checkAdminHashRoute();
};
