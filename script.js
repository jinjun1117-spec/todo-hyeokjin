const STORAGE_KEY = 'todos';

const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const filterButtons = document.querySelectorAll('#filters button');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const footer = document.getElementById('footer');
const count = document.getElementById('count');
const clearButton = document.getElementById('clear-done');

const EMPTY_TEXT = {
  all: '아직 할 일이 없어요',
  active: '진행 중인 할 일이 없어요',
  done: '완료한 할 일이 없어요',
};

let todos = load();
let filter = 'all';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    // 저장이 막힌 브라우저에서도 화면은 계속 동작한다
  }
}

function addTodo() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  todos.push({ id: Date.now() + Math.random(), text: text, done: false });
  input.value = '';
  input.focus();
  save();
  render();
}

function toggleTodo(id) {
  const todo = todos.find(function (t) { return t.id === id; });
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter(function (t) { return t.id !== id; });
  save();
  render();
}

function clearDone() {
  todos = todos.filter(function (t) { return !t.done; });
  save();
  render();
}

function makeItem(todo) {
  const li = document.createElement('li');
  if (todo.done) li.className = 'done';

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = todo.done;
  check.setAttribute('aria-label', '완료: ' + todo.text);
  check.addEventListener('change', function () { toggleTodo(todo.id); });

  const text = document.createElement('span');
  text.textContent = todo.text;

  const del = document.createElement('button');
  del.type = 'button';
  del.textContent = '삭제';
  del.setAttribute('aria-label', '삭제: ' + todo.text);
  del.addEventListener('click', function () { deleteTodo(todo.id); });

  li.append(check, text, del);
  return li;
}

function render() {
  const shown = todos.filter(function (t) {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  list.replaceChildren(...shown.map(makeItem));

  emptyMessage.textContent = EMPTY_TEXT[filter];
  emptyMessage.hidden = shown.length > 0;

  const remaining = todos.filter(function (t) { return !t.done; }).length;
  count.textContent = '남은 할 일 ' + remaining + '개';
  clearButton.disabled = remaining === todos.length;
  footer.hidden = todos.length === 0;

  filterButtons.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
  });
}

addButton.addEventListener('click', addTodo);
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.isComposing) addTodo();
});
filterButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    filter = b.dataset.filter;
    render();
  });
});
clearButton.addEventListener('click', clearDone);

render();
