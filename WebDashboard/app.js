import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// --- YOUR CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBvdX4yJnZ5DpR_7VxbRDy39waVpkMtqcY",
    authDomain: "pocketcomm-f2b40.firebaseapp.com",
    databaseURL: "https://pocketcomm-f2b40-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pocketcomm-f2b40",
    storageBucket: "pocketcomm-f2b40.firebasestorage.app",
    messagingSenderId: "606127069932",
    appId: "1:606127069932:web:c909f58887e64af43523c9",
    measurementId: "G-N8BZ610SF6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const pendingContainer = document.getElementById('pending-container');
const completedContainer = document.getElementById('completed-container');

// Function to handle moving to completed
// Note: We attach it to the window object so the HTML onclick="" can see it.
window.markResolved = function(key) {
    const updates = {};
    updates['/messages/' + key + '/status'] = 'completed';
    update(ref(db), updates);
};

// Listen for all messages and sort them
onValue(ref(db, 'messages'), (snapshot) => {
    
    // Clear containers to prevent duplicates on update
    pendingContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    
    const data = snapshot.val();
    if (!data) return;

    // Loop through messages
    Object.entries(data).forEach(([key, msg]) => {
        const msgText = msg.text || "Signal Corrupted";
        
        // EXACT DATA FROM SENDER
        const time = msg.timestamp || "UNKNOWN TIME";
        const gps = msg.gps || "NO FIX";
        const status = msg.status || "pending";

        // Priority Logic
        let cssClass = "card";
        let priority = "LOW PRIORITY";
        const criticalWords = ["help", "sos", "injured", "blood", "trapped", "emergency", "fire", "flood"];
        
        if (criticalWords.some(word => msgText.toLowerCase().includes(word))) {
            cssClass += " critical";
            priority = "CRITICAL ALERT";
        }

        // Determine HTML based on status
        if (status === 'pending') {
            const html = `
                <div class="${cssClass}">
                    <div class="card-meta">
                        <span>TIME: ${time}</span>
                        <span>GPS: ${gps}</span>
                    </div>
                    <div class="message-text">${msgText}</div>
                    <div class="priority-badge">${priority}</div>
                    <button class="resolve-btn" onclick="markResolved('${key}')">ACKNOWLEDGE</button>
                </div>
            `;
            pendingContainer.insertAdjacentHTML('afterbegin', html);
        } else {
            // Completed Layout (Slightly dimmer, no button)
            const html = `
                <div class="${cssClass} completed-card">
                    <div class="card-meta">
                        <span>TIME: ${time}</span>
                        <span>GPS: ${gps}</span>
                    </div>
                    <div class="message-text">${msgText}</div>
                    <div class="priority-badge">ARCHIVED</div>
                </div>
            `;
            completedContainer.insertAdjacentHTML('afterbegin', html);
        }
    });
});
