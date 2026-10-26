const STORAGE_KEY = 'todos';
const THEME_KEY = 'theme';
const UNDO_MILLISECONDS = 5000;
const WEEKDAYS = '일월화수목금토';
// 같은 날짜는 언제나 같은 색이 되도록, 날짜 번호를 색 개수로 나눈 나머지로 고른다
const DATE_COLORS = ['#ffb3d1', '#c9b8ff', '#b8f0d8', '#ffe49a', '#a8d8ff', '#ffc9a8', '#d4f0a0', '#ffb3b3'];

function byId(id) {
  return document.getElementById(id);
}

const pageTitle = byId('page-title');
const dayText = byId('day-text');
const dayDday = byId('day-dday');
const input = byId('todo-input');
const addButton = byId('add-button');
const progress = byId('progress');
const progressText = byId('progress-text');
const progressFill = byId('progress-fill');
const filterButtons = document.querySelectorAll('#filters button');
const list = byId('todo-list');
const emptyMessage = byId('empty-message');
const footer = byId('footer');
const count = byId('count');
const clearButton = byId('clear-done');
const calTitle = byId('cal-title');
const calGrid = byId('cal-grid');
const popup = byId('day-popup');
const popupTitle = byId('popup-title');
const popupList = byId('popup-list');
const popupEmpty = byId('popup-empty');
const popupOpen = byId('popup-open');
const searchInput = byId('search-input');
const rangeButtons = document.querySelectorAll('#range button');
const sampleButton = byId('sample-button');
const daysList = byId('days-list');
const daysEmpty = byId('days-empty');
const todayText = byId('today');
const themeButton = byId('theme-button');
const toast = byId('toast');
const toastText = byId('toast-text');
const undoButton = byId('undo-button');
const tabButtons = document.querySelectorAll('#tabbar button');
const panels = {
  todo: byId('tab-todo'),
  calendar: byId('tab-calendar'),
  days: byId('tab-days'),
};
const detail = byId('detail');
const detailTitle = byId('detail-title');
const detailMemo = byId('detail-memo');
const detailImportant = byId('detail-important');
const detailDone = byId('detail-done');
const detailPicker = byId('detail-picker');
const pickerTitle = byId('picker-title');
const pickerGrid = byId('picker-grid');
const detailPick = byId('detail-pick');

const TAB_TITLES = {
  todo: '할 일 목록',
  calendar: '캘린더',
  days: '날짜별 목록',
};
const POPUP_ITEMS = 5;

// 테스트 할 일: [오늘에서 며칠 뒤인지, 제목, 중요, 완료, 메모]. 5개짜리 날이 두 번(오늘, +2일) 있다
const SAMPLE_TODOS = [
  [0, '우유·계란 사기', false, false, ''],
  [0, '영어 단어 30개 외우기', false, false, ''],
  [0, '운동 30분', false, true, ''],
  [0, '보고서 초안 쓰기', true, false, '목차부터 정리하기\n3쪽 안으로'],
  [0, '엄마한테 전화하기', false, false, ''],
  [2, '치과 예약 확인', false, false, ''],
  [2, '도서관 책 반납', false, false, ''],
  [2, '팀 회의 자료 준비', true, false, '3시 회의실 B'],
  [2, '세탁소 다녀오기', false, false, ''],
  [2, '친구 생일 선물 사기', false, false, '예산 3만 원'],
  [-3, '월세 이체하기', true, true, ''],
  [-1, '분리수거 하기', false, true, ''],
  [-1, '이메일 답장하기', false, true, ''],
  [1, '병원 진료 가기', false, false, ''],
  [3, '장보기 목록 쓰기', false, false, ''],
  [3, '책 20쪽 읽기', false, false, ''],
  [4, '자전거 수리 맡기기', false, false, ''],
  [6, '여행 짐 싸기', false, false, ''],
  [8, '보험료 납부', true, false, ''],
  [10, '프로젝트 마감 확인', false, false, ''],
];

const EMPTY_TEXT = {
  all: '이 날 할 일이 없어요',
  important: '중요한 할 일이 없어요',
  active: '진행 중인 할 일이 없어요',
  done: '완료한 할 일이 없어요',
};

let todos = load();
let activeTab = 'todo';
let viewDate = todayString();
let filter = 'all';
let query = '';
let range = 'upcoming';
let undoAction = null;
let toastTimer = null;
let detailId = null;
let pickerYear = 0;
let pickerMonth = 0;
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = todayString();
let popupDate = null;

/* 날짜: 날짜 글자('2026-10-29')를 보기 좋은 글과 색으로 바꾼다 */
function todayString() {
  const now = new Date();
  return dueString(now.getFullYear(), now.getMonth(), now.getDate());
}

// month는 0부터 시작(0 = 1월)
function dueString(year, month, day) {
  return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}

function parseDue(due) {
  const parts = due.split('-').map(Number);
  return { year: parts[0], month: parts[1], day: parts[2] };
}

function addDays(due, step) {
  const p = parseDue(due);
  const moved = new Date(p.year, p.month - 1, p.day + step);
  return dueString(moved.getFullYear(), moved.getMonth(), moved.getDate());
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

// 보이는 순서: 중요한 진행 중(0) → 나머지 진행 중(1) → 중요한 완료(2) → 나머지 완료(3)
function bucketOf(todo) {
  return (todo.done ? 2 : 0) + (todo.important ? 0 : 1);
}

// 같은 무리 안에서는 배열(내가 정한) 순서를 지킨다
function orderTodos(items) {
  return [0, 1, 2, 3].reduce(function (all, bucket) {
    return all.concat(items.filter(function (t) { return bucketOf(t) === bucket; }));
  }, []);
}

/* 저장하고 불러오기 */
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    let moved = false;
    const loaded = saved
      .filter(function (t) { return t && typeof t.text === 'string'; })
      .map(function (t) {
        const hasDate = typeof t.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.due);
        if (!hasDate) moved = true;
        return {
          id: t.id,
          text: t.text,
          done: !!t.done,
          important: !!t.important,
          // 날짜가 없던 예전 할 일은 오늘 날짜로 넣는다
          due: hasDate ? t.due : todayString(),
          memo: typeof t.memo === 'string' ? t.memo : '',
          sample: !!t.sample,
        };
      });
    if (moved) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
      } catch (e) {
        // 저장이 막혀도 이번 화면에서는 오늘 날짜로 보인다
      }
    }
    return loaded;
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
    important: false,
    due: viewDate,
    memo: '',
  });
  input.value = '';
  input.focus();
  save();
  render();
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

/* 테스트 할 일: 넣은 것에는 sample 표시를 해 두어서, 내가 만든 할 일과 섞이지 않게 지울 수 있다 */
function hasSamples() {
  return todos.some(function (t) { return t.sample; });
}

function addSamples() {
  const today = todayString();
  SAMPLE_TODOS.forEach(function (row, i) {
    todos.push({
      id: Date.now() + i + Math.random(),
      text: row[1],
      done: row[3],
      important: row[2],
      due: addDays(today, row[0]),
      memo: row[4],
      sample: true,
    });
  });
  save();
  render();
}

function toggleSamples() {
  if (hasSamples()) {
    const count = todos.filter(function (t) { return t.sample; }).length;
    removeTodos(function (t) { return t.sample; }, '테스트 할 일 ' + count + '개 지웠어요');
  } else {
    addSamples();
  }
}

/* 지운 할 일은 원래 자리(순서)와 함께 기억해 둔다 */
function removeTodos(shouldRemove, message) {
  const removed = [];
  todos.forEach(function (t, index) {
    if (shouldRemove(t)) removed.push({ todo: t, index: index });
  });
  todos = todos.filter(function (t) { return !shouldRemove(t); });
  save();
  render();
  showToast(message, function () {
    removed.forEach(function (r) {
      todos.splice(Math.min(r.index, todos.length), 0, r.todo);
    });
  });
}

function deleteTodo(id) {
  removeTodos(function (t) { return t.id === id; }, '삭제했어요');
}

function clearDone() {
  const day = viewDate;
  const doneCount = todos.filter(function (t) { return t.due === day && t.done; }).length;
  removeTodos(function (t) { return t.due === day && t.done; }, doneCount + '개 지웠어요');
}

function undo() {
  const action = undoAction;
  hideToast();
  if (action) action();
  save();
  render();
}

function showToast(message, undoWith) {
  undoAction = undoWith;
  toastText.textContent = message;
  (popup.open ? popup : document.body).append(toast);
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, UNDO_MILLISECONDS);
}

function hideToast() {
  clearTimeout(toastTimer);
  toast.hidden = true;
  undoAction = null;
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
  setDetailImportant(todo.important);
  setDetailDone(todo.done);
  setPicker(false);
  detail.showModal();
}

// 창에서 고친 값을 할 일에 옮긴다. 제목이 비어 있으면 옮기지 않고 false를 돌려준다
function applyDetail(todo) {
  const title = detailTitle.value.trim();
  if (!title) {
    detailTitle.focus();
    return false;
  }
  todo.text = title;
  todo.memo = detailMemo.value.trim();
  todo.important = detailImportant.getAttribute('aria-pressed') === 'true';
  todo.done = detailDone.getAttribute('aria-pressed') === 'true';
  return true;
}

function saveDetail() {
  const todo = findTodo(detailId);
  if (!todo) {
    detail.close();
    return;
  }
  if (!applyDetail(todo)) return;
  detail.close();
  save();
  render();
}

// 날짜 옮기기: 고친 값을 저장하고, 할 일의 날짜를 바꾼 뒤 창을 닫는다. 되돌리기도 걸어 둔다
function moveDetailTo(target, label) {
  const todo = findTodo(detailId);
  if (!todo) {
    detail.close();
    return;
  }
  if (!applyDetail(todo)) return;
  const oldDue = todo.due;
  todo.due = target;
  detail.close();
  save();
  render();
  showToast(label + ': ' + dateText(todo.due), function () { todo.due = oldDue; });
}

// 내일로 미루기: 오늘과 그 할 일 날짜 중 더 뒤인 날의 다음 날로 보낸다
function postponeToTomorrow() {
  const todo = findTodo(detailId);
  if (!todo) return;
  const today = todayString();
  moveDetailTo(addDays(todo.due > today ? todo.due : today, 1), '미뤘어요');
}

/* 날짜로 미루기: 창 안에 펼쳐지는 작은 달력 */
function setPicker(open) {
  detailPicker.hidden = !open;
  detailPick.setAttribute('aria-expanded', String(open));
  if (open) {
    const todo = findTodo(detailId);
    const p = parseDue(todo ? todo.due : todayString());
    pickerYear = p.year;
    pickerMonth = p.month - 1;
    renderPicker();
  }
}

function renderPicker() {
  const todo = findTodo(detailId);
  const current = todo ? todo.due : '';
  pickerTitle.textContent = pickerYear + '년 ' + (pickerMonth + 1) + '월';

  const cells = [];
  WEEKDAYS.split('').forEach(function (name, i) {
    const label = document.createElement('span');
    label.className = 'weekday' + (i === 0 ? ' sun' : '');
    label.textContent = name;
    cells.push(label);
  });
  const firstWeekday = new Date(pickerYear, pickerMonth, 1).getDay();
  const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  for (let i = 0; i < firstWeekday; i++) cells.push(document.createElement('span'));
  const today = todayString();
  for (let day = 1; day <= daysInMonth; day++) {
    const due = dueString(pickerYear, pickerMonth, day);
    const cell = makeButton(String(day), 'pick-day', function () { pickDate(due); });
    if ((firstWeekday + day - 1) % 7 === 0) cell.classList.add('sun');
    if (due === today) cell.classList.add('today');
    if (due === current) cell.classList.add('current');
    cell.dataset.date = due;
    cell.setAttribute('aria-label', dateText(due) + '로 옮기기');
    cells.push(cell);
  }
  pickerGrid.replaceChildren(...cells);
}

function pickDate(due) {
  const todo = findTodo(detailId);
  if (todo && todo.due === due) {
    setPicker(false);
    return;
  }
  moveDetailTo(due, '옮겼어요');
}

function movePicker(step) {
  const moved = new Date(pickerYear, pickerMonth + step, 1);
  pickerYear = moved.getFullYear();
  pickerMonth = moved.getMonth();
  renderPicker();
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

/* 끌어서 순서 바꾸기(할 일 탭 목록만): 손잡이를 잡고 끌거나, 손잡이에서 ↑ ↓ 키를 누른다.
   같은 무리(보이는 순서의 ①~④)끼리만 자리를 바꿀 수 있다. */
function samePart(a, b) {
  return a.dataset.bucket === b.dataset.bucket;
}

// 화면에 보이는 순서(li 차례)를 할 일 배열 순서에 반영한다
function commitOrder(li) {
  const todo = todos.find(function (t) { return String(t.id) === li.dataset.id; });
  if (!todo) return;
  const next = li.nextElementSibling;
  const prev = li.previousElementSibling;
  const neighbor = next || prev;
  const other = neighbor && todos.find(function (t) { return String(t.id) === neighbor.dataset.id; });
  if (!other || other === todo) return;
  todos.splice(todos.indexOf(todo), 1);
  const at = todos.indexOf(other);
  todos.splice(next ? at : at + 1, 0, todo);
  save();
  render();
}

function focusHandle(id) {
  const li = document.querySelector('section:not([hidden]) li[data-id="' + id + '"], dialog[open] li[data-id="' + id + '"]');
  if (li) li.querySelector('.handle').focus();
}

function enableDrag(ul) {
  ul.addEventListener('pointerdown', function (e) {
    const handle = e.target.closest('.handle');
    const li = handle && handle.closest('li');
    if (!li || li.parentNode !== ul) return;
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    li.classList.add('dragging');

    // 끄는 동안 줄 순서는 그대로 두고, 끄는 줄만 손가락을 따라 움직인다(자리 표시는 분홍 줄)
    const startY = e.pageY;
    let dropRow = null;
    let dropBefore = true;

    function clearMark() {
      if (dropRow) dropRow.classList.remove('drop-before', 'drop-after');
    }
    function onMove(ev) {
      if (ev.clientY < 80) window.scrollBy(0, -12);
      if (ev.clientY > window.innerHeight - 140) window.scrollBy(0, 12);
      li.style.transform = 'translateY(' + (ev.pageY - startY) + 'px)';
      const rows = Array.from(ul.children).filter(function (row) {
        return row !== li && samePart(row, li);
      });
      for (const row of rows) {
        const box = row.getBoundingClientRect();
        if (ev.clientY >= box.top && ev.clientY <= box.bottom) {
          clearMark();
          dropRow = row;
          dropBefore = ev.clientY < box.top + box.height / 2;
          row.classList.add(dropBefore ? 'drop-before' : 'drop-after');
          break;
        }
      }
    }
    function onEnd() {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onEnd);
      handle.removeEventListener('pointercancel', onEnd);
      clearMark();
      li.classList.remove('dragging');
      li.style.transform = '';
      if (dropRow) {
        ul.insertBefore(li, dropBefore ? dropRow : dropRow.nextSibling);
        commitOrder(li);
      }
    }
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onEnd);
    handle.addEventListener('pointercancel', onEnd);
  });

  ul.addEventListener('keydown', function (e) {
    const handle = e.target.closest('.handle');
    if (!handle || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    const li = handle.closest('li');
    const step = e.key === 'ArrowUp' ? 'previousElementSibling' : 'nextElementSibling';
    const target = li[step];
    if (!target || !samePart(target, li)) return;
    ul.insertBefore(li, e.key === 'ArrowUp' ? target : target.nextSibling);
    const id = li.dataset.id;
    commitOrder(li);
    focusHandle(id);
  });
}

// 한 줄에는 날짜·디데이를 보여 주지 않는다. 날짜는 왼쪽 띠 색으로만 나타낸다
function makeItem(todo, sortable) {
  const li = document.createElement('li');
  if (todo.done) li.classList.add('done');
  li.style.setProperty('--date-color', dateColor(todo.due));
  li.dataset.id = String(todo.id);
  li.dataset.bucket = String(bucketOf(todo));

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

  const star = makeButton(todo.important ? '★' : '☆', 'star', function () { toggleImportant(todo.id); });
  star.setAttribute('aria-pressed', String(todo.important));
  star.setAttribute('aria-label', '중요: ' + todo.text);

  const del = makeButton('삭제', 'delete', function () { deleteTodo(todo.id); });
  del.setAttribute('aria-label', '삭제: ' + todo.text);

  if (sortable) {
    const grip = makeButton('≡', 'handle', function () {});
    grip.setAttribute('aria-label', '순서 바꾸기: ' + todo.text);
    li.append(grip);
  }
  li.append(check, main, star, del);
  return li;
}

function renderTodoTab() {
  dayText.textContent = dateText(viewDate);
  dayDday.textContent = ddayText(viewDate);
  dayDday.style.setProperty('--date-color', dateColor(viewDate));

  const dayItems = todos.filter(function (t) { return t.due === viewDate; });
  const shown = orderTodos(dayItems).filter(function (t) {
    if (filter === 'important') return t.important;
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  list.replaceChildren(...shown.map(function (t) { return makeItem(t, true); }));

  emptyMessage.textContent = dayItems.length === 0 ? EMPTY_TEXT.all : EMPTY_TEXT[filter];
  emptyMessage.hidden = shown.length > 0;

  const remaining = dayItems.filter(function (t) { return !t.done; }).length;
  const finished = dayItems.length - remaining;
  progress.hidden = dayItems.length === 0;
  progressText.textContent = dayItems.length > 0 && remaining === 0
    ? '모두 끝냈어요! 🎉'
    : finished + ' / ' + dayItems.length + ' 완료';
  progressFill.style.width = (dayItems.length ? Math.round(finished / dayItems.length * 100) : 0) + '%';

  count.textContent = '남은 할 일 ' + remaining + '개';
  clearButton.disabled = finished === 0;
  footer.hidden = dayItems.length === 0;

  filterButtons.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
  });
}

function renderCalendarTab() {
  calTitle.textContent = calYear + '년 ' + (calMonth + 1) + '월';

  const cells = [];
  WEEKDAYS.split('').forEach(function (name, i) {
    const label = document.createElement('span');
    label.className = 'weekday' + (i === 0 ? ' sun' : '');
    label.textContent = name;
    cells.push(label);
  });

  const firstWeekday = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  for (let i = 0; i < firstWeekday; i++) cells.push(document.createElement('span'));

  const today = todayString();
  for (let day = 1; day <= daysInMonth; day++) {
    const due = dueString(calYear, calMonth, day);
    const items = todos.filter(function (t) { return t.due === due; });
    const importantCount = items.filter(function (t) { return t.important; }).length;
    const normalCount = items.length - importantCount;

    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cal-day';
    if ((firstWeekday + day - 1) % 7 === 0) cell.classList.add('sun');
    if (due === today) cell.classList.add('today');
    if (due === selectedDate) cell.classList.add('selected');
    cell.setAttribute('aria-label', dateText(due) + (items.length
      ? ', 중요 ' + importantCount + '건, 할 일 ' + normalCount + '건' : ''));
    cell.setAttribute('aria-pressed', String(due === selectedDate));
    cell.dataset.date = due;

    const number = document.createElement('span');
    number.className = 'number';
    number.textContent = day;
    cell.append(number);
    // 칸 안에는 "중요 N건"과 "할 일 N건" 두 칸만 보인다(0건인 칸은 뺀다)
    if (importantCount > 0) {
      const chip = document.createElement('span');
      chip.className = 'chip important';
      chip.textContent = '중요 ' + importantCount + '건';
      cell.append(chip);
    }
    if (normalCount > 0) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.setProperty('--date-color', dateColor(due));
      chip.textContent = '할 일 ' + normalCount + '건';
      cell.append(chip);
    }
    cell.addEventListener('click', function () { openPopup(due); });
    cells.push(cell);
  }
  calGrid.replaceChildren(...cells);
}

// 날짜 창: 그날 할 일을 중요한 것부터 몇 개만 보여 준다
function openPopup(due) {
  selectedDate = due;
  popupDate = due;
  render();
  popup.showModal();
}

function renderPopup() {
  if (!popupDate) return;
  const items = orderTodos(todos.filter(function (t) { return t.due === popupDate; }));
  popupTitle.textContent = dateText(popupDate) + ' · ' + ddayText(popupDate);
  popupList.replaceChildren(...items.slice(0, POPUP_ITEMS).map(function (t) { return makeItem(t); }));
  popupEmpty.hidden = items.length > 0;
  const more = items.length - POPUP_ITEMS;
  popupOpen.textContent = more > 0 ? '이 날짜 할 일 보기 (' + more + '개 더)' : '이 날짜 할 일 보기';
}

function renderDaysTab() {
  const word = query.trim().toLowerCase();
  const today = todayString();
  const matches = todos.filter(function (t) {
    if (range === 'upcoming' && t.due < today) return false;
    return !word || t.text.toLowerCase().includes(word);
  });

  const dates = [];
  matches.forEach(function (t) {
    if (!dates.includes(t.due)) dates.push(t.due);
  });
  dates.sort();

  daysList.replaceChildren(...dates.map(function (due) {
    const items = orderTodos(matches.filter(function (t) { return t.due === due; }));

    const group = document.createElement('div');
    group.className = 'day-group';

    const head = makeButton('', 'day-head', function () { openDay(due); });
    head.style.setProperty('--date-color', dateColor(due));
    head.setAttribute('aria-label', dateText(due) + ' 할 일 보기');
    const title = document.createElement('span');
    title.textContent = dateText(due) + ' · ' + ddayText(due);
    const total = document.createElement('span');
    total.className = 'count';
    total.textContent = items.length + '개';
    head.append(title, total);

    const itemList = document.createElement('ul');
    itemList.append(...items.map(function (t) { return makeItem(t); }));

    group.append(head, itemList);
    return group;
  }));

  if (todos.length === 0) {
    daysEmpty.textContent = '아직 할 일이 없어요';
  } else if (word) {
    daysEmpty.textContent = '검색 결과가 없어요';
  } else {
    daysEmpty.textContent = '오늘부터 할 일이 없어요';
  }
  daysEmpty.hidden = matches.length > 0;

  rangeButtons.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.range === range));
  });
  sampleButton.textContent = hasSamples() ? '🧪 테스트 할 일 지우기' : '🧪 테스트 할 일 20개 넣기';
}

function render() {
  renderTodoTab();
  renderCalendarTab();
  renderDaysTab();
  renderPopup();

  Object.keys(panels).forEach(function (name) {
    panels[name].hidden = name !== activeTab;
  });
  tabButtons.forEach(function (b) {
    b.setAttribute('aria-selected', String(b.dataset.tab === activeTab));
  });
  pageTitle.textContent = TAB_TITLES[activeTab];
  document.title = TAB_TITLES[activeTab];
}

function switchTab(name) {
  activeTab = name;
  render();
}

// 날짜를 골라 할 일 탭에서 그 날짜의 목록을 보여 준다
function openDay(due) {
  viewDate = due;
  switchTab('todo');
}

function moveMonth(step) {
  const moved = new Date(calYear, calMonth + step, 1);
  calYear = moved.getFullYear();
  calMonth = moved.getMonth();
  render();
}

function goToday() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  selectedDate = todayString();
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
enableDrag(list);
undoButton.addEventListener('click', undo);
themeButton.addEventListener('click', toggleTheme);
addButton.addEventListener('click', addTodo);
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.isComposing) addTodo();
});
byId('day-prev').addEventListener('click', function () {
  viewDate = addDays(viewDate, -1);
  render();
});
byId('day-next').addEventListener('click', function () {
  viewDate = addDays(viewDate, 1);
  render();
});
byId('day-today').addEventListener('click', function () {
  viewDate = todayString();
  render();
});
searchInput.addEventListener('input', function () {
  query = searchInput.value;
  render();
});
filterButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    filter = b.dataset.filter;
    render();
  });
});
sampleButton.addEventListener('click', toggleSamples);
rangeButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    range = b.dataset.range;
    render();
  });
});
clearButton.addEventListener('click', clearDone);
tabButtons.forEach(function (b) {
  b.addEventListener('click', function () { switchTab(b.dataset.tab); });
});
byId('cal-prev').addEventListener('click', function () { moveMonth(-1); });
byId('cal-next').addEventListener('click', function () { moveMonth(1); });
byId('cal-today').addEventListener('click', goToday);
byId('popup-close').addEventListener('click', function () { popup.close(); });
popupOpen.addEventListener('click', function () {
  const due = popupDate;
  popup.close();
  openDay(due);
  input.focus();
});
popup.addEventListener('click', function (e) {
  if (e.target === popup) popup.close();
});
popup.addEventListener('close', function () {
  popupDate = null;
  document.body.append(toast);
});

detailImportant.addEventListener('click', function () {
  setDetailImportant(detailImportant.getAttribute('aria-pressed') !== 'true');
});
detailDone.addEventListener('click', function () {
  setDetailDone(detailDone.getAttribute('aria-pressed') !== 'true');
});
byId('detail-tomorrow').addEventListener('click', postponeToTomorrow);
detailPick.addEventListener('click', function () { setPicker(detailPicker.hidden); });
byId('picker-prev').addEventListener('click', function () { movePicker(-1); });
byId('picker-next').addEventListener('click', function () { movePicker(1); });
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
