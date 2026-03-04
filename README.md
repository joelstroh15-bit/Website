# Gaming File Explorer - Geschütztes Datei-Upload Portal

Eine moderne, Gaming-inspirierte Webseite zum Hochladen und Verwalten von Dateien mit Explorer-ähnlicher Oberfläche und Admin-Zugangskontrolle.

## 🎮 **Features**

### � **Sicherheit & Zugangskontrolle**
- **Admin Login** - Nur du kannst Dateien hochladen und verwalten
- **Öffentliche Ansicht** - Besucher können Dateien herunterladen, aber nicht ändern
- **Geschützte Funktionen** - Upload, Löschen und Umbenennen nur für Admin

### 🎨 **Gaming Design**
- **Blaue Wolken Animation** - Dynamischer Hintergrund mit schwebenden Wolken
- **Neon-Effekte** - Leuchtende Elemente im Gaming-Stil
- **Dark Theme** - Moderne dunkle Oberfläche mit blauen Akzenten
- **Responsive Design** - Optimiert für Desktop, Tablet und Mobile

### 📁 **Datei-Management**
- **Drag & Drop Upload** - Dateien per Drag & Drop oder Klick hochladen
- **Explorer-Interface** - Vertraute Dateiverwaltung wie im Windows Explorer
- **Dateivorschau** - Icons für verschiedene Dateitypen (Bilder, Videos, Dokumente etc.)
- **Suchfunktion** - Schnelle Dateisuche
- **Ansichten** - Grid- und Listenansicht
- **Kontextmenü** - Rechtsklick für Download, Umbenennen, Löschen (nur Admin)

## 🔑 **Login-System**

### **Versteckter Admin-Zugang**
- **F7 Taste drücken** für den Login-Bereich
- Kein offensichtlicher Login-Button - für mehr Sicherheit

### **Account-Erstellung**
1. **F7 drücken** für Login-Fenster
2. Mit Standard-Daten einloggen:
   - Benutzername: `admin`
   - Passwort: `gaming123`
3. **Neuen Account erstellen** mit eigenen Daten:
   - Benutzername wählen
   - Passwort festlegen
   - Account wird gespeichert

### **Einloggen mit neuem Account**
- Nach der Erstellung kannst du dich mit deinen neuen Daten einloggen
- Die Standard-Daten dienen nur zur Account-Erstellung
- Jeder Account hat eigene Zugriffsrechte

### **Account-Verwaltung**
- **Passwort ändern**: Eingeloggt → Account → Passwort aktualisieren
- **Account löschen**: Account kann jederzeit gelöscht werden
- **Mehrere Benutzer**: Unbegrenzte Accounts möglich

⚠️ **Wichtig:** Nur eingeloggte Benutzer können Dateien hochladen, löschen und umbenennen!

## 📱 **Verwendung**

### **Für Besucher (öffentlich)**
- Dateien durchsuchen und herunterladen
- Suchfunktion nutzen
- Ansichten wechseln

### **Für Admin (nach Login)**
- Alle öffentlichen Funktionen
- **Dateien hochladen** - Drag & Drop oder Klick
- **Dateien löschen** - Rechtsklick oder Mehrfachauswahl
- **Dateien umbenennen** - Rechtsklick → Umbenennen
- **Mehrfachauswahl** - Mehrere Dateien gleichzeitig löschen

## 🌐 **Deployment**

### **Option 1: GitHub Pages (Kostenlos)**
1. Lade die Dateien in ein GitHub Repository
2. Gehe zu Settings → Pages
3. Wähle "Deploy from a branch"
4. Wähle die `main` Branch und `/root` Ordner
5. Deine Seite ist unter `https://username.github.io/repository-name` verfügbar

### **Option 2: Netlify (Kostenlos)**
1. Erstelle ein Netlify Konto
2. Ziehe den Projektordner per Drag & Drop in Netlify
3. Deine Seite ist sofort live

### **Option 3: Eigener Server**
Lade die Dateien einfach auf einen Webserver hoch. Die Seite funktioniert überall, wo HTML, CSS und JavaScript unterstützt werden.

## 🛠️ **Technologien**

- **HTML5** - Semantische Struktur
- **Tailwind CSS** - Modernes, responsives Design
- **Vanilla JavaScript** - Keine Frameworks, reines JavaScript
- **Font Awesome** - Icons für Dateitypen
- **LocalStorage** - Lokale Datenspeicherung und Login-Status

## 📁 **Dateistruktur**

```
personal-website/
├── index.html          # Hauptseite mit Gaming-Design
├── script.js           # JavaScript Funktionalität + Login-System
├── README.md           # Diese Datei
└── style.css           # Zusätzliche Styles (optional)
```

## 🔧 **Anpassungen**

### **Login-Daten ändern**
In `script.js` Zeile 9-12:
```javascript
this.adminCredentials = {
    username: 'dein-benutzername',
    password: 'dein-sicheres-passwort'
};
```

### **Farben anpassen**
Ändere die Farben in der `index.html` im `<style>` Bereich:
```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --background-color: #f8fafc;
}
```

### **Logo und Titel ändern**
In `index.html` die folgenden Zeilen anpassen:
```html
<title>Dein Titel</title>
<h1 class="text-xl font-semibold gaming-text neon-glow">Dein Name</h1>
```

## 📝 **Hinweise**

- Die Webseite verwendet **LocalStorage** für die Datenspeicherung
- Dateien werden nur im Browser gespeichert, nicht auf einem Server
- Bei einem Browser-Reset oder Cache-Leeren gehen die Daten verloren
- Login-Status wird ebenfalls im LocalStorage gespeichert
- Für permanente Speicherung wird ein Backend-Server benötigt
- Die Seite ist **offline-fähig** nach dem ersten Laden

## 🚀 **Erweiterungsmöglichkeiten**

- **Backend-Integration**: Node.js, PHP, oder Python für permanente Speicherung
- **User-Authentifizierung**: Mehrere Benutzer mit verschiedenen Rechten
- **Datei-Teilen**: Einmal-Links für den Dateiaustausch
- **Cloud-Storage**: Integration mit Google Drive, Dropbox etc.
- **Datei-Konvertierung**: Automatische Konvertierung von Dateiformaten
- **Upload-Größenbegrenzung**: Maximale Dateigröße festlegen

## 🎮 **Gaming-Features**

- **Animierte Wolken** - Schwebende Wolken im Hintergrund
- **Neon-Glow** - Leuchtende Texteffekte
- **Hover-Animationen** - Interaktive Elemente mit Gaming-Style
- **Dark Theme** - Augenfreundliches dunkles Design
- **Smooth Transitions** - Fließende Animationen

## 📄 **Lizenz**

MIT License - Frei zur kommerziellen und privaten Nutzung

---

**Viel Erfolg mit deiner Gaming File Explorer Webseite!** 🎉🎮
