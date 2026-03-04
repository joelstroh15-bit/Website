class FileExplorer {
    constructor() {
        // Demo-Cloud: Alle Daten aus dem globalen Cloud-Speicher laden
        this.cloudData = this.loadCloudData();
        this.files = this.cloudData.files || [];
        
        // Admin-Config laden (wie Minecraft Config)
        this.adminConfig = this.loadAdminConfig();
        this.adminAccounts = this.adminConfig.adminAccounts || [];
        
        this.selectedFiles = new Set();
        this.currentView = 'grid';
        this.currentFileId = null;
        this.isLightTheme = localStorage.getItem('theme') === 'light';
        this.pendingFiles = [];
        
        // Authentifizierung - nur Admin
        this.isLoggedIn = false;
        this.currentUser = null;
        
        // Admin-Daten
        this.adminCredentials = {
            username: 'admin',
            password: 'gaming123',
            securityPassword: 'HjKloF32.174!G'
        };
        
        this.init();
    }

    // ========== ADMIN-CONFIG SYSTEM ==========
    
    // Admin-Config laden (wie Minecraft Config) - mit Datei-Speicherung
    loadAdminConfig() {
        // Zuerst versuchen aus localStorage zu laden
        const config = localStorage.getItem('adminConfig');
        if (config) {
            return JSON.parse(config);
        }
        
        // Initiale Config erstellen
        const initialConfig = {
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            adminAccounts: []
        };
        
        this.saveAdminConfig(initialConfig);
        return initialConfig;
    }
    
    saveAdminConfig() {
        this.adminConfig.adminAccounts = this.adminAccounts;
        localStorage.setItem('adminConfig', JSON.stringify(this.adminConfig));
    }

    // ========== DEMO-CLOUD SYSTEM ==========
    
    loadCloudData() {
        // Versuche Cloud-Daten zu laden (für Demo: localStorage mit Cloud-Simulation)
        let cloudData = localStorage.getItem('demoCloudData');
        if (cloudData) {
            return JSON.parse(cloudData);
        }
        
        // Wenn keine Cloud-Daten existieren, erstelle initiale Demo-Daten
        const initialData = {
            files: [],
            cloudInitialized: true,
            lastSync: new Date().toISOString()
        };
        
        this.saveCloudData(initialData);
        return initialData;
    }
    
    saveCloudData(data = null) {
        const cloudData = data || {
            files: this.files,
            cloudInitialized: true,
            lastSync: new Date().toISOString()
        };
        
        localStorage.setItem('demoCloudData', JSON.stringify(cloudData));
        
        // Simuliere Cloud-Sync (für Demo-Zwecke)
        this.simulateCloudSync();
    }
    
    simulateCloudSync() {
        // In einer echten Cloud würde hier eine API-Anfrage stattfinden
        // Für Demo-Zwecke simulieren wir einen "Cloud-Sync"
        console.log('🌐 Demo-Cloud Sync ausgeführt um', new Date().toLocaleTimeString());
        
        // Sync-Status nur bei manueller Aktion anzeigen
        // Automatische Sync-Nachrichten entfernt
    }
    
    syncWithCloud() {
        // Lade die neuesten Cloud-Daten
        const latestCloudData = this.loadCloudData();
        
        // Lokale Daten mit Cloud-Daten zusammenführen
        this.files = latestCloudData.files || [];
        
        // UI aktualisieren
        if (this.isLoggedIn) {
            this.renderFiles();
            this.updateStats();
        }
        
        // Keine Benachrichtigung mehr - nur bei manueller Aktion
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.setupF7Key();
        this.checkLoginStatus();
        
        // Warten bis DOM geladen ist, dann Startseite zeigen
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.showStartPage();
            });
        } else {
            this.showStartPage();
        }
    }

    setupEventListeners() {
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Auth buttons
        const logoutBtn = document.getElementById('logoutBtn');
        const accountBtn = document.getElementById('accountBtn');
        
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        if (accountBtn) accountBtn.addEventListener('click', () => this.showAccountSettingsModal());
        
        // Upload functionality
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));

            // Drag and drop
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                this.handleFileSelect(e.dataTransfer.files);
            });
        }

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterFiles(e.target.value);
        });

        // View toggle
        document.getElementById('viewToggle').addEventListener('click', () => {
            this.toggleView();
        });

        // Select all
        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.toggleSelectAll();
        });

        // Delete selected
        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.deleteSelectedFiles();
        });

        // Advanced Search
        const advancedSearchBtn = document.getElementById('advancedSearchBtn');
        if (advancedSearchBtn) advancedSearchBtn.addEventListener('click', () => this.toggleAdvancedSearch());

        // Rename modal
        document.getElementById('renameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.confirmRename();
        });

        // Context menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });

        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.file-item')) {
                e.preventDefault();
                this.showContextMenu(e);
            }
        });
    }

    setupF7Key() {
        document.addEventListener('keydown', (e) => {
            // F7 Taste für Admin-Login (versteckt)
            if (e.key === 'F7' || e.keyCode === 118) {
                e.preventDefault();
                this.showAdminLoginModal();
            }
        });
    }

    // ========== AUTHENTIFIZIERUNG ==========
    
    checkLoginStatus() {
        // Auto-Login deaktivieren - immer als normaler Benutzer starten
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('loginData');
    }

    showStartPage() {
        const startPage = document.getElementById('startPage');
        const fileExplorer = document.getElementById('fileExplorer');
        
        if (startPage) startPage.classList.remove('hidden');
        if (fileExplorer) fileExplorer.classList.add('hidden');
        
        if (this.isLoggedIn) {
            // Admin eingeloggt → Dashboard anzeigen
            this.showUserDashboard();
        } else {
            // Nicht eingeloggt → normale Startseite anzeigen
            this.showNormalStartPage();
        }
    }

    showNormalStartPage() {
        // Normale Startseite mit Auswahlmöglichkeiten anzeigen
        const startPage = document.getElementById('startPage');
        if (startPage) {
            startPage.innerHTML = `
                <div class="gaming-container rounded-lg p-8 w-full max-w-2xl">
                    <div class="text-center mb-8">
                        <i class="fas fa-gamepad text-4xl text-blue-400 mb-4 neon-glow"></i>
                        <h1 class="text-2xl font-bold gaming-text mb-2">JoelyL4Y's File Explorer</h1>
                        <p class="gaming-text-secondary">Willkommen auf meiner Webseite!</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="gaming-card rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-200" onclick="showFileExplorer()">
                            <i class="fas fa-folder text-4xl text-blue-400 mb-4"></i>
                            <h3 class="text-lg font-semibold gaming-text mb-2">Dateien</h3>
                            <p class="text-sm gaming-text-secondary">Alle hochgeladenen Dateien ansehen</p>
                        </div>
                        
                        <div class="gaming-card rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-200" onclick="showLinks()">
                            <i class="fas fa-link text-4xl text-green-400 mb-4"></i>
                            <h3 class="text-lg font-semibold gaming-text mb-2">Links</h3>
                            <p class="text-sm gaming-text-secondary">Gespeicherte Links ansehen</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    showUserDashboard() {
        // Zeige Admin-Dashboard mit Auswahlmöglichkeiten
        const startPage = document.getElementById('startPage');
        if (startPage) {
            startPage.innerHTML = `
                <div class="gaming-container rounded-lg p-8 w-full max-w-2xl">
                    <div class="text-center mb-8">
                        <i class="fas fa-gamepad text-4xl text-blue-400 mb-4 neon-glow"></i>
                        <h1 class="text-2xl font-bold gaming-text mb-2">JoelyL4Y's File Explorer</h1>
                        <p class="gaming-text-secondary">Willkommen zurück, ${this.currentUser.username}!</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="gaming-card rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-200" onclick="showFileExplorer()">
                            <i class="fas fa-folder text-4xl text-blue-400 mb-4"></i>
                            <h3 class="text-lg font-semibold gaming-text mb-2">Dateien</h3>
                            <p class="text-sm gaming-text-secondary">Alle hochgeladenen Dateien ansehen</p>
                        </div>
                        
                        <div class="gaming-card rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-200" onclick="showLinks()">
                            <i class="fas fa-link text-4xl text-green-400 mb-4"></i>
                            <h3 class="text-lg font-semibold gaming-text mb-2">Links</h3>
                            <p class="text-sm gaming-text-secondary">Gespeicherte Links ansehen</p>
                        </div>
                    </div>
                    
                    <div class="text-center mt-8">
                        <button onclick="logout()" class="gaming-button text-white px-6 py-2 rounded-lg">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            `;
        }
    }

    isAdmin() {
        return this.currentUser && (this.currentUser.username === this.adminCredentials.username || this.currentUser.isAdmin === true);
    }

    // Neuen Admin-Account erstellen
    createAdminAccount(username, password) {
        const newAdmin = {
            username: username,
            password: password,
            createdAt: new Date().toISOString(),
            isAdmin: true
        };
        
        this.adminAccounts.push(newAdmin);
        this.saveAdminConfig();
        
        this.showNotification(`✅ Admin-Account "${username}" erstellt!`);
    }

    // Admin-Login mit allen Admins
    performAdminLogin() {
        const username = document.getElementById('usernameInput').value.trim();
        const password = document.getElementById('passwordInput').value;
        
        // Prüfe Haupt-Admin
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.loginAsAdmin(username, 'admin@example.com');
            return;
        }
        
        // Prüfe zusätzliche Admins aus Config
        const adminAccount = this.adminAccounts.find(admin => 
            admin.username === username && admin.password === password
        );
        
        if (adminAccount) {
            this.loginAsAdmin(username, `${username}@admin.local`);
            return;
        }
        
        this.showNotification('Falsche Admin-Zugangsdaten!', 'error');
    }
    
    // Als Admin einloggen
    loginAsAdmin(username, email) {
        this.isLoggedIn = true;
        this.currentUser = {
            id: 0,
            username: username,
            email: email,
            password: '',
            verified: true,
            createdAt: new Date().toISOString(),
            isAdmin: true
        };
        
        localStorage.setItem('loginData', JSON.stringify({
            isLoggedIn: true,
            user: this.currentUser,
            timestamp: new Date().toISOString()
        }));
        
        this.closeAdminCredentialsModal();
        this.updateAuthUI();
        this.showStartPage();
        this.showNotification('🔐 Admin-Login erfolgreich!');
        
        // Admin-Design aktivieren
        this.enableAdminTheme();
    }

    // Admin-Design aktivieren
    enableAdminTheme() {
        document.body.classList.add('admin-theme');
        this.createAdminParticles();
        this.setupAdminMouseEffect();
    }

    // Admin-Design deaktivieren
    disableAdminTheme() {
        document.body.classList.remove('admin-theme');
        this.removeAdminParticles();
        this.removeAdminMouseEffect();
    }

    // Admin-Partikel erstellen
    createAdminParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'admin-particles';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Mehr Partikel erstellen (100 statt 50)
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'admin-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: white;
                border-radius: 50%;
                opacity: 0.3;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                transition: all 0.3s ease;
            `;
            particlesContainer.appendChild(particle);
        }
        
        document.body.appendChild(particlesContainer);
    }

    // Admin-Partikel entfernen
    removeAdminParticles() {
        const particles = document.getElementById('admin-particles');
        if (particles) particles.remove();
    }

    // Admin-Maus-Effekt
    setupAdminMouseEffect() {
        this.adminMouseEffect = (e) => {
            const particles = document.querySelectorAll('.admin-particle');
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            particles.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const particleX = rect.left + rect.width / 2;
                const particleY = rect.top + rect.height / 2;
                const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));
                
                // 3cm Radius (ca. 114px bei 96dpi) - ALLE Partikel im Radius leuchten
                if (distance < 114) {
                    particle.style.opacity = '1';
                    particle.style.transform = `scale(2)`;
                    particle.style.boxShadow = '0 0 20px white';
                    particle.style.background = 'white';
                } else {
                    particle.style.opacity = '0.3';
                    particle.style.transform = 'scale(1)';
                    particle.style.boxShadow = 'none';
                    particle.style.background = 'white';
                }
            });
        };
        
        document.addEventListener('mousemove', this.adminMouseEffect);
    }

    // Admin-Maus-Effekt entfernen
    removeAdminMouseEffect() {
        if (this.adminMouseEffect) {
            document.removeEventListener('mousemove', this.adminMouseEffect);
        }
    }

    showFileExplorer() {
        const startPage = document.getElementById('startPage');
        const fileExplorer = document.getElementById('fileExplorer');
        const linksPage = document.getElementById('linksPage');
        
        if (startPage) startPage.classList.add('hidden');
        if (fileExplorer) fileExplorer.classList.remove('hidden');
        if (linksPage) linksPage.classList.add('hidden');
        
        // Upload-Zone nur für Admins anzeigen
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
            if (this.isAdmin()) {
                uploadSection.classList.remove('hidden');
            } else {
                uploadSection.classList.add('hidden');
            }
        }
        this.renderFiles();
    }

    showLinks() {
        const startPage = document.getElementById('startPage');
        const fileExplorer = document.getElementById('fileExplorer');
        const linksPage = document.getElementById('linksPage');
        
        if (startPage) startPage.classList.add('hidden');
        if (fileExplorer) fileExplorer.classList.add('hidden');
        if (linksPage) linksPage.classList.remove('hidden');
        
        this.renderLinks();
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('loginData');
        this.updateAuthUI();
        
        // Admin-Design deaktivieren
        this.disableAdminTheme();
        
        this.showStartPage(); // Zurück zum Admin-Login
        this.showNotification('Erfolgreich ausgeloggt!');
    }

    // ========== ADMIN-FUNKTIONEN ==========
    
    showAdminLoginModal() {
        // Sicherheits-Passwort Modal anzeigen
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('securityPassword').focus();
    }

    closeAdminCredentialsModal() {
        document.getElementById('securityPasswordModal').classList.add('hidden');
        document.getElementById('adminCredentialsModal').classList.add('hidden');
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('securityPassword').value = '';
        document.getElementById('usernameInput').value = '';
        document.getElementById('passwordInput').value = '';
    }

    // Sicherheits-Passwort überprüfen
    verifySecurityPassword() {
        const securityPassword = document.getElementById('securityPassword').value;
        
        if (securityPassword === this.adminCredentials.securityPassword) {
            // Sicherheits-Passwort korrekt, zeige Admin-Login
            this.showAdminCredentialsModal();
        } else {
            this.showNotification('Falsches Sicherheitspasswort!', 'error');
        }
    }

    // Sicherheits-Passwort abbrechen
    cancelSecurityPassword() {
        this.closeAdminCredentialsModal();
    }

    // Admin-Zugangsdaten Modal
    showAdminCredentialsModal() {
        document.getElementById('securityPasswordModal').classList.add('hidden');
        document.getElementById('adminCredentialsModal').classList.remove('hidden');
        document.getElementById('usernameInput').focus();
    }

    // Admin-Zugangsdaten abbrechen
    cancelAdminCredentials() {
        this.closeAdminCredentialsModal();
    }

    // Admin-Login durchführen
    performAdminLogin() {
        const username = document.getElementById('usernameInput').value.trim();
        const password = document.getElementById('passwordInput').value;
        
        // Prüfe Haupt-Admin
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.loginAsAdmin(username, 'admin@example.com');
            return;
        }
        
        // Prüfe zusätzliche Admins aus Config
        const adminAccount = this.adminAccounts.find(admin => 
            admin.username === username && admin.password === password
        );
        
        if (adminAccount) {
            this.loginAsAdmin(username, `${username}@admin.local`);
            return;
        }
        
        // Wenn Admin nicht gefunden, zeige Account-Erstellung
        this.showCreateAdminAccountModal(username, password);
    }

    // Admin-Account-Erstellungs-Modal anzeigen
    showCreateAdminAccountModal(username, password) {
        // Schließe aktuelle Modal
        document.getElementById('adminCredentialsModal').classList.add('hidden');
        
        // Erstelle Account-Erstellungs-Modal
        const modal = document.createElement('div');
        modal.id = 'createAdminAccountModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="gaming-container gaming-card rounded-lg p-6 w-full max-w-md">
                <h3 class="text-lg font-semibold gaming-text mb-4">Admin-Account erstellen</h3>
                <p class="gaming-text-secondary mb-4">Möchtest du einen neuen Admin-Account erstellen?</p>
                <div class="mb-4">
                    <p class="text-sm gaming-text-secondary">Benutzername: <strong>${username}</strong></p>
                    <p class="text-sm gaming-text-secondary">Passwort: <strong>${password}</strong></p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="window.fileExplorer.createNewAdminAccount('${username}', '${password}')" class="flex-1 gaming-button text-white py-2 rounded-lg">
                        Erstellen
                    </button>
                    <button onclick="window.fileExplorer.cancelCreateAdminAccount()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg">
                        Abbrechen
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Neuen Admin-Account erstellen
    createNewAdminAccount(username, password) {
        const newAdmin = {
            id: Date.now(),
            username: username,
            password: password,
            email: `${username}@admin.local`,
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser?.username || 'system'
        };
        
        this.adminAccounts.push(newAdmin);
        this.saveAdminConfig();
        
        // Modal schließen
        this.cancelCreateAdminAccount();
        
        // Erfolgsmeldung
        this.showNotification(`Admin-Account "${username}" erfolgreich erstellt!`);
        
        // Automatisch als neuer Admin einloggen
        this.loginAsAdmin(username, newAdmin.email);
    }

    // Admin-Account-Erstellung abbrechen
    cancelCreateAdminAccount() {
        const modal = document.getElementById('createAdminAccountModal');
        if (modal) {
            document.body.removeChild(modal);
        }
        this.closeAdminCredentialsModal();
    }

    login() {
        const securityPassword = document.getElementById('securityPassword').value;
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        
        // Sicherheits-Passwort prüfen
        if (securityPassword !== this.adminCredentials.securityPassword) {
            this.showNotification('Falsches Sicherheits-Passwort!', 'error');
            return;
        }
        
        // Admin-Daten prüfen
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.closeLoginModal();
            this.showAdminCredentialsModal();
        } else {
            this.showNotification('Falsche Admin-Zugangsdaten!', 'error');
        }
    }

    showCreateAccountModal() {
        document.getElementById('createAccountModal').classList.remove('hidden');
        document.getElementById('newUsernameInput').focus();
    }

    closeCreateAccountModal() {
        document.getElementById('createAccountModal').classList.add('hidden');
        document.getElementById('newUsernameInput').value = '';
        document.getElementById('newPasswordInput').value = '';
        document.getElementById('confirmPasswordInput').value = '';
    }

    createAccount() {
        const username = document.getElementById('newUsernameInput').value.trim();
        const password = document.getElementById('newPasswordInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;

        // Validierung
        if (!username || !password) {
            this.showNotification('Bitte alle Felder ausfüllen!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwörter stimmen nicht überein!', 'error');
            return;
        }

        if (this.userAccounts.some(account => account.username === username)) {
            this.showNotification('Benutzername existiert bereits!', 'error');
            return;
        }

        // Neuen Account erstellen
        const newAccount = {
            id: Date.now(),
            username: username,
            email: `${username.toLowerCase()}@example.com`, // Placeholder
            age: 18, // Default
            password: password,
            verified: true,
            createdAt: new Date().toISOString()
        };

        this.userAccounts.push(newAccount);
        this.saveCloudData(); // 🌐 In Cloud speichern

        this.closeCreateAccountModal();
        this.showNotification(`🌐 Account "${username}" erfolgreich erstellt!`);
    }

    // ========== THEME ==========
    
    applyTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        if (this.isLightTheme) {
            body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            body.classList.remove('light-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
    }
    
    toggleTheme() {
        this.isLightTheme = !this.isLightTheme;
        localStorage.setItem('theme', this.isLightTheme ? 'light' : 'dark');
        this.applyTheme();
        this.showNotification(`Theme gewechselt zu ${this.isLightTheme ? 'hell' : 'dunkel'}`);
    }

    // ========== DATEI-FUNKTIONEN ==========
    
    handleFileSelect(files) {
        if (!this.isLoggedIn) {
            this.showNotification('Bitte einloggen um Dateien hochzuladen', 'error');
            return;
        }
        
        if (!this.isAdmin()) {
            this.showNotification('Nur Admins dürfen Dateien hochladen!', 'error');
            return;
        }
        
        this.pendingFiles = Array.from(files);
        this.showFileRenameModal();
    }

    showFileRenameModal() {
        const modal = document.getElementById('fileRenameModal');
        const list = document.getElementById('fileRenameList');
        
        list.innerHTML = this.pendingFiles.map((file, index) => `
            <div class="gaming-card rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm gaming-text-secondary mb-2">Name</label>
                        <input type="text" class="gaming-input w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                               value="${file.name}" data-file-index="${index}">
                    </div>
                    <div>
                        <label class="block text-sm gaming-text-secondary mb-2">Datei</label>
                        <div class="gaming-input w-full px-3 py-2 rounded-lg flex items-center">
                            <i class="fas fa-file mr-2"></i>
                            <span class="truncate">${file.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        modal.classList.remove('hidden');
    }
    
    closeFileRenameModal() {
        document.getElementById('fileRenameModal').classList.add('hidden');
        this.pendingFiles = [];
    }
    
    confirmFileRename() {
        const inputs = document.querySelectorAll('#fileRenameList input');
        const renamedFiles = [];
        
        inputs.forEach((input, index) => {
            const newName = input.value.trim() || this.pendingFiles[index].name;
            const file = this.pendingFiles[index];
            
            const fileId = Date.now() + Math.random() + index;
            const fileData = {
                id: fileId,
                name: newName,
                originalName: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                url: URL.createObjectURL(file),
                downloadCount: 0,
                uploadedBy: this.currentUser.username
            };
            
            renamedFiles.push(fileData);
        });
        
        this.files.push(...renamedFiles);
        this.saveCloudData(); // 🌐 In Cloud speichern
        this.renderFiles();
        this.updateStats();
        this.closeFileRenameModal();
        this.showNotification(`🌐 ${renamedFiles.length} Datei(en) erfolgreich hochgeladen`);
    }

    renderFiles() {
        const container = document.getElementById('fileContainer');
        const emptyState = document.getElementById('emptyState');

        if (this.files.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = this.files.map(file => this.createFileElement(file)).join('');
        this.attachFileEventListeners();
    }

    createFileElement(file) {
        const icon = this.getFileIcon(file.type);
        const size = this.formatFileSize(file.size);
        const date = new Date(file.uploadDate).toLocaleDateString('de-DE');
        const downloadCount = file.downloadCount || 0;
        
        // Thumbnail für Bilder
        const thumbnail = file.type.startsWith('image/') ? 
            `<img src="${file.url}" class="w-full h-32 object-cover rounded-lg mb-3" alt="${file.name}">` : 
            `<i class="${icon} text-4xl mb-3"></i>`;

        return `
            <div class="file-item gaming-card rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer" data-file-id="${file.id}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                        ${this.isLoggedIn ? `<input type="checkbox" class="file-checkbox mr-3" data-file-id="${file.id}">` : '<div class="w-6 mr-3"></div>'}
                    </div>
                    <button class="context-menu-btn text-gray-400 hover:text-blue-400 p-2" data-file-id="${file.id}">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                ${thumbnail}
                <h4 class="font-medium gaming-text truncate mb-1" title="${file.name}">${file.name}</h4>
                <p class="text-sm gaming-text-secondary">${size}</p>
                <p class="text-xs gaming-text-secondary">${date}</p>
                ${downloadCount > 0 ? `<p class="text-xs gaming-text-secondary mt-1"><i class="fas fa-download mr-1"></i>${downloadCount}x</p>` : ''}
            </div>
        `;
    }

    attachFileEventListeners() {
        document.querySelectorAll('.file-item').forEach(item => {
            // Klick auf Datei-Element
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('file-checkbox') && !e.target.closest('.context-menu-btn')) {
                    const fileId = parseFloat(item.dataset.fileId);
                    const file = this.files.find(f => f.id === fileId);
                    if (file) {
                        window.open(file.url, '_blank');
                    }
                }
            });
            
            // Kontextmenü-Button
            const contextBtn = item.querySelector('.context-menu-btn');
            if (contextBtn) {
                contextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const fileId = parseFloat(contextBtn.dataset.fileId);
                    const file = this.files.find(f => f.id === fileId);
                    if (file) {
                        this.showContextMenu(e, file);
                    }
                });
            }

            const checkbox = item.querySelector('.file-checkbox');
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    const fileId = parseFloat(checkbox.dataset.fileId);
                    if (checkbox.checked) {
                        this.selectedFiles.add(fileId);
                    } else {
                        this.selectedFiles.delete(fileId);
                    }
                    this.updateDeleteButton();
                });
            }
        });
    }

    renderLinks() {
        const container = document.getElementById('linksContainer');
        const emptyState = document.getElementById('linksEmptyState');
        const linksCount = document.getElementById('linksCount');
        
        // Demo-Links für den Anfang
        const demoLinks = [
            { id: 1, title: 'Google', url: 'https://google.com', description: 'Suchmaschine' },
            { id: 2, title: 'YouTube', url: 'https://youtube.com', description: 'Video-Plattform' }
        ];
        
        linksCount.textContent = `${demoLinks.length} Links`;

        if (demoLinks.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            container.innerHTML = demoLinks.map(link => `
                <div class="gaming-card rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer" onclick="window.open('${link.url}', '_blank')">
                    <div class="flex items-start justify-between mb-3">
                        <i class="fas fa-link text-2xl text-green-400"></i>
                        ${this.isAdmin() ? `
                            <button class="text-gray-400 hover:text-red-400 p-2" onclick="event.stopPropagation(); alert('Link löschen: ${link.title}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : '<div class="w-8"></div>'}
                    </div>
                    <h4 class="font-medium gaming-text truncate mb-1">${link.title}</h4>
                    <p class="text-sm gaming-text-secondary truncate">${link.description}</p>
                    <p class="text-xs gaming-text-secondary mt-2">${link.url}</p>
                </div>
            `).join('');
        }
    }

    // ========== KONTEXTMENÜ ==========
    
    showContextMenu(e, file) {
        this.currentFileId = file.id;
        
        const contextMenu = document.getElementById('contextMenu');
        
        // Admin-Funktionen nur einblenden wenn eingeloggt
        document.getElementById('renameMenuItem').classList.toggle('hidden', !this.isLoggedIn);
        document.getElementById('deleteMenuItem').classList.toggle('hidden', !this.isLoggedIn);
        
        // Position korrigieren
        let left = e.pageX;
        let top = e.pageY;
        
        if (left + 150 > window.innerWidth) {
            left = window.innerWidth - 160;
        }
        if (top + 120 > window.innerHeight) {
            top = window.innerHeight - 130;
        }
        
        contextMenu.style.left = left + 'px';
        contextMenu.style.top = top + 'px';
        contextMenu.classList.remove('hidden');
    }

    hideContextMenu() {
        document.getElementById('contextMenu').classList.add('hidden');
    }

    handleContextAction(action) {
        const file = this.files.find(f => f.id === this.currentFileId);
        if (!file) return;

        switch (action) {
            case 'download':
                this.downloadFile(file);
                break;
            case 'rename':
                this.showRenameModal(file);
                break;
            case 'delete':
                this.deleteFile(file.id);
                break;
        }
        
        this.hideContextMenu();
    }

    // ========== HILFSFUNKTIONEN ==========
    
    getFileIcon(type) {
        if (type.startsWith('image/')) return 'fas fa-image text-blue-500';
        if (type.startsWith('video/')) return 'fas fa-video text-red-500';
        if (type.startsWith('audio/')) return 'fas fa-music text-green-500';
        if (type.includes('pdf')) return 'fas fa-file-pdf text-red-600';
        if (type.includes('word') || type.includes('document')) return 'fas fa-file-word text-blue-600';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'fas fa-file-excel text-green-600';
        if (type.includes('powerpoint') || type.includes('presentation')) return 'fas fa-file-powerpoint text-orange-600';
        if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'fas fa-file-archive text-purple-600';
        if (type.includes('text')) return 'fas fa-file-alt text-gray-600';
        return 'fas fa-file text-gray-500';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    downloadFile(file) {
        file.downloadCount = (file.downloadCount || 0) + 1;
        this.saveFiles();
        
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        this.showNotification(`"${file.name}" heruntergeladen (${file.downloadCount}x)`);
    }

    showRenameModal(file) {
        this.currentFileId = file.id;
        document.getElementById('renameInput').value = file.name;
        document.getElementById('renameModal').classList.remove('hidden');
        document.getElementById('renameInput').focus();
        document.getElementById('renameInput').select();
    }

    closeRenameModal() {
        document.getElementById('renameModal').classList.add('hidden');
    }

    confirmRename() {
        const newName = document.getElementById('renameInput').value.trim();
        const file = this.files.find(f => f.id === this.currentFileId);
        
        if (file && newName) {
            file.name = newName;
            this.saveCloudData(); // 🌐 In Cloud speichern
            this.renderFiles();
            this.closeRenameModal();
            this.showNotification('🌐 Datei erfolgreich umbenannt');
        }
    }

    deleteFile(fileId) {
        if (confirm('Möchtest du diese Datei wirklich löschen?')) {
            this.files = this.files.filter(file => file.id !== fileId);
            this.saveCloudData(); // 🌐 In Cloud speichern
            this.renderFiles();
            this.updateStats();
            this.showNotification('🌐 Datei erfolgreich gelöscht');
        }
    }

    deleteSelectedFiles() {
        if (confirm(`Möchtest du ${this.selectedFiles.size} Dateien wirklich löschen?`)) {
            this.files = this.files.filter(file => !this.selectedFiles.has(file.id));
            this.selectedFiles.clear();
            this.saveCloudData(); // 🌐 In Cloud speichern
            this.renderFiles();
            this.updateStats();
            this.updateDeleteButton();
            this.showNotification('🌐 Dateien erfolgreich gelöscht');
        }
    }

    toggleSelectAll() {
        const checkboxes = document.querySelectorAll('.file-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
            const fileId = parseFloat(checkbox.dataset.fileId);
            if (!allChecked) {
                this.selectedFiles.add(fileId);
            } else {
                this.selectedFiles.delete(fileId);
            }
        });
        
        this.updateDeleteButton();
    }

    updateDeleteButton() {
        const deleteBtn = document.getElementById('deleteSelectedBtn');
        deleteBtn.disabled = this.selectedFiles.size === 0;
    }

    filterFiles(query) {
        const filtered = this.files.filter(file => 
            file.name.toLowerCase().includes(query.toLowerCase())
        );
        
        const container = document.getElementById('fileContainer');
        if (filtered.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">Keine Dateien gefunden</div>';
        } else {
            container.innerHTML = filtered.map(file => this.createFileElement(file)).join('');
            this.attachFileEventListeners();
        }
    }

    toggleView() {
        this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
        const container = document.getElementById('fileContainer');
        const viewToggle = document.getElementById('viewToggle');
        
        if (this.currentView === 'list') {
            container.className = 'space-y-2';
            viewToggle.innerHTML = '<i class="fas fa-th-large text-xl"></i>';
        } else {
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
            viewToggle.innerHTML = '<i class="fas fa-list text-xl"></i>';
        }
        
        this.renderFiles();
    }

    toggleAdvancedSearch() {
        const panel = document.getElementById('advancedSearchPanel');
        panel.classList.toggle('hidden');
    }

    applyFilters() {
        const fileType = document.getElementById('fileTypeFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        const sizeFilter = document.getElementById('sizeFilter').value;
        
        let filteredFiles = [...this.files];
        
        // Dateityp-Filter
        if (fileType) {
            filteredFiles = filteredFiles.filter(file => {
                if (fileType === 'image') return file.type.startsWith('image/');
                if (fileType === 'video') return file.type.startsWith('video/');
                if (fileType === 'audio') return file.type.startsWith('audio/');
                if (fileType === 'document') return file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document') || file.type.includes('text');
                if (fileType === 'archive') return file.type.includes('zip') || file.type.includes('rar') || file.type.includes('7z');
                if (fileType === 'other') return !file.type.startsWith('image/') && !file.type.startsWith('video/') && !file.type.startsWith('audio/');
                return true;
            });
        }
        
        // Datums-Filter
        if (dateFilter) {
            const now = new Date();
            filteredFiles = filteredFiles.filter(file => {
                const fileDate = new Date(file.uploadDate);
                if (dateFilter === 'today') return fileDate.toDateString() === now.toDateString();
                if (dateFilter === 'yesterday') {
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return fileDate.toDateString() === yesterday.toDateString();
                }
                if (dateFilter === 'week') {
                    const weekAgo = new Date(now);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return fileDate >= weekAgo;
                }
                if (dateFilter === 'month') {
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return fileDate >= monthAgo;
                }
                return true;
            });
        }
        
        // Größen-Filter
        if (sizeFilter) {
            filteredFiles = filteredFiles.filter(file => {
                if (sizeFilter === 'small') return file.size < 1024 * 1024;
                if (sizeFilter === 'medium') return file.size >= 1024 * 1024 && file.size <= 10 * 1024 * 1024;
                if (sizeFilter === 'large') return file.size > 10 * 1024 * 1024;
                return true;
            });
        }
        
        this.renderFilteredFiles(filteredFiles);
        this.showNotification(`${filteredFiles.length} Dateien gefunden`);
    }

    clearFilters() {
        document.getElementById('fileTypeFilter').value = '';
        document.getElementById('dateFilter').value = '';
        document.getElementById('sizeFilter').value = '';
        this.renderFiles();
        this.showNotification('Filter gelöscht');
    }

    renderFilteredFiles(filteredFiles) {
        const container = document.getElementById('fileContainer');
        const emptyState = document.getElementById('emptyState');
        
        if (filteredFiles.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">Keine Dateien gefunden</div>';
            emptyState.style.display = 'none';
        } else {
            container.innerHTML = filteredFiles.map(file => this.createFileElement(file)).join('');
            this.attachFileEventListeners();
            emptyState.style.display = 'none';
        }
    }

    updateStats() {
        const fileCount = document.getElementById('fileCount');
        const totalSize = document.getElementById('totalSize');
        
        fileCount.textContent = `${this.files.length} Dateien`;
        
        const totalBytes = this.files.reduce((sum, file) => sum + file.size, 0);
        totalSize.textContent = this.formatFileSize(totalBytes);
    }

    updateAuthUI() {
        const logoutBtn = document.getElementById('logoutBtn');
        const accountBtn = document.getElementById('accountBtn');
        
        if (this.isLoggedIn) {
            logoutBtn.classList.remove('hidden');
            accountBtn.classList.remove('hidden');
        } else {
            logoutBtn.classList.add('hidden');
            accountBtn.classList.add('hidden');
        }
    }

    showAccountSettingsModal() {
        document.getElementById('currentUsername').textContent = this.currentUser.username;
        document.getElementById('accountSettingsModal').classList.remove('hidden');
    }

    closeAccountSettingsModal() {
        document.getElementById('accountSettingsModal').classList.add('hidden');
        document.getElementById('changePasswordInput').value = '';
        document.getElementById('changeConfirmPasswordInput').value = '';
    }

    updatePassword() {
        const newPassword = document.getElementById('changePasswordInput').value;
        const confirmPassword = document.getElementById('changeConfirmPasswordInput').value;
        
        if (!newPassword) {
            this.closeAccountSettingsModal();
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('Passwörter stimmen nicht überein!', 'error');
            return;
        }
        
        const accountIndex = this.userAccounts.findIndex(account => account.id === this.currentUser.id);
        if (accountIndex !== -1) {
            this.userAccounts[accountIndex].password = newPassword;
            this.saveCloudData(); // 🌐 In Cloud speichern
            this.currentUser.password = newPassword;
            
            const loginData = JSON.parse(localStorage.getItem('loginData'));
            loginData.user.password = newPassword;
            localStorage.setItem('loginData', JSON.stringify(loginData));
            
            this.showNotification('🌐 Passwort erfolgreich aktualisiert!');
            this.closeAccountSettingsModal();
        }
    }

    deleteAccount() {
        if (confirm(`Möchtest du den Account "${this.currentUser.username}" wirklich löschen?`)) {
            this.userAccounts = this.userAccounts.filter(account => account.id !== this.currentUser.id);
            this.saveCloudData(); // 🌐 In Cloud speichern
            
            this.logout();
            this.closeAccountSettingsModal();
            this.showNotification('🌐 Account erfolgreich gelöscht!');
        }
    }

    saveFiles() {
        this.saveCloudData(); // 🌐 Alle Daten in Cloud speichern
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
        
        if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        } else if (type === 'info') {
            notification.classList.add('bg-blue-500', 'text-white');
        } else {
            notification.classList.add('bg-green-500', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

function cancelSecurityPassword() {
    window.fileExplorer.cancelSecurityPassword();
}

function cancelAdminCredentials() {
    window.fileExplorer.cancelAdminCredentials();
}

function createNewAdminAccount(username, password) {
    window.fileExplorer.createNewAdminAccount(username, password);
}

function cancelCreateAdminAccount() {
    window.fileExplorer.cancelCreateAdminAccount();
}

function verifySecurityPassword() {
    window.fileExplorer.verifySecurityPassword();
}

function performAdminLogin() {
    window.fileExplorer.performAdminLogin();
}

function showFileExplorer() {
    window.fileExplorer.showFileExplorer();
}

function showLinks() {
    window.fileExplorer.showLinks();
}

function showStartPage() {
    window.fileExplorer.showStartPage();
}

function logout() {
    window.fileExplorer.logout();
}

// Context Menu Funktionen
document.addEventListener('click', (e) => {
    if (e.target.closest('.context-menu-item')) {
        const action = e.target.closest('.context-menu-item').dataset.action;
        window.fileExplorer.handleContextAction(action);
    }
});

// File Explorer initialisieren
window.fileExplorer = new FileExplorer();
