// 1. I-setup ang Supabase Connection
// HINUMDOMI: Ilisi ni sa imong tinuod nga Supabase URL ug Anon Key
const SUPABASE_URL = 'https://imo-nga-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'imo-nga-taas-nga-anon-key';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. I-register ang Service Worker (Para sa PWA)
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

// 3. Simple Test para masiguro nga konektado sa Supabase
async function checkConnection() {
    const appContainer = document.getElementById('app-container');
    
    // Suwayan nato og kuha ang listahan sa mekaniko
    let { data: mechanics, error } = await supabase
        .from('rs_mechanics')
        .select('*');
        
    if (error) {
        appContainer.innerHTML = `<h2>Error: ${error.message}</h2>`;
    } else {
        appContainer.innerHTML = `<h2>System Ready! Connected sa Supabase.</h2>
                                  <p>Ready na i-build ang UI.</p>`;
    }
}

// Padaganon inig load sa page
checkConnection();