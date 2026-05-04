const STORAGE_KEY = 'simple-todo-v1';

const $form = document.getElementById('form');
const $input = document.getElementById('input');
const $list = document.getElementById('list');
const $empty = document.getElementById('empty');
const $footer = document.getElementById('footer');
const $count = document.getElementById('count');
const $subtitle = document.getElementById('subtitle');

const days = ['日', '月', '火', '水', '木', '金', '土'];
const now = new Date();
$subtitle.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${days[now.getDay()]}）`;

let todos = [];
try {
  todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch {
  todos = [];
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  $list.innerHTML = '';

  if (todos.length === 0) {
    $empty.hidden = false;
    $footer.hidden = true;
    return;
  }

  $empty.hidden = true;
  $footer.hidden = false;

  for (const todo of todos) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if (todo.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', '完了');

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = todo.text;

    const del = document.createElement('button');
    del.className = 'delete';
    del.type = 'button';
    del.textContent = '×';
    del.setAttribute('aria-label', '削除');

    li.append(checkbox, text, del);
    $list.appendChild(li);
  }

  const remaining = todos.filter(t => !t.done).length;
  $count.textContent = `未完了 ${remaining} 件 / 全 ${todos.length} 件`;
}

$form.addEventListener('submit', e => {
  e.preventDefault();
  const text = $input.value.trim();
  if (!text) return;
  todos.unshift({ id: Date.now().toString(36), text, done: false });
  $input.value = '';
  save();
  render();
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

render();
