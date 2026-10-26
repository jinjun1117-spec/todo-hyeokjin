const STORAGE_KEY = 'todos';

const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const dueInput = document.getElementById('due-input');
const importantToggle = document.getElementById('important-toggle');
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
let newImportant = false;
let editingId = null;

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(function (t) { return t && typeof t.text === 'string'; })
      .map(function (t) {
        return {
          id: t.id,
          text: t.text,
          done: !!t.done,
          important: !!t.important,
          due: typeof t.due === 'string' ? t.due : '',
        };
      });
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

function findTodo(id) {
  return todos.find(function (t) { return t.id === id; });
}

/* 마감일: 오늘과 며칠 차이인지 계산해서 짧은 글로 바꾼다 */
function dayDiff(due) {
  const parts = due.split('-').map(Number);
  const now = new Date();
  const target = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

function dueLabel(due) {
  const diff = dayDiff(due);
  if (diff === 0) return { text: '오늘', cls: 'today' };
  if (diff === 1) return { text: '내일', cls: 'soon' };
  if (diff < 0) return { text: Math.abs(diff) + '일 지남', cls: 'late' };
  const parts = due.split('-').map(Number);
  return { text: parts[1] + '월 ' + parts[2] + '일', cls: '' };
}

function addTodo() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  todos.push({
    id: Date.now() + Math.random(),
    text: text,
    done: false,
    important: newImportant,
    due: dueInput.value,
  });
  input.value = '';
  dueInput.value = '';
  setNewImportant(false);
  input.focus();
  save();
  render();
}

function setNewImportant(on) {
  newImportant = on;
  importantToggle.setAttribute('aria-pressed', String(on));
  importantToggle.textContent = (on ? '★' : '☆') + ' 중요';
}

function toggleDone(id) {
  const todo = findTodo(id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function toggleImportant(id) {
  const todo = findTodo(id);
  if (todo) {
    todo.important = !todo.important;
    save();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter(function (t) { return t.id !== id; });
  if (editingId === id) editingId = null;
  save();
  render();
}

function clearDone() {
  todos = todos.filter(function (t) { return !t.done; });
  save();
  render();
}

function startEdit(id) {
  editingId = id;
  render();
}

function cancelEdit() {
  editingId = null;
  render();
}

function saveEdit(id, text, due) {
  const trimmed = text.trim();
  const todo = findTodo(id);
  if (!todo) return;
  if (!trimmed) {
    list.querySelector('li.editing input[type="text"]').focus();
    return;
  }
  todo.text = trimmed;
  todo.due = due;
  editingId = null;
  save();
  render();
}

function makeButton(label, className, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function makeItem(todo) {
  const li = document.createElement('li');
  if (todo.done) li.classList.add('done');
  if (todo.important) li.classList.add('important');

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = todo.done;
  check.setAttribute('aria-label', '완료: ' + todo.text);
  check.addEventListener('change', function () { toggleDone(todo.id); });

  const main = document.createElement('div');
  main.className = 'main';
  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = todo.text;
  main.append(text);
  if (todo.due) {
    const info = dueLabel(todo.due);
    const due = document.createElement('span');
    due.className = 'due' + (info.cls && !todo.done ? ' ' + info.cls : '');
    due.textContent = info.text;
    main.append(due);
  }

  const star = makeButton(todo.important ? '★' : '☆', 'star', function () { toggleImportant(todo.id); });
  star.setAttribute('aria-pressed', String(todo.important));
  star.setAttribute('aria-label', '중요: ' + todo.text);

  const edit = makeButton('수정', 'edit', function () { startEdit(todo.id); });
  edit.setAttribute('aria-label', '수정: ' + todo.text);
  const del = makeButton('삭제', 'delete', function () { deleteTodo(todo.id); });
  del.setAttribute('aria-label', '삭제: ' + todo.text);

  li.append(check, main, star, edit, del);
  return li;
}

function makeEditItem(todo) {
  const li = document.createElement('li');
  li.className = 'editing';

  const textField = document.createElement('input');
  textField.type = 'text';
  textField.value = todo.text;
  textField.maxLength = 100;
  textField.setAttribute('aria-label', '할 일 글');

  const dueField = document.createElement('input');
  dueField.type = 'date';
  dueField.value = todo.due;
  dueField.setAttribute('aria-label', '마감일');

  function submit() { saveEdit(todo.id, textField.value, dueField.value); }
  function onKey(e) {
    if (e.key === 'Enter' && !e.isComposing) submit();
    if (e.key === 'Escape') cancelEdit();
  }
  textField.addEventListener('keydown', onKey);
  dueField.addEventListener('keydown', onKey);

  const fields = document.createElement('div');
  fields.className = 'edit-row';
  fields.append(textField);
  const dates = document.createElement('div');
  dates.className = 'edit-row';
  dates.append(dueField);
  const buttons = document.createElement('div');
  buttons.className = 'edit-row';
  buttons.append(makeButton('저장', 'save', submit), makeButton('취소', 'cancel', cancelEdit));
  dates.append(buttons);

  li.append(fields, dates);
  return li;
}

function render() {
  const shown = todos.filter(function (t) {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  list.replaceChildren(...shown.map(function (t) {
    return t.id === editingId ? makeEditItem(t) : makeItem(t);
  }));

  const editField = list.querySelector('li.editing input[type="text"]');
  if (editField) {
    editField.focus();
    editField.setSelectionRange(editField.value.length, editField.value.length);
  }

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
importantToggle.addEventListener('click', function () { setNewImportant(!newImportant); });
filterButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    filter = b.dataset.filter;
    render();
  });
});
clearButton.addEventListener('click', clearDone);

render();
