// Estado actual: 'login' o 'register'
let currentMode = 'login';

function toggleAuthMode() {
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const registerExtraFields = document.getElementById('registerExtraFields');
    const loginOptions = document.getElementById('loginOptions');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleAuthBtn = document.getElementById('toggleAuthBtn');

    if (currentMode === 'login') {
        // Cambiar a Registro
        currentMode = 'register';
        formTitle.textContent = 'Crear cuenta';
        formSubtitle.textContent = 'Únete a nuestra comunidad y cuida de tus mascotas.';
        
        registerExtraFields.style.display = 'block';
        loginOptions.classList.add('d-none');
        
        submitBtn.querySelector('span').textContent = 'Registrarse';
        toggleText.textContent = '¿Ya tienes una cuenta?';
        toggleAuthBtn.textContent = 'Inicia sesión aquí →';
    } else {
        // Cambiar a Login
        currentMode = 'login';
        formTitle.textContent = 'Inicia sesión';
        formSubtitle.textContent = 'Para seguir cuidando a quienes te llenan de amor.';
        
        registerExtraFields.style.display = 'none';
        loginOptions.classList.remove('d-none');
        
        submitBtn.querySelector('span').textContent = 'Iniciar sesión';
        toggleText.textContent = '¿No tienes una cuenta?';
        toggleAuthBtn.textContent = 'Regístrate aquí →';
    }
}

// Mostrar / Ocultar Contraseña
function togglePassword() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleIcon = document.getElementById('togglePasswordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.replace('bi-eye-slash', 'bi-eye');
    }
}

// Redirección al Dashboard al enviar
function handleAuth(event) {
    event.preventDefault();
    // Te lleva directamente al panel de administración
    window.location.href = 'dashboard.html';
}