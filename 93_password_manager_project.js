const passwordForm = document.getElementById('password-form');
const passwordList = document.getElementById('password-list');
const addPasswordBtn = document.getElementById('add-password-btn');
const togglePasswordBtn = document.getElementById('toggle-password');
const generatePasswordBtn = document.getElementById('generate-password');
const passwordStrengthBar = document.getElementById('password-strength');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const modeLabel = document.getElementById('mode-label');
let passwords = {};

// Day/Night Mode Toggle with Emojis
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    modeLabel.textContent = darkModeToggle.checked ? '🌙' : '🌞';
});

// Add password
passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const service = document.getElementById('service').value.trim();
    const password = document.getElementById('password').value.trim();

    if (service && password) {
        addPassword(service, password);
    }
});

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        togglePasswordBtn.textContent = 'Show';
    }
});

// Password Generator Class
class PasswordGenerator {
    static generatePassword(type) {
        let length;
        switch (type) {
            case 'normal':
                length = 8;
                break;
            case 'strong':
                length = 12;
                break;
            case 'super-strong':
                length = 16;
                break;
            default:
                length = 12;
        }
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}

// Generate password function
generatePasswordBtn.addEventListener('click', () => {
    const strengthType = document.getElementById('strength-type').value;
    const newPassword = PasswordGenerator.generatePassword(strengthType);
    document.getElementById('password').value = newPassword; // Automatically populate the password input
    evaluatePasswordStrength(newPassword); // Update strength indicator
});

// Add password function
function addPassword(service, password) {
    passwords[service] = password;
    renderPasswordList();
    document.getElementById('service').value = '';
    document.getElementById('password').value = '';
    passwordStrengthBar.innerHTML = ''; // Reset strength bar
}

// Render password list
function renderPasswordList() {
    const passwordListHtml = Object.keys(passwords).map((service) => {
        return `<li>
      <span>${service}: ${'*'.repeat(passwords[service].length)}</span>
      <div>
        <button class="copy-btn" onclick="copyToClipboard('${passwords[service]}')">📋</button>
        <button class="delete-btn" onclick="deletePassword('${service}')">❌</button>
      </div>
    </li>`;
    }).join('');
    passwordList.innerHTML = `<ul>${passwordListHtml}</ul>`;
} 

// Copy password to clipboard
function copyToClipboard(password) {
    navigator.clipboard.writeText(password); // No alert, just copies to clipboard
}

// Delete password function
function deletePassword(service) {
    delete passwords[service];
    renderPasswordList();
}

// Password Strength Indicator
document.getElementById('password').addEventListener('input', (e) => {
    evaluatePasswordStrength(e.target.value);
});

function evaluatePasswordStrength(password) {
    const strength = password.length / 16; // Simple strength evaluation
    passwordStrengthBar.innerHTML = `<span style="width: ${Math.min(strength * 100, 100)}%;"></span>`;
}

renderPasswordList();
