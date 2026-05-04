const STORAGE_KEY = 'simple-todo-v2';

const $form = document.getElementById('form');
const $input = document.getElementById('input');
const $priority = document.getElementById('priority');
const $list = document.getElementById('list');
const $empty = document.getElementById('empty');
const $footer = document.getElementById('footer');
const $count = document.getElementById('count');
const $subtitle = document.getElementById('subtitle');
const $clearDone = document.getElementById('clear-done');
const $stats = document.getElementById('stats');
const $statTotal = document.getElementById('stat-total');
const $statActive = document.getElementById('stat-active');
const $statDone = document.getElementById('stat-done');

const PRIORITY_LABEL = { high: '高', medium: '中', low: '低' };
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const days = ['日', '月', '火', '水', '木', '金', '土'];
const now = new Date();
$subtitle.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${days[now.getDay()]}）`;

let todos = [];
let filter = 'all';

try {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  todos = raw.map(t => ({
    id: t.id,
    text: t.text,
    done: !!t.done,
    priority: ['high', 'medium', 'low'].includes(t.priority) ? t.priority : 'medium',
    createdAt: t.createdAt || Date.now(),
  }));
} catch {
  todos = [];
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function sortedTodos() {
  return [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    return b.createdAt - a.createdAt;
  });
}

function updateFooter(active, total) {
  $count.textContent = `未完了 ${active} / 全 ${total} 件`;
  const hasDone = todos.some(t => t.done);
  $clearDone.style.visibility = hasDone ? 'visible' : 'hidden';
}

function render() {
  $list.innerHTML = '';

  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  const activeCount = total - doneCount;

  $statTotal.textContent = total;
  $statActive.textContent = activeCount;
  $statDone.textContent = doneCount;
  $stats.hidden = total === 0;

  const visible = sortedTodos().filter(t => filter === 'all' || t.priority === filter);

  if (visible.length === 0) {
    $empty.hidden = false;
    $empty.textContent = total === 0
      ? 'タスクはまだありません'
      : `「${PRIORITY_LABEL[filter] || ''}」のタスクはありません`;
    $footer.hidden = total === 0;
    if (total > 0) updateFooter(activeCount, total);
    return;
  }

  $empty.hidden = true;
  $footer.hidden = false;
  updateFooter(activeCount, total);

  for (const todo of visible) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.dataset.priority = todo.priority;
    if (todo.done) li.classList.add('done');

    const bar = document.createElement('span');
    bar.className = 'priority-bar';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', '完了');

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = todo.text;

    const badge = document.createElement('span');
    badge.className = `priority-badge ${todo.priority}`;
    badge.textContent = PRIORITY_LABEL[todo.priority];

    const del = document.createElement('button');
    del.className = 'delete';
    del.type = 'button';
    del.textContent = '×';
    del.setAttribute('aria-label', '削除');

    li.append(bar, checkbox, text, badge, del);
    $list.appendChild(li);
  }
}

$form.addEventListener('submit', e => {
  e.preventDefault();
  const text = $input.value.trim();
  if (!text) return;
  todos.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text,
    done: false,
    priority: $priority.value,
    createdAt: Date.now(),
  });
  $input.value = '';
  $priority.value = 'medium';
  save();
  render();
  $input.focus();
});

$list.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.matches('.checkbox')) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.done = e.target.checked;
      save();
      render();
    }
  } else if (e.target.matches('.delete')) {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  }
});

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

$clearDone.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

render();
