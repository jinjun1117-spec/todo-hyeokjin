const STORAGE_KEY = 'todos';
const THEME_KEY = 'theme';
const UNDO_MILLISECONDS = 5000;
const WEEKDAYS = '일월화수목금토';
// 같은 날짜는 언제나 같은 색이 되도록, 날짜 번호를 색 개수로 나눈 나머지로 고른다
const DATE_COLORS = ['#ffb3d1', '#c9b8ff', '#b8f0d8', '#ffe49a', '#a8d8ff', '#ffc9a8', '#d4f0a0', '#ffb3b3'];

function byId(id) {
  return document.getElementById(id);
}

const input = byId('todo-input');
const addButton = byId('add-button');
const dueInput = byId('due-input');
const importantToggle = byId('important-toggle');
const searchInput = byId('search-input');
const sortSelect = byId('sort-select');
const progress = byId('progress');
const progressText = byId('progress-text');
const progressFill = byId('progress-fill');
const filterButtons = document.querySelectorAll('#filters button');
const list = byId('todo-list');
const emptyMessage = byId('empty-message');
const footer = byId('footer');
const count = byId('count');
const clearButton = byId('clear-done');
const importantList = byId('important-list');
const importantEmpty = byId('important-empty');
const ddayList = byId('dday-list');
const ddayEmpty = byId('dday-empty');
const todayText = byId('today');
const themeButton = byId('theme-button');
const toast = byId('toast');
const toastText = byId('toast-text');
const undoButton = byId('undo-button');
const tabButtons = document.querySelectorAll('#tabbar button');
const panels = {
  todo: byId('tab-todo'),
  important: byId('tab-important'),
  dday: byId('tab-dday'),
};
const detail = byId('detail');
const detailTitle = byId('detail-title');
const detailMemo = byId('detail-memo');
const detailDue = byId('detail-due');
const detailImportant = byId('detail-important');
const detailDone = byId('detail-done');

const EMPTY_TEXT = {
  all: '아직 할 일이 없어요',
  active: '진행 중인 할 일이 없어요',
  done: '완료한 할 일이 없어요',
};

let todos = load();
let activeTab = 'todo';
let filter = 'all';
let query = '';
let sortBy = 'due';
let newImportant = false;
let removed = [];
let toastTimer = null;
let detailId = null;

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
          memo: typeof t.memo === 'string' ? t.memo : '',
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

/* 날짜: 마감일 글자('2026-10-29')를 보기 좋은 글과 색으로 바꾼다 */
function parseDue(due) {
  const parts = due.split('-').map(Number);
  return { year: parts[0], month: parts[1], day: parts[2] };
}

function dayDiff(due) {
  const p = parseDue(due);
  const now = new Date();
  const target = new Date(p.year, p.month - 1, p.day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

function dateText(due) {
  const p = parseDue(due);
  return p.month + '월 ' + p.day + '일 (' + WEEKDAYS[new Date(p.year, p.month - 1, p.day).getDay()] + ')';
}

function ddayText(due) {
  const diff = dayDiff(due);
  if (diff === 0) return 'D-DAY';
  return diff > 0 ? 'D-' + diff : 'D+' + Math.abs(diff);
}

function dateColor(due) {
  const p = parseDue(due);
  const dayNumber = Math.floor(Date.UTC(p.year, p.month - 1, p.day) / 86400000);
  return DATE_COLORS[dayNumber % DATE_COLORS.length];
}

function compareByDue(a, b) {
  if (!a.due && !b.due) return 0;
  if (!a.due) return 1;
  if (!b.due) return -1;
  return a.due < b.due ? -1 : a.due > b.due ? 1 : 0;
}

/* 할 일 바꾸기 */
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
    memo: '',
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

/* 지운 할 일은 원래 자리(순서)와 함께 기억해 둔다 */
function removeTodos(shouldRemove, message) {
  removed = [];
  todos.forEach(function (t, index) {
    if (shouldRemove(t)) removed.push({ todo: t, index: index });
  });
  todos = todos.filter(function (t) { return !shouldRemove(t); });
  save();
  render();
  showToast(message);
}

function deleteTodo(id) {
  removeTodos(function (t) { return t.id === id; }, '삭제했어요');
}

function clearDone() {
  const doneCount = todos.filter(function (t) { return t.done; }).length;
  removeTodos(function (t) { return t.done; }, doneCount + '개 지웠어요');
}

function undoRemove() {
  removed.forEach(function (r) {
    todos.splice(Math.min(r.index, todos.length), 0, r.todo);
  });
  removed = [];
  hideToast();
  save();
  render();
}

function showToast(message) {
  toastText.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, UNDO_MILLISECONDS);
}

function hideToast() {
  clearTimeout(toastTimer);
  toast.hidden = true;
  removed = [];
}

/* 상세 창 */
function setDetailToggle(button, on, onText, offText) {
  button.setAttribute('aria-pressed', String(on));
  button.textContent = on ? onText : offText;
}

function setDetailImportant(on) {
  setDetailToggle(detailImportant, on, '★ 중요', '☆ 중요');
}

function setDetailDone(on) {
  setDetailToggle(detailDone, on, '☑ 완료', '☐ 완료');
}

function openDetail(id) {
  const todo = findTodo(id);
  if (!todo) return;
  detailId = id;
  detailTitle.value = todo.text;
  detailMemo.value = todo.memo;
  detailDue.value = todo.due;
  setDetailImportant(todo.important);
  setDetailDone(todo.done);
  detail.showModal();
}

function saveDetail() {
  const todo = findTodo(detailId);
  const title = detailTitle.value.trim();
  if (!todo) {
    detail.close();
    return;
  }
  if (!title) {
    detailTitle.focus();
    return;
  }
  todo.text = title;
  todo.memo = detailMemo.value.trim();
  todo.due = detailDue.value;
  todo.important = detailImportant.getAttribute('aria-pressed') === 'true';
  todo.done = detailDone.getAttribute('aria-pressed') === 'true';
  detail.close();
  save();
  render();
}

function deleteFromDetail() {
  const id = detailId;
  detail.close();
  deleteTodo(id);
}

/* 화면 그리기 */
function makeButton(label, className, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function makeDueBadge(todo) {
  const due = document.createElement('span');
  due.className = 'due' + (dayDiff(todo.due) < 0 && !todo.done ? ' late' : '');
  due.textContent = dateText(todo.due) + ' · ' + ddayText(todo.due);
  return due;
}

function makeItem(todo) {
  const li = document.createElement('li');
  if (todo.done) li.classList.add('done');
  if (todo.due) li.style.setProperty('--date-color', dateColor(todo.due));

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = todo.done;
  check.setAttribute('aria-label', '완료: ' + todo.text);
  check.addEventListener('change', function () { toggleDone(todo.id); });

  const main = makeButton('', 'main', function () { openDetail(todo.id); });
  main.setAttribute('aria-label', '상세 보기: ' + todo.text);
  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = todo.text;
  main.append(text);
  if (todo.memo) {
    const memo = document.createElement('span');
    memo.className = 'memo';
    memo.textContent = todo.memo.split('\n')[0];
    main.append(memo);
  }
  if (todo.due) main.append(makeDueBadge(todo));

  const star = makeButton(todo.important ? '★' : '☆', 'star', function () { toggleImportant(todo.id); });
  star.setAttribute('aria-pressed', String(todo.important));
  star.setAttribute('aria-label', '중요: ' + todo.text);

  const del = makeButton('삭제', 'delete', function () { deleteTodo(todo.id); });
  del.setAttribute('aria-label', '삭제: ' + todo.text);

  li.append(check, main, star, del);
  return li;
}

function makeDdayCard(todo) {
  const card = makeButton('', 'dday-card', function () { openDetail(todo.id); });
  card.style.setProperty('--date-color', dateColor(todo.due));
  if (dayDiff(todo.due) < 0) card.classList.add('late');
  card.setAttribute('aria-label', '상세 보기: ' + todo.text);

  const big = document.createElement('span');
  big.className = 'big';
  big.textContent = ddayText(todo.due);

  const info = document.createElement('span');
  info.className = 'info';
  const title = document.createElement('span');
  title.className = 'title';
  title.textContent = todo.text;
  const date = document.createElement('span');
  date.className = 'date';
  date.textContent = dateText(todo.due);
  info.append(title, date);

  card.append(big, info);
  return card;
}

function sortTodos(items) {
  const sorted = items.slice();
  if (sortBy === 'due') {
    sorted.sort(compareByDue);
  } else if (sortBy === 'important') {
    sorted.sort(function (a, b) { return Number(b.important) - Number(a.important); });
  }
  return sorted;
}

function renderTodoTab() {
  const word = query.trim().toLowerCase();
  const shown = sortTodos(todos.filter(function (t) {
    if (filter === 'active' && t.done) return false;
    if (filter === 'done' && !t.done) return false;
    return !word || t.text.toLowerCase().includes(word);
  }));

  list.replaceChildren(...shown.map(makeItem));

  emptyMessage.textContent = word && todos.length > 0 ? '검색 결과가 없어요' : EMPTY_TEXT[filter];
  emptyMessage.hidden = shown.length > 0;

  const remaining = todos.filter(function (t) { return !t.done; }).length;
  const finished = todos.length - remaining;
  progress.hidden = todos.length === 0;
  progressText.textContent = todos.length > 0 && remaining === 0
    ? '모두 끝냈어요! 🎉'
    : finished + ' / ' + todos.length + ' 완료';
  progressFill.style.width = (todos.length ? Math.round(finished / todos.length * 100) : 0) + '%';

  count.textContent = '남은 할 일 ' + remaining + '개';
  clearButton.disabled = remaining === todos.length;
  footer.hidden = todos.length === 0;

  filterButtons.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
  });
}

function renderImportantTab() {
  const items = todos.filter(function (t) { return t.important; }).sort(compareByDue);
  importantList.replaceChildren(...items.map(makeItem));
  importantEmpty.hidden = items.length > 0;
}

function renderDdayTab() {
  const items = todos.filter(function (t) { return t.due && !t.done; }).sort(compareByDue);
  ddayList.replaceChildren(...items.map(makeDdayCard));
  ddayEmpty.hidden = items.length > 0;
}

function render() {
  renderTodoTab();
  renderImportantTab();
  renderDdayTab();

  Object.keys(panels).forEach(function (name) {
    panels[name].hidden = name !== activeTab;
  });
  tabButtons.forEach(function (b) {
    b.setAttribute('aria-selected', String(b.dataset.tab === activeTab));
  });
}

function switchTab(name) {
  activeTab = name;
  render();
}

/* 다크 모드: 저장된 선택이 없으면 기기 설정을 따른다 */
function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {
    // 읽기가 막혀도 기기 설정으로 넘어간다
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.textContent = dark ? '☀️' : '🌙';
  themeButton.setAttribute('aria-label', dark ? '밝은 모드로 바꾸기' : '다크 모드로 바꾸기');
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {
    // 저장이 막혀도 이번 화면에서는 바뀐다
  }
}

/* 버튼과 칸에 동작 달기 */
undoButton.addEventListener('click', undoRemove);
themeButton.addEventListener('click', toggleTheme);
addButton.addEventListener('click', addTodo);
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.isComposing) addTodo();
});
importantToggle.addEventListener('click', function () { setNewImportant(!newImportant); });
searchInput.addEventListener('input', function () {
  query = searchInput.value;
  render();
});
sortSelect.addEventListener('change', function () {
  sortBy = sortSelect.value;
  render();
});
filterButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    filter = b.dataset.filter;
    render();
  });
});
clearButton.addEventListener('click', clearDone);
tabButtons.forEach(function (b) {
  b.addEventListener('click', function () { switchTab(b.dataset.tab); });
});

detailImportant.addEventListener('click', function () {
  setDetailImportant(detailImportant.getAttribute('aria-pressed') !== 'true');
});
detailDone.addEventListener('click', function () {
  setDetailDone(detailDone.getAttribute('aria-pressed') !== 'true');
});
byId('detail-clear-due').addEventListener('click', function () { detailDue.value = ''; });
byId('detail-save').addEventListener('click', saveDetail);
byId('detail-cancel').addEventListener('click', function () { detail.close(); });
byId('detail-delete').addEventListener('click', deleteFromDetail);
detailTitle.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.isComposing) saveDetail();
});
detail.addEventListener('click', function (e) {
  if (e.target === detail) detail.close();
});
detail.addEventListener('close', function () { detailId = null; });

todayText.textContent = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
applyTheme(readTheme());
render();
