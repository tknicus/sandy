// 1. I-setup ang Supabase Connection (Gamita ang supabaseClient)
const SUPABASE_URL = 'https://iilfklquzyxmdergwawh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xO3twPzyDBLhdltnkwoS3w_xswYLyf_';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. I-register ang Service Worker (Para sa PWA ug Offline Mode)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered success:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ==================== AUTHENTICATION & UI LOGIC ====================

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email');

// 3. I-CHECK KUNG NAKA-LOGIN NA BA DAAN (Session Check)
async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session) {
        // Naay naka-login, i-pakita ang dashboard
        showDashboard(session.user.email);
    } else {
        // Walay naka-login, i-pakita ang login screen
        showLogin();
    }
}

// 4. LOGIC PARA MUKUHA OG SESSION INIG SULOD (Sign In)
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Pugngan ang page nga mu-refresh
        loginError.textContent = "Nag-verify..."; // Loading state
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            loginError.textContent = "Sayop ang email o password. Sulayi usab.";
        } else {
            loginError.textContent = "";
            showDashboard(data.user.email);
        }
    });
}

// 5. LOGIC PARA MU-GAWAS (Sign Out)
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
            showLogin();
        }
    });
}

// UTILITY FUNCTIONS PARA MU-SWITCH OG SCREEN
function showDashboard(email) {
    if(loginScreen) loginScreen.classList.add('hidden');
    if(dashboardScreen) dashboardScreen.classList.remove('hidden');
    if(userEmailDisplay) userEmailDisplay.textContent = email;
}

function showLogin() {
    if(dashboardScreen) dashboardScreen.classList.add('hidden');
    if(loginScreen) loginScreen.classList.remove('hidden');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
}

// Padaganon inig abli sa app
checkSession();