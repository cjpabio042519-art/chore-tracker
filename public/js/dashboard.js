if (!api.token) window.location.href = '/';

let allTasks = [];
const weekDaysContainer = document.getElementById('week-days');
const goalStatsSpan = document.getElementById('goal-stats');
const goalProgress = document.getElementById('goal-progress');
const todayTasksList = document.getElementById('today-tasks-list');
const logoutBtn = document.getElementById('logout-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModal = document.querySelector('.close-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
let editingTaskId = null;

function getCurrentWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  return { start: monday, end: sunday };
}

function getWeekdayIndex(dateStr) {
  const day = new Date(dateStr).getDay();
  return day === 0 ? 6 : day - 1;
}

function computeWeeklyStats() {
  const { start, end } = getCurrentWeekRange();
  const weekDays = ['M','T','W','T','F','S','S'];
  const counts = [0,0,0,0,0,0,0];
  let totalWeekTasks = 0, completedWeekTasks = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = [];

  allTasks.forEach(task => {
    if (!task.dueDate) return;
    const taskDate = new Date(task.dueDate);
    if (taskDate >= start && taskDate <= end) {
      const idx = getWeekdayIndex(task.dueDate);
      if (idx >= 0 && idx < 7) counts[idx]++;
      totalWeekTasks++;
      if (task.completed) completedWeekTasks++;
    }
    if (task.dueDate === todayStr) todaysTasks.push(task);
  });

  weekDaysContainer.innerHTML = weekDays.map((day,i) => `
    <div class="day-item"><div class="day-letter">${day}</div><div class="day-count">${counts[i]}</div></div>
  `).join('');
  goalStatsSpan.innerText = `${completedWeekTasks}/${totalWeekTasks} tasks completed`;
  const percent = totalWeekTasks === 0 ? 0 : (completedWeekTasks / totalWeekTasks) * 100;
  goalProgress.style.width = `${percent}%`;

  if (todaysTasks.length === 0) {
    todayTasksList.innerHTML = '<div class="empty-state">✨ No tasks for today. Add one!</div>';
  } else {
    todayTasksList.innerHTML = todaysTasks.map(task => `
      <div class="task-item" data-task-id="${task.id}">
        <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <div class="task-details"><div class="task-title">${escapeHtml(task.title)}</div><div class="task-time">⏱️ ${task.time || 'Anytime'}</div></div>
        <button class="task-delete" data-id="${task.id}"><i class="fas fa-trash-alt"></i></button>
      </div>
    `).join('');
    document.querySelectorAll('.task-check').forEach(cb => cb.addEventListener('change', async (e) => {
      const taskId = e.target.getAttribute('data-id');
      const completed = e.target.checked;
      try { await api.updateTask(taskId, { completed }); await loadTasks(); } catch (err) { alert('Failed to update'); loadTasks(); }
    }));
    document.querySelectorAll('.task-delete').forEach(btn => btn.addEventListener('click', async (e) => {
      const taskId = btn.getAttribute('data-id');
      if (confirm('Delete this task?')) { try { await api.deleteTask(taskId); await loadTasks(); } catch (err) { alert('Delete failed'); } }
    }));
  }
}

async function loadTasks() {
  try {
    allTasks = await api.getTasks();
    computeWeeklyStats();
  } catch (err) {
    if (err.message.includes('token')) { api.setToken(null); window.location.href = '/'; }
  }
}

function openAddModal() {
  editingTaskId = null;
  modalTitle.innerText = 'Add New Task';
  document.getElementById('task-title').value = '';
  document.getElementById('task-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('task-time').value = '';
  taskModal.style.display = 'flex';
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const dueDate = document.getElementById('task-date').value;
  const time = document.getElementById('task-time').value;
  if (!title || !dueDate) return alert('Title and date are required');
  try {
    if (editingTaskId) await api.updateTask(editingTaskId, { title, dueDate, time });
    else await api.createTask({ title, dueDate, time });
    taskModal.style.display = 'none';
    await loadTasks();
  } catch (err) { alert('Failed to save task: ' + err.message); }
});

addTaskBtn.addEventListener('click', openAddModal);
closeModal.addEventListener('click', () => taskModal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === taskModal) taskModal.style.display = 'none'; });
logoutBtn.addEventListener('click', () => { api.setToken(null); window.location.href = '/'; });

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

loadTasks();
