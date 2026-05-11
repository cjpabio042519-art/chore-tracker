const loginFormDiv = document.getElementById('login-form');
const signupFormDiv = document.getElementById('signup-form');
const messageDiv = document.getElementById('message');

document.getElementById('show-signup').addEventListener('click', (e) => {
  e.preventDefault();
  loginFormDiv.style.display = 'none';
  signupFormDiv.style.display = 'block';
  messageDiv.style.display = 'none';
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  signupFormDiv.style.display = 'none';
  loginFormDiv.style.display = 'block';
  messageDiv.style.display = 'none';
});

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return showMessage('Please fill in all fields', 'error');
  try {
    const data = await api.login(email, password);
    api.setToken(data.token);
    showMessage('Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = '/dashboard.html', 1000);
  } catch (err) {
    showMessage(err.message, 'error');
  }
});

document.getElementById('signup-btn').addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  if (!email || !password) return showMessage('Please fill in all fields', 'error');
  if (password.length < 4) return showMessage('Password must be at least 4 characters', 'error');
  try {
    const data = await api.signup(email, password);
    api.setToken(data.token);
    showMessage('Account created! Redirecting...', 'success');
    setTimeout(() => window.location.href = '/dashboard.html', 1000);
  } catch (err) {
    showMessage(err.message, 'error');
  }
});

function showMessage(msg, type) {
  messageDiv.textContent = msg;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  setTimeout(() => messageDiv.style.display = 'none', 3000);
}

if (api.token) window.location.href = '/dashboard.html';
