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
// 📱 MOBILE NAVIGATION TOGGLE
// ==========================================================================
function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// ==========================================================================
// 🎓 COURSE DETAILS MODAL (Preserved from your original code)
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
// 📝 FIREBASE SECURE FORM SUBMISSIONS
// ==========================================================================

// 1. Handle New Student Public Registrations
async function submitPublicRegistration(event) {
    event.preventDefault();
    const btn = document.getElementById('reg-submit-btn');
    const originalText = btn.innerText;
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
        // This keeps it separate from your actual active student list until you manually approve them
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
    const originalText = btn.innerText;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
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
// 🎬 TRADEMARK 3D HEADER ANIMATIONS (Preserved Logic)
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

// Trigger animations when the page finishes loading
window.onload = function() {
    startCycle();
};
