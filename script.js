// 예전에 이 브라우저에만 저장하던 곳(처음 한 번 Supabase로 옮긴다)
const LEGACY_KEY = 'todos';
const CACHE_KEY = 'todos-cache';
const IMPORTED_KEY = 'todos-imported';
// Supabase: 주소와 "공개 키"만 쓴다(비밀 키는 이 파일에 넣지 않는다)
const SUPABASE_URL = 'https://rszdkcoljivjwhxaakui.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HAR6474fEW52-CSgj5OlkQ_fd3GV8Cq';
const TODO_COLUMNS = 'id,text,done,created_at,due,important,memo,sort_order,sample';
const BASIC_COLUMNS = 'id,text,done,created_at';
const NOTICE_MILLISECONDS = 7000;
const THEME_KEY = 'theme';
const UNDO_MILLISECONDS = 5000;
const WEEKDAYS = '일월화수목금토';
const SKIN_KEY = 'skin';
const NAME_KEY = 'name';
const DEFAULT_SKIN = 'pastel';
const DATE_COLOR_COUNT = 8;

/* 테마: 색 + 모서리 둥글기(rs) + 글꼴 + 그림자(elev·box) + 테두리 두께(bw).
   일반 모드(light)와 다크 모드(dark)가 따로 있다.
   모드 색 순서: 바탕, 카드, 글자, 흐린 글자, 주 포인트, 그 위 글자, 보조 포인트, 그 위 글자, 강조 바탕, 그 위 글자, 빨강, 별 */
const SANS = '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
const SERIF = '"Noto Serif KR", "Nanum Myeongjo", AppleMyungjo, Batang, Georgia, serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Noto Sans Mono CJK KR", "Apple SD Gothic Neo", monospace';
const SWISS = '"Helvetica Neue", Helvetica, Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const GLOW_EDGE = '0 0 0 1px color-mix(in srgb, var(--lavender) 55%, transparent)';
const ELEVATIONS = {
  soft: '0 3px 12px var(--shadow)',
  hard: '4px 4px 0 var(--ink)',
  glow: GLOW_EDGE + ', 0 0 12px color-mix(in srgb, var(--lavender) 28%, transparent)',
  flat: 'none',
};
const BOX_SHADOWS = {
  offset: '0 6px 0 var(--lavender)',
  soft: '0 6px 20px var(--shadow)',
  hard: '6px 6px 0 var(--ink)',
  glow: GLOW_EDGE + ', 0 0 22px color-mix(in srgb, var(--lavender) 35%, transparent)',
  flat: 'none',
};

function palette(bg, card, ink, gray, a1, onA1, a2, onA2, hi, onHi, rose, star, extra) {
  return Object.assign({ bg: bg, card: card, ink: ink, gray: gray, a1: a1, onA1: onA1, a2: a2, onA2: onA2, hi: hi, onHi: onHi, rose: rose, star: star }, extra || {});
}

const THEMES = [
  {
    id: 'clean', name: '클린 미니멀', desc: '군더더기 없는 흑백 위주의 깔끔한 화면',
    rs: 0.5, font: SANS, elev: 'flat', box: 'flat', bw: 1, on: '#16161a', title: 'rule',
    dc: ['#e9e9ee', '#dbe5f0', '#e1ecda', '#f2e8d6', '#e5dcf1', '#f1dde1', '#d6ece9', '#efeed4'],
    light: palette('#f7f7f8', '#ffffff', '#16161a', '#86868e', '#16161a', '#ffffff', '#dcdce2', '#16161a', '#ececf0', '#16161a', '#d92d4f', '#e8a600'),
    dark: palette('#101012', '#1a1a1e', '#f1f1f4', '#8c8c96', '#f1f1f4', '#101012', '#3a3a42', '#f1f1f4', '#2a2a30', '#f1f1f4', '#ff6b86', '#f2b600'),
  },
  {
    id: 'fintech', name: '산뜻한 핀테크', desc: '맑은 파랑과 넉넉하게 둥근 카드',
    rs: 1.1, font: SANS, elev: 'soft', box: 'soft', bw: 0, on: '#191f28',
    dc: ['#cfe2ff', '#d2f0e6', '#ffe3b3', '#e1d9ff', '#ffd6d9', '#c4ebf6', '#e3f2c6', '#f8d9ec'],
    light: palette('#f2f6fc', '#ffffff', '#191f28', '#8b95a1', '#3182f6', '#ffffff', '#cfe2ff', '#191f28', '#d9ecff', '#191f28', '#f04452', '#ffb300'),
    dark: palette('#0f1218', '#1a1f29', '#f2f4f6', '#8b95a1', '#4593fc', '#0b1220', '#2d4468', '#f2f4f6', '#1e3a63', '#f2f4f6', '#ff6b78', '#ffc233'),
  },
  {
    id: 'public', name: '공공 신뢰', desc: '정부 서비스처럼 차분한 파랑과 또렷한 글씨',
    rs: 0.4, font: SANS, elev: 'flat', box: 'flat', bw: 1, on: '#1b2733', title: 'rule',
    dc: ['#d6e4f5', '#d6eedd', '#f7e6c4', '#e6dcf0', '#f6d9d9', '#cfeaee', '#e8efc9', '#f0dde8'],
    light: palette('#f4f6f9', '#ffffff', '#1b2733', '#5f6b7a', '#0b5cab', '#ffffff', '#b9c7d9', '#1b2733', '#e3ebf5', '#1b2733', '#c62828', '#e08a00'),
    dark: palette('#0f1923', '#172433', '#eaf0f7', '#9aa8b8', '#5aa0ee', '#0b1620', '#34506e', '#eaf0f7', '#22384f', '#eaf0f7', '#ff7a7a', '#f5b942'),
  },
  {
    id: 'control', name: '다크 데이터 관제실', desc: '어두운 바탕에 청록 포인트, 표와 숫자 느낌',
    rs: 0.3, font: MONO, elev: 'flat', box: 'flat', bw: 1, on: '#04120f', title: 'rule',
    dc: ['#19c3a6', '#4aa8ff', '#ffb020', '#b48cff', '#ff6f91', '#7be0ff', '#a6e22e', '#ff9f5a'],
    light: palette('#eef3f6', '#ffffff', '#0f1c26', '#5c7385', '#0b8a75', '#ffffff', '#b5c8d4', '#0f1c26', '#d6e6ee', '#0f1c26', '#d63a5a', '#d98a00'),
    dark: palette('#0a0f14', '#121a22', '#d6e4ee', '#6f8596', '#19c3a6', '#04120f', '#24465a', '#d6e4ee', '#17303d', '#d6e4ee', '#ff5c7a', '#ffb020'),
  },
  {
    id: 'bento', name: '벤토 그리드', desc: '큼직하게 둥근 타일이 모인 느낌',
    rs: 1.4, font: SANS, elev: 'flat', box: 'soft', bw: 0, on: '#1c1f26', title: 'none',
    dc: ['#ffd9c7', '#d8e6ff', '#d6f2df', '#f3e1ff', '#fff0b8', '#ffd6e6', '#d3f1f5', '#e6eccf'],
    light: palette('#eceff3', '#ffffff', '#1c1f26', '#7b8394', '#ff7a45', '#1c1f26', '#d7dbe4', '#1c1f26', '#ffe1d3', '#1c1f26', '#e0405b', '#f5a700'),
    dark: palette('#121418', '#1d2026', '#eef0f4', '#8e96a6', '#ff8a5c', '#1a0f0a', '#343944', '#eef0f4', '#3a2a22', '#eef0f4', '#ff7b93', '#f5b82e'),
  },
  {
    id: 'glass', name: '소프트 글래스', desc: '반투명 유리 카드와 은은하게 번지는 배경',
    rs: 1.5, font: SANS, elev: 'soft', box: 'soft', bw: 1, blur: '14px', on: '#1e293b', title: 'none',
    dc: ['#c7d2fe', '#fbcfe8', '#bae6fd', '#bbf7d0', '#fde68a', '#ddd6fe', '#fecdd3', '#a7f3d0'],
    light: palette('#e6ecfb', 'rgba(255, 255, 255, 0.55)', '#1e293b', '#64748b', '#6366f1', '#ffffff', '#c7d2fe', '#1e293b', '#e0e7ff', '#1e293b', '#e11d48', '#f59e0b',
      { cardSolid: '#f1f4ff', bgImage: 'linear-gradient(135deg, #dbeafe, #fce7f3 50%, #e0f2fe)' }),
    dark: palette('#1b1a4a', 'rgba(255, 255, 255, 0.09)', '#e8ebff', '#a5b0d6', '#8b8ffa', '#0b0d2a', '#4a4fa8', '#ffffff', '#3a3f8a', '#ffffff', '#ff7fa0', '#fbbf24',
      { cardSolid: '#26256a', bgImage: 'linear-gradient(135deg, #1e1b4b, #312e81 50%, #0f172a)' }),
  },
  {
    id: 'hanji', name: '한지 에디토리얼', desc: '종이 질감의 따뜻한 바탕과 명조 글씨',
    rs: 0.3, font: SERIF, elev: 'flat', box: 'flat', bw: 1, on: '#2b2620', title: 'rule',
    dc: ['#e8d5c4', '#d9dfc9', '#dccfe0', '#efe0b6', '#cfdde0', '#e9c9c4', '#d6d9c0', '#e2cfd6'],
    light: palette('#f4efe4', '#fbf8f0', '#2b2620', '#8a7f6d', '#8c2f2f', '#fbf8f0', '#cdbf9f', '#2b2620', '#e8dcc0', '#2b2620', '#a83232', '#b8860b'),
    dark: palette('#1c1814', '#26201a', '#eee4d0', '#a89c86', '#d9805f', '#1c1814', '#5a4d3a', '#eee4d0', '#3a2f22', '#eee4d0', '#e07a6a', '#d9a441'),
  },
  {
    id: 'brutal', name: '네오 브루탈 팝', desc: '굵은 검정 테두리와 딱딱한 그림자',
    rs: 0, font: SANS, elev: 'hard', box: 'hard', bw: 2, on: '#111111',
    dc: ['#ff8fc4', '#8fd4ff', '#ffe14d', '#a8f08a', '#c9a6ff', '#ffb35c', '#7ef0d0', '#ff8a8a'],
    light: palette('#fff7d6', '#ffffff', '#111111', '#555555', '#ff5ca8', '#111111', '#111111', '#ffffff', '#ffe14d', '#111111', '#e0245e', '#ffb800'),
    dark: palette('#151515', '#242424', '#ffffff', '#bbbbbb', '#ff6fb5', '#111111', '#ffffff', '#111111', '#ffe14d', '#111111', '#ff6b8a', '#ffd23f'),
  },
  {
    id: 'aurora', name: '오로라 그라데이션', desc: '북극 하늘처럼 번지는 색의 배경',
    rs: 1.3, font: SANS, elev: 'soft', box: 'soft', bw: 0, blur: '8px', on: '#20243a',
    dc: ['#b3f0e6', '#c9b8ff', '#ffc2e1', '#a8d8ff', '#d8f7a8', '#ffe0a3', '#9ff0ff', '#e2b8ff'],
    light: palette('#e9f3fb', 'rgba(255, 255, 255, 0.7)', '#20243a', '#6b7390', '#7c4dff', '#ffffff', '#b9a8ff', '#20243a', '#d1c4ff', '#20243a', '#e91e63', '#ffb300',
      { cardSolid: '#f6f4ff', bgImage: 'linear-gradient(160deg, #e0f7fa, #ede7f6 45%, #fce4ec)' }),
    dark: palette('#0a1a2c', 'rgba(255, 255, 255, 0.07)', '#eaf6ff', '#8fb3c9', '#5ef2c8', '#04211c', '#3b7d8e', '#eaf6ff', '#234a5c', '#eaf6ff', '#ff7aa2', '#ffd166',
      { cardSolid: '#14213a', bgImage: 'linear-gradient(160deg, #071a2b, #1b1245 50%, #0d2b3a)' }),
  },
  {
    id: 'neon', name: '네온 다크', desc: '짙은 보라 밤에 번쩍이는 분홍과 하늘색',
    rs: 0.6, font: SANS, elev: 'glow', box: 'glow', bw: 1, on: '#150d24', title: 'rule', glow: true,
    dc: ['#ff7be9', '#7bf0ff', '#fff27b', '#a9ff7b', '#c19bff', '#ffb27b', '#7bffd0', '#ff7b9c'],
    light: palette('#f7f0ff', '#ffffff', '#2a1148', '#7c5ea8', '#d900b0', '#ffffff', '#00b8d4', '#06222a', '#ead6ff', '#2a1148', '#e0204a', '#e6b800'),
    dark: palette('#0b0713', '#150d24', '#f6eaff', '#9d86c4', '#ff2bd6', '#150d24', '#00e5ff', '#06222a', '#3a1a5c', '#f6eaff', '#ff4d6d', '#ffe600'),
  },
  {
    id: 'sand', name: '웜 샌드', desc: '모래빛 바탕과 테라코타 포인트',
    rs: 1, font: SANS, elev: 'soft', box: 'soft', bw: 0, on: '#3b2f26',
    dc: ['#f3d2b8', '#e6dcb0', '#d7e0c4', '#f0c4b4', '#dcc9e0', '#c9dbe0', '#f1e0a8', '#e8c6a8'],
    light: palette('#f6efe6', '#fffaf2', '#3b2f26', '#9a8878', '#b5663a', '#ffffff', '#e3cfb6', '#3b2f26', '#f1dcc0', '#3b2f26', '#b5412f', '#d9961a'),
    dark: palette('#1d1712', '#2a221b', '#f2e6d6', '#b09c86', '#e29a6b', '#1d1712', '#5c4a39', '#f2e6d6', '#44352a', '#f2e6d6', '#f0907c', '#e0a93a'),
  },
  {
    id: 'swiss', name: '스위스 그리드', desc: '흑백과 빨강, 각진 모서리의 정돈된 격자',
    rs: 0, font: SWISS, elev: 'flat', box: 'flat', bw: 1, on: '#111111', title: 'rule',
    dc: ['#f1f1f1', '#e8e8e8', '#dedede', '#d3d3d3', '#c8c8c8', '#fadbd8', '#ffe5e3', '#ededed'],
    light: palette('#ffffff', '#ffffff', '#111111', '#6a6a6a', '#e30613', '#ffffff', '#111111', '#ffffff', '#f3f3f3', '#111111', '#e30613', '#f2a900'),
    dark: palette('#111111', '#1a1a1a', '#f5f5f5', '#9a9a9a', '#ff3b30', '#ffffff', '#f5f5f5', '#111111', '#2a2a2a', '#f5f5f5', '#ff5a50', '#ffb800'),
  },
  {
    id: 'pastel', name: '파스텔 팝', desc: '분홍·보라 파스텔의 통통 튀는 느낌 (기본)',
    rs: 1, font: SANS, elev: 'soft', box: 'offset', bw: 0, on: '#2d2a45',
    dc: ['#ffb3d1', '#c9b8ff', '#b8f0d8', '#ffe49a', '#a8d8ff', '#ffc9a8', '#d4f0a0', '#ffb3b3'],
    light: palette('#fff5fb', '#ffffff', '#2d2a45', '#9a95b3', '#ff9ec7', '#2d2a45', '#c9b8ff', '#2d2a45', '#ffe49a', '#2d2a45', '#d6336c', '#f5b301'),
    dark: palette('#1f1a33', '#2b2547', '#f1edff', '#a9a2c9', '#ff9ec7', '#2d2a45', '#a28ff0', '#2d2a45', '#ffe49a', '#2d2a45', '#ff7aa8', '#f5b301',
      { hl: 'rgba(255, 228, 154, 0.35)' }),
  },
  {
    id: 'navy', name: '코퍼레이트 네이비', desc: '진한 남색과 금색 포인트의 업무용 화면',
    rs: 0.6, font: SANS, elev: 'soft', box: 'flat', bw: 1, on: '#14213d', title: 'rule',
    dc: ['#d3dcf0', '#f3e1b8', '#cfe7e3', '#e3d3ee', '#f1d0d0', '#c8def3', '#dfe8c5', '#ecd9c6'],
    light: palette('#eef1f6', '#ffffff', '#14213d', '#6b7a99', '#14213d', '#ffffff', '#b8c4dc', '#14213d', '#dfe6f2', '#14213d', '#c0392b', '#e0a100'),
    dark: palette('#0a1226', '#121d38', '#e8eefc', '#8fa0c4', '#fca311', '#14213d', '#2c3e66', '#e8eefc', '#1e2e52', '#e8eefc', '#ff7b7b', '#fca311'),
  },
  {
    id: 'retro', name: '레트로 그린 스크린', desc: '검은 화면에 초록 글자, 옛날 단말기 느낌',
    rs: 0, font: MONO, elev: 'flat', box: 'flat', bw: 1, on: '#021008', title: 'none', glow: true,
    dc: ['#b8f5c2', '#e6ff99', '#99f0d8', '#c8e6a0', '#a6e6b8', '#d9f2a6', '#8fe0a8', '#ccf5b0'],
    light: palette('#e8f5e9', '#f4fbf4', '#0b3d1a', '#4f7a5a', '#0b5d1e', '#e8f5e9', '#8fc29a', '#0b3d1a', '#cfe8d3', '#0b3d1a', '#b3261e', '#8a7a00'),
    dark: palette('#021008', '#04200f', '#33ff66', '#1fa84a', '#33ff66', '#021008', '#1a7a38', '#33ff66', '#0b3a1c', '#33ff66', '#ff5e5e', '#e6ff33'),
  },
];

// 테마와 모드(light·dark)에 맞는 CSS 변수 값 묶음
function themeVars(theme, mode) {
  const m = theme[mode];
  const vars = {
    '--bg': m.bg,
    '--card': m.card,
    '--card-solid': m.cardSolid || m.card,
    '--ink': m.ink,
    '--gray': m.gray,
    '--pink': m.a1,
    '--on-a1': m.onA1,
    '--lavender': m.a2,
    '--on-a2': m.onA2,
    '--yellow': m.hi,
    '--on-yellow': m.onHi,
    '--hl': theme.title === 'rule' ? m.a1 : (m.hl || m.hi),
    '--hl-from': theme.title === 'rule' ? '90%' : theme.title === 'none' ? '100%' : '55%',
    '--title-shadow': theme.glow ? '0 0 10px color-mix(in srgb, var(--pink) 70%, transparent)' : 'none',
    '--rose': m.rose,
    '--star': m.star,
    '--on-accent': theme.on,
    '--rs': String(theme.rs),
    '--font': theme.font,
    '--elev': ELEVATIONS[theme.elev],
    '--elev-box': BOX_SHADOWS[theme.box],
    '--bw': theme.bw + 'px',
    '--blur': theme.blur ? 'blur(' + theme.blur + ')' : 'none',
    '--bg-image': m.bgImage || 'none',
  };
  theme.dc.forEach(function (color, i) { vars['--dc' + i] = color; });
  return vars;
}

function findTheme(id) {
  return THEMES.find(function (t) { return t.id === id; }) || THEMES.find(function (t) { return t.id === DEFAULT_SKIN; });
}

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
const spanButtons = document.querySelectorAll('#span-tabs button');
const spanLabel = byId('span-label');
const daysFilterButtons = document.querySelectorAll('#days-filter button');
const sampleButton = byId('sample-button');
const daysList = byId('days-list');
const daysEmpty = byId('days-empty');
const todayText = byId('today');
const themeButton = byId('theme-button');
const settingsButton = byId('settings-button');
const nameInput = byId('name-input');
const optMain = byId('opt-main');
const optThemes = byId('opt-themes');
const optPreview = byId('opt-preview');
const themeList = byId('theme-list');
const toast = byId('toast');
const toastText = byId('toast-text');
const undoButton = byId('undo-button');
const tabButtons = document.querySelectorAll('#tabbar button');
const panels = {
  todo: byId('tab-todo'),
  calendar: byId('tab-calendar'),
  days: byId('tab-days'),
  options: byId('tab-options'),
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
const detailPending = byId('detail-pending');

const TAB_TITLES = {
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

let todos = loadCache();
let fullSchema = true;
let settingsReady = true;
let activeTab = 'todo';
let viewDate = todayString();
let filter = 'all';
let query = '';
let skinId = readSkin();
let userName = readName();
let optionsPage = 'main';
let previewId = null;
let lastTab = 'todo';
let spanMode = 'week';
let daysFilter = 'all';
let spanAnchor = todayString();
let undoAction = null;
let toastTimer = null;
let detailId = null;
let pendingDue = null;
let pendingLabel = '';
let pickerYear = 0;
let pickerMonth = 0;
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = todayString();
let popupDate = null;
// 날짜 묶음을 접고 펴는 것을 사용자가 정한 경우만 기억한다(정하지 않은 날짜는 지난 날짜만 접혀 있다)
const foldChoices = new Map();

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

// 같은 날짜는 언제나 같은 색이 되도록, 날짜 번호를 색 개수로 나눈 나머지로 고른다(색 자체는 테마가 정한다)
function dateColor(due) {
  const p = parseDue(due);
  const dayNumber = Math.floor(Date.UTC(p.year, p.month - 1, p.day) / 86400000);
  return 'var(--dc' + (dayNumber % DATE_COLOR_COUNT) + ')';
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

/* 저장하고 불러오기: 할 일은 Supabase의 todos 표에 저장한다.
   화면은 먼저 바꾸고, 표에는 뒤에서 이어서 저장한다. 이 브라우저에는 "마지막으로 본 목록"만 복사해 둔다 */
function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : '';
}

function dateOfTimestamp(value) {
  const moment = new Date(value);
  if (!value || isNaN(moment.getTime())) return todayString();
  return dueString(moment.getFullYear(), moment.getMonth(), moment.getDate());
}

// 표의 한 줄(또는 복사해 둔 한 줄)을 화면에서 쓰는 할 일로 바꾼다
function fromRow(row) {
  const order = row.sort_order !== undefined ? row.sort_order : row.order;
  return {
    id: row.id,
    text: String(row.text === null || row.text === undefined ? '' : row.text),
    done: !!row.done,
    important: !!row.important,
    // 날짜가 비어 있는 예전 할 일은 만든 날의 날짜로 보인다
    due: validDate(row.due) || dateOfTimestamp(row.created_at || row.created),
    memo: typeof row.memo === 'string' ? row.memo : '',
    sample: !!row.sample,
    order: order === null || order === undefined || isNaN(Number(order)) ? null : Number(order),
    created: row.created_at || row.created || '',
  };
}

function loadCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(function (t) { return t && typeof t.text === 'string'; })
      .map(fromRow)
      .map(function (t, i) {
        if (t.order === null) t.order = i;
        return t;
      });
  } catch (e) {
    return [];
  }
}

// 이 브라우저에 "마지막으로 본 목록"을 복사해 둔다(불러오는 동안·인터넷이 없을 때 보여 주려고)
function save() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(todos));
  } catch (e) {
    // 저장이 막힌 브라우저에서도 화면은 계속 동작한다
  }
}

// 예전에 이 브라우저에만 저장했던 할 일
function readLegacy() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEGACY_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(function (t) { return t && typeof t.text === 'string' && t.text.trim(); })
      .map(function (t) {
        const todo = fromRow(t);
        todo.id = tempId();
        return todo;
      });
  } catch (e) {
    return [];
  }
}

/* Supabase 표와 주고받기(다른 사이트의 라이브러리 없이 주소로 바로 부른다) */
async function db(method, path, body, headers) {
  const options = { method: method, headers: Object.assign({ apikey: SUPABASE_KEY }, headers || {}) };
  // 저장하는 요청은 새로고침하거나 창을 닫아도 끝까지 가도록 한다
  if (method !== 'GET') options.keepalive = true;
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const response = await fetch(SUPABASE_URL + '/rest/v1/' + path, options);
  const text = await response.text();
  if (!response.ok) {
    let info = {};
    try {
      info = JSON.parse(text);
    } catch (e) {
      // 설명이 글자뿐인 경우
    }
    const error = new Error(info.message || text || 'HTTP ' + response.status);
    error.status = response.status;
    error.code = info.code;
    throw error;
  }
  return text ? JSON.parse(text) : null;
}

function tempId() {
  return 'tmp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

function isTemp(id) {
  return typeof id === 'string' && id.indexOf('tmp-') === 0;
}

function isMissingColumn(error) {
  return !!error && error.status === 400 && (error.code === '42703' || /column/i.test(error.message || ''));
}

function isMissingTable(error) {
  return !!error && (error.status === 404 || error.code === 'PGRST205' || error.code === '42P01');
}

function describeError(error) {
  if (!error || error.status === undefined) return '인터넷에 연결되지 않았어요';
  if (error.status === 401 || error.status === 403 || error.code === '42501') {
    return '이 표를 읽고 쓰는 것이 허용되지 않았어요(Supabase에서 허용 설정이 필요해요)';
  }
  if (isMissingTable(error)) return 'Supabase에 표가 없어요';
  if (isMissingColumn(error)) return '표에 필요한 칸이 없어요';
  return error.message || '알 수 없는 문제예요';
}

// 저장에 실패하면 이유를 알려 준다(같은 안내가 연달아 뜨지 않게 몇 초는 건너뛴다)
let lastNoticeAt = 0;
function reportError(error) {
  const now = Date.now();
  if (now - lastNoticeAt < 4000) return;
  lastNoticeAt = now;
  notify('Supabase에 저장하지 못했어요: ' + describeError(error));
}

// 이번에 연 화면에서 새로 표에 넣은 할 일(불러오기가 끝나기 전에 만든 것을 지우지 않으려고 기억한다)
const createdHere = new WeakSet();

// 할 일마다 저장 일을 차례대로 이어 붙인다(추가가 끝난 뒤에 체크·삭제가 가도록)
const chains = new WeakMap();

function chain(todo, step) {
  const state = chains.get(todo) || { promise: Promise.resolve(), failed: false };
  state.promise = state.promise.then(function () {
    if (state.failed) return undefined;
    return step();
  }).catch(function (error) {
    state.failed = isTemp(todo.id);
    reportError(error);
  });
  chains.set(todo, state);
  return state.promise;
}

function settled(list) {
  return Promise.all(list.map(function (t) {
    const state = chains.get(t);
    return state ? state.promise : Promise.resolve();
  }));
}

function rowFor(todo) {
  const row = { text: todo.text, done: todo.done };
  if (fullSchema) {
    row.important = todo.important;
    row.memo = todo.memo;
    row.due = todo.due;
    row.sort_order = todo.order;
    row.sample = todo.sample;
  }
  return row;
}

function patchFor(todo, fields) {
  const body = {};
  fields.forEach(function (field) {
    if (field === 'text' || field === 'done') body[field] = todo[field];
    else if (!fullSchema) return;
    else if (field === 'order') body.sort_order = todo.order;
    else body[field] = todo[field];
  });
  return body;
}

// 새 할 일(들)을 표에 넣는다. 표가 정해 준 id로 바꿔 끼운다
function persistInsert(list) {
  list.forEach(function (t) {
    if (!isTemp(t.id)) t.id = tempId();
    createdHere.add(t);
  });
  const request = db('POST', 'todos', list.map(rowFor), { Prefer: 'return=representation' }).then(function (rows) {
    rows.forEach(function (row, i) {
      const old = list[i].id;
      list[i].id = row.id;
      if (row.created_at) list[i].created = row.created_at;
      if (detailId === old) detailId = row.id;
      // 화면은 다시 그리지 않고, 줄에 붙어 있는 id 표시만 새 id로 바꾼다(누르는 중에 줄이 바뀌지 않게)
      document.querySelectorAll('li[data-id]').forEach(function (li) {
        if (li.dataset.id === String(old)) li.dataset.id = String(row.id);
      });
    });
    save();
  });
  list.forEach(function (t, i) {
    const state = { promise: null, failed: false };
    state.promise = request.then(function () {}, function (error) {
      state.failed = true;
      if (i === 0) reportError(error);
    });
    chains.set(t, state);
  });
  return request;
}

function persistUpdate(todo, fields) {
  chain(todo, function () {
    const body = patchFor(todo, fields);
    if (!Object.keys(body).length) return undefined;
    return db('PATCH', 'todos?id=eq.' + encodeURIComponent(todo.id), body);
  });
}

function persistDelete(list) {
  settled(list).then(function () {
    const ids = list.filter(function (t) { return !isTemp(t.id); }).map(function (t) { return encodeURIComponent(t.id); });
    if (!ids.length) return undefined;
    return db('DELETE', 'todos?id=in.(' + ids.join(',') + ')');
  }).catch(reportError);
}

/* 순서: 배열 순서가 곧 보이는 순서이고, 저장은 sort_order(작을수록 위) 숫자로 한다 */
function orderBetween(before, after) {
  if (before && after) return (before.order + after.order) / 2;
  if (after) return after.order - 1;
  if (before) return before.order + 1;
  return 0;
}

// 배열에 이미 들어간 할 일의 자리에 맞는 순서 숫자를 정한다
function placeAt(todo) {
  const i = todos.indexOf(todo);
  const before = todos[i - 1];
  const after = todos[i + 1];
  todo.order = orderBetween(before, after);
  const tooClose = (before && todo.order <= before.order) || (after && todo.order >= after.order);
  if (tooClose) renormalize();
}

// 숫자 사이가 너무 좁아지면 0, 1, 2…로 다시 매긴다
function renormalize() {
  todos.forEach(function (t, i) {
    if (t.order !== i) {
      t.order = i;
      persistUpdate(t, ['order']);
    }
  });
}

// 안내에 쓰는 할 일 이름: 길면 줄이고 ‘ ’로 감싼다
function quote(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return '‘' + (clean.length > 12 ? clean.slice(0, 12) + '…' : clean) + '’';
}

// 여러 개면 "‘A’, ‘B’ 외 3개"처럼 앞의 두 개만 보여 준다
function nameList(list) {
  const shown = list.slice(0, 2).map(function (t) { return quote(t.text); }).join(', ');
  return list.length > 2 ? shown + ' 외 ' + (list.length - 2) + '개' : shown;
}

function notify(message) {
  showToast(message, null, NOTICE_MILLISECONDS);
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
  // 새 할 일은 배열의 맨 앞에 넣는다. 그러면 자기 무리(나머지 진행 중)의 맨 위에 나타난다
  const todo = {
    id: tempId(),
    text: text,
    done: false,
    important: false,
    due: viewDate,
    memo: '',
    sample: false,
    order: todos.length ? todos[0].order - 1 : 0,
    created: '',
  };
  todos.unshift(todo);
  input.value = '';
  input.focus();
  save();
  render();
  persistInsert([todo]);
}

// 완료를 바꾸면 새 무리의 맨 위에 나타나도록 배열의 맨 앞으로 옮긴다
function bringToFront(todo) {
  todos.splice(todos.indexOf(todo), 1);
  todo.order = todos.length ? todos[0].order - 1 : 0;
  todos.unshift(todo);
}

function toggleDone(id) {
  const todo = findTodo(id);
  if (todo) {
    todo.done = !todo.done;
    bringToFront(todo);
    save();
    render();
    persistUpdate(todo, ['done', 'order']);
  }
}

function toggleImportant(id) {
  const todo = findTodo(id);
  if (todo) {
    todo.important = !todo.important;
    save();
    render();
    persistUpdate(todo, ['important']);
  }
}

/* 테스트 할 일: 넣은 것에는 sample 표시를 해 두어서, 내가 만든 할 일과 섞이지 않게 지울 수 있다 */
function hasSamples() {
  return todos.some(function (t) { return t.sample; });
}

function addSamples() {
  const today = todayString();
  const last = todos.length ? todos[todos.length - 1].order : -1;
  const added = SAMPLE_TODOS.map(function (row, i) {
    return {
      id: tempId(),
      text: row[1],
      done: row[3],
      important: row[2],
      due: addDays(today, row[0]),
      memo: row[4],
      sample: true,
      order: last + 1 + i,
      created: '',
    };
  });
  todos.push(...added);
  save();
  render();
  persistInsert(added);
}

function toggleSamples() {
  if (hasSamples()) {
    const count = todos.filter(function (t) { return t.sample; }).length;
    removeTodos(function (t) { return t.sample; }, function () { return '테스트 할 일 ' + count + '개를 지웠어요'; });
  } else {
    addSamples();
  }
}

/* 지운 할 일은 원래 자리(순서)와 함께 기억해 둔다 */
function removeTodos(shouldRemove, makePrefix) {
  const removed = [];
  todos.forEach(function (t, index) {
    if (shouldRemove(t)) removed.push({ todo: t, index: index });
  });
  todos = todos.filter(function (t) { return !shouldRemove(t); });
  save();
  render();
  const gone = removed.map(function (r) { return r.todo; });
  persistDelete(gone);
  showToast(makePrefix(gone) + ': ' + nameList(gone), function () {
    // 되돌리기: 원래 자리에 다시 끼우고, 표에는 새 줄로 다시 넣는다
    removed.forEach(function (r) {
      todos.splice(Math.min(r.index, todos.length), 0, r.todo);
      placeAt(r.todo);
    });
    persistInsert(gone);
    return '되돌렸어요: ' + nameList(gone);
  });
}

function deleteTodo(id) {
  removeTodos(function (t) { return t.id === id; }, function () { return '삭제했어요'; });
}

// 완료한 것 지우기: 먼저 확인 창을 띄우고, "삭제"를 눌렀을 때만 지운다
function clearDone() {
  const day = viewDate;
  const finished = todos.filter(function (t) { return t.due === day && t.done; });
  if (!finished.length) return;
  askConfirm(
    '완료한 할 일 ' + finished.length + '개를 모두 삭제할까요? ' + nameList(finished),
    function () {
      removeTodos(function (t) { return t.due === day && t.done; }, function (gone) {
        return '완료한 할 일 ' + gone.length + '개를 지웠어요';
      });
    }
  );
}

let confirmAction = null;

function askConfirm(message, onOk) {
  byId('confirm-text').textContent = message;
  confirmAction = onOk;
  byId('confirm-dialog').showModal();
}

function undo() {
  const action = undoAction;
  hideToast();
  const message = action ? action() : null;
  save();
  render();
  // 무엇을 되돌렸는지 알려 준다
  if (message) notify(message);
}

function showToast(message, undoWith, milliseconds) {
  undoAction = undoWith;
  undoButton.hidden = !undoWith;
  toastText.textContent = message;
  (popup.open ? popup : document.body).append(toast);
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, milliseconds || UNDO_MILLISECONDS);
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
  setPending(null, '');
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
  const done = detailDone.getAttribute('aria-pressed') === 'true';
  if (done !== todo.done) {
    todo.done = done;
    bringToFront(todo);
  }
  return true;
}

function saveDetail() {
  const todo = findTodo(detailId);
  if (!todo) {
    detail.close();
    return;
  }
  // 옮길 날짜를 정해 둔 상태에서 "저장"을 누르면 그 날짜로 옮긴다
  if (pendingDue && pendingDue !== todo.due) {
    moveDetailTo(pendingDue, pendingLabel);
    return;
  }
  if (!applyDetail(todo)) return;
  detail.close();
  save();
  render();
  persistUpdate(todo, ['text', 'memo', 'important', 'done', 'order']);
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
  persistUpdate(todo, ['text', 'memo', 'important', 'done', 'order', 'due']);
  showToast(label + ': ' + quote(todo.text) + ' → ' + dateText(todo.due), function () {
    todo.due = oldDue;
    persistUpdate(todo, ['due']);
    return '되돌렸어요: ' + quote(todo.text) + ' → ' + dateText(oldDue);
  });
}

// 옮길 날짜를 정해 두기만 한다. 실제로 바뀌는 것은 "저장"을 눌렀을 때다
function setPending(due, label) {
  pendingDue = due;
  pendingLabel = label;
  detailPending.hidden = !due;
  byId('detail-pending-text').textContent = due ? '옮길 날짜: ' + dateText(due) + ' · 저장을 눌러야 바뀌어요' : '';
  if (!detailPicker.hidden) renderPicker();
}

// 내일로 미루기: 오늘과 그 할 일 날짜 중 더 뒤인 날의 다음 날을 옮길 날짜로 정한다
function postponeToTomorrow() {
  const todo = findTodo(detailId);
  if (!todo) return;
  const today = todayString();
  setPicker(false);
  setPending(addDays(todo.due > today ? todo.due : today, 1), '미뤘어요');
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
    if (due === pendingDue) cell.classList.add('chosen');
    cell.dataset.date = due;
    cell.setAttribute('aria-label', dateText(due) + '로 정하기');
    cells.push(cell);
  }
  pickerGrid.replaceChildren(...cells);
}

// 달력에서 날짜를 누르면 옮길 날짜로 정하고 달력을 접는다(지금 날짜를 누르면 정한 것이 없어진다)
function pickDate(due) {
  const todo = findTodo(detailId);
  setPicker(false);
  if (todo && todo.due === due) setPending(null, '');
  else setPending(due, '옮겼어요');
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

// 화면에 보이는 순서(li 차례)를 할 일 배열 순서에 반영한다.
// 자리를 정하는 기준은 같은 무리의 이웃 줄이다(다른 무리 줄과의 순서는 보이는 순서에 영향을 주지 않는다).
function commitOrder(li) {
  const todo = todos.find(function (t) { return String(t.id) === li.dataset.id; });
  if (!todo) return;
  let next = li.nextElementSibling;
  while (next && !samePart(next, li)) next = next.nextElementSibling;
  let prev = li.previousElementSibling;
  while (prev && !samePart(prev, li)) prev = prev.previousElementSibling;
  const neighbor = next || prev;
  const other = neighbor && todos.find(function (t) { return String(t.id) === neighbor.dataset.id; });
  if (!other || other === todo) return;
  todos.splice(todos.indexOf(todo), 1);
  const at = todos.indexOf(other);
  todos.splice(next ? at : at + 1, 0, todo);
  placeAt(todo);
  save();
  render();
  persistUpdate(todo, ['order']);
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
    if (filter === 'important') return t.important && !t.done;
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
  clearButton.hidden = filter !== 'all' && filter !== 'done';
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
    const finished = items.filter(function (t) { return t.done; }).length;
    cell.setAttribute('aria-label', dateText(due) + (items.length
      ? ', 중요 ' + importantCount + '건, 할 일 ' + normalCount + '건, 완료 ' + finished + '/' + items.length : ''));
    cell.setAttribute('aria-pressed', String(due === selectedDate));
    cell.dataset.date = due;

    // 날짜 숫자 옆의 동그라미: 그 날짜 할 일의 완료 정도만큼 채워진다
    const number = document.createElement('span');
    number.className = 'number';
    number.textContent = day;
    const numberRow = document.createElement('span');
    numberRow.className = 'number-row';
    numberRow.append(number);
    if (items.length > 0) {
      const ring = document.createElement('span');
      ring.className = 'ring';
      ring.style.setProperty('--p', String(Math.round(finished / items.length * 100)));
      ring.dataset.percent = String(Math.round(finished / items.length * 100));
      numberRow.append(ring);
    }
    cell.append(numberRow);
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

// 날짜별 목록에서 보여 줄 날짜들(한주: 일요일~토요일 7일, 한달: 그 달 전체)
function spanDates() {
  const anchor = parseDue(spanAnchor);
  let first;
  let length;
  if (spanMode === 'week') {
    const weekday = new Date(anchor.year, anchor.month - 1, anchor.day).getDay();
    first = addDays(spanAnchor, -weekday);
    length = 7;
  } else {
    first = dueString(anchor.year, anchor.month - 1, 1);
    length = new Date(anchor.year, anchor.month, 0).getDate();
  }
  const dates = [];
  for (let i = 0; i < length; i++) dates.push(addDays(first, i));
  return dates;
}

function moveSpan(step) {
  if (spanMode === 'week') {
    spanAnchor = addDays(spanAnchor, step * 7);
  } else {
    const p = parseDue(spanAnchor);
    const moved = new Date(p.year, p.month - 1 + step, 1);
    spanAnchor = dueString(moved.getFullYear(), moved.getMonth(), 1);
  }
  render();
}

function isFolded(due) {
  return foldChoices.has(due) ? foldChoices.get(due) : due < todayString();
}

function renderDaysTab() {
  const word = query.trim().toLowerCase();
  const dates = spanDates();

  spanButtons.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.span === spanMode));
  });
  if (spanMode === 'week') {
    const last = parseDue(dates[6]);
    const first = parseDue(dates[0]);
    spanLabel.textContent = first.month + '월 ' + first.day + '일 ~ ' + last.month + '월 ' + last.day + '일';
  } else {
    const p = parseDue(dates[0]);
    spanLabel.textContent = p.year + '년 ' + p.month + '월';
  }

  let shownCount = 0;
  daysList.replaceChildren(...dates.map(function (due) {
    const items = orderTodos(todos.filter(function (t) {
      return t.due === due && (!word || t.text.toLowerCase().includes(word));
    }));
    // 찾는 중이거나 "할 일 있는 날짜만"을 골랐을 때는 할 일이 있는 날짜만 보인다
    if ((word || daysFilter === 'has') && items.length === 0) return null;
    shownCount += 1;

    const group = document.createElement('div');
    group.className = 'day-group';

    // 제목 줄: 왼쪽 부분을 누르면 접고 펴고, 오른쪽 "보기 ›"를 누르면 그 날짜의 할 일 탭으로 간다
    const folded = isFolded(due);
    const head = document.createElement('div');
    head.className = 'day-head' + (items.length === 0 ? ' empty-day' : '');
    head.dataset.date = due;
    head.style.setProperty('--date-color', dateColor(due));

    const toggle = makeButton('', 'day-toggle', function () {
      foldChoices.set(due, !isFolded(due));
      render();
    });
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    if (items.length === 0) {
      toggle.disabled = true;
      arrow.textContent = '·';
    } else {
      toggle.setAttribute('aria-expanded', String(!folded));
      arrow.textContent = folded ? '▸' : '▾';
    }
    const title = document.createElement('span');
    title.textContent = dateText(due) + ' · ' + ddayText(due);
    const total = document.createElement('span');
    total.className = 'count';
    total.textContent = items.length + '개';
    toggle.append(arrow, title, total);

    const go = makeButton('보기 ›', 'day-go', function () { openDay(due); });
    go.setAttribute('aria-label', dateText(due) + ' 할 일 보기');
    head.append(toggle, go);

    group.append(head);
    if (items.length > 0 && !folded) {
      const itemList = document.createElement('ul');
      itemList.append(...items.map(function (t) { return makeItem(t); }));
      group.append(itemList);
    }
    return group;
  }).filter(Boolean));

  daysEmpty.textContent = word ? '검색 결과가 없어요' : '할 일이 있는 날짜가 없어요';
  daysEmpty.hidden = shownCount > 0;
  daysFilterButtons.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.days === daysFilter));
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
  renderOptions();
  const title = pageTitleText();
  pageTitle.textContent = title;
  document.title = title;
}

// 화면 맨 위 제목: 할 일 탭은 이름이 있으면 "○○의 할 일 목록"
function pageTitleText() {
  if (activeTab === 'options') {
    if (optionsPage === 'themes') return '테마';
    if (optionsPage === 'preview') return '테마 미리보기';
    return '옵션';
  }
  if (activeTab === 'todo') return userName ? userName + '의 할 일 목록' : '할 일 목록';
  return TAB_TITLES[activeTab];
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

/* 저장소 읽고 쓰기(막힌 브라우저에서도 화면은 동작한다) */
function storeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function storeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // 저장이 막혀도 이번 화면에서는 바뀐다
  }
}

function readSkin() {
  const saved = storeGet(SKIN_KEY);
  return THEMES.some(function (t) { return t.id === saved; }) ? saved : DEFAULT_SKIN;
}

function readName() {
  return (storeGet(NAME_KEY) || '').trim();
}

/* 다크 모드: 저장된 선택이 없으면 기기 설정을 따른다 */
function readTheme() {
  const saved = storeGet(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 지금 고른 테마와 모드의 색·모양을 화면 전체에 적용한다
function applyLook() {
  const mode = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const vars = themeVars(findTheme(skinId), mode);
  Object.keys(vars).forEach(function (name) {
    document.documentElement.style.setProperty(name, vars[name]);
  });
  document.documentElement.style.colorScheme = mode;
  document.documentElement.dataset.skin = skinId;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.textContent = dark ? '☀️' : '🌙';
  themeButton.setAttribute('aria-label', dark ? '밝은 모드로 바꾸기' : '다크 모드로 바꾸기');
  applyLook();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeSet(THEME_KEY, next);
  render();
}

function setSkin(id, fromRemote) {
  skinId = id;
  storeSet(SKIN_KEY, id);
  applyLook();
  if (!fromRemote) queueSetting('skin', id, 0);
}

/* 옵션 화면: 이름, 테마 목록, 테마 미리보기 */
function openOptions() {
  if (activeTab !== 'options') lastTab = activeTab;
  activeTab = 'options';
  optionsPage = 'main';
  render();
}

function optionsBack() {
  if (optionsPage === 'preview') optionsPage = 'themes';
  else if (optionsPage === 'themes') optionsPage = 'main';
  else activeTab = lastTab;
  render();
}

function buildPreview(theme, mode) {
  const box = document.createElement('div');
  box.className = 'preview';
  const vars = themeVars(theme, mode);
  Object.keys(vars).forEach(function (name) { box.style.setProperty(name, vars[name]); });
  box.innerHTML =
    '<div class="pv-top"><span class="pv-title">할 일 목록</span><span>' + (mode === 'dark' ? '☀️' : '🌙') + '</span></div>' +
    '<div class="pv-add"><span class="pv-input">할 일을 적어 보세요</span><span class="pv-btn">추가</span></div>' +
    '<div class="pv-row" style="--date-color: var(--dc0)"><i class="pv-check"></i><span>장보기</span><b class="pv-star">★</b></div>' +
    '<div class="pv-row" style="--date-color: var(--dc1)"><i class="pv-check"></i><span>운동 30분</span><b>☆</b></div>' +
    '<div class="pv-row done" style="--date-color: var(--dc2)"><i class="pv-check on"></i><span>책 읽기</span><b>☆</b></div>' +
    '<div class="pv-tabs"><span class="on">✅ 할 일</span><span>📅</span><span>📋</span></div>';
  return box;
}

function renderOptions() {
  optMain.hidden = optionsPage !== 'main';
  optThemes.hidden = optionsPage !== 'themes';
  optPreview.hidden = optionsPage !== 'preview';
  settingsButton.setAttribute('aria-pressed', String(activeTab === 'options'));
  if (activeTab !== 'options') return;

  byId('opt-theme-name').textContent = findTheme(skinId).name;
  if (document.activeElement !== nameInput) nameInput.value = userName;

  if (optionsPage === 'themes') {
    themeList.replaceChildren(...THEMES.map(function (theme) {
      const card = makeButton('', 'theme-card', function () {
        previewId = theme.id;
        optionsPage = 'preview';
        render();
      });
      card.dataset.theme = theme.id;
      card.setAttribute('aria-label', theme.name + ' 미리보기');
      const swatches = document.createElement('span');
      swatches.className = 'swatches';
      [theme.light.bg, theme.light.a1, theme.light.a2, theme.dark.bg, theme.dark.a1, theme.dc[0]].forEach(function (color) {
        const dot = document.createElement('i');
        dot.style.background = color;
        swatches.append(dot);
      });
      const info = document.createElement('span');
      info.className = 'info';
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = theme.name;
      const desc = document.createElement('span');
      desc.className = 'desc';
      desc.textContent = theme.desc;
      info.append(name, desc);
      card.append(swatches, info);
      if (theme.id === skinId) {
        const check = document.createElement('span');
        check.className = 'check';
        check.textContent = '✓';
        card.append(check);
      }
      return card;
    }));
  }

  if (optionsPage === 'preview') {
    const theme = findTheme(previewId);
    byId('preview-name').textContent = theme.name;
    byId('preview-count').textContent = (THEMES.indexOf(theme) + 1) + ' / ' + THEMES.length;
    byId('preview-desc').textContent = theme.desc;
    byId('preview-light').replaceChildren(buildPreview(theme, 'light'));
    byId('preview-dark').replaceChildren(buildPreview(theme, 'dark'));
    byId('preview-choose').textContent = theme.id === skinId ? '지금 쓰는 테마예요' : '이 테마로 선택';
    byId('preview-choose').disabled = theme.id === skinId;
  }
}

// 미리보기에서 이전·다음 테마로 넘겨 본다(끝에서는 처음/끝으로 이어진다)
function movePreview(step) {
  const index = THEMES.findIndex(function (t) { return t.id === previewId; });
  previewId = THEMES[(index + step + THEMES.length) % THEMES.length].id;
  render();
}

function chooseTheme() {
  const theme = findTheme(previewId);
  const before = skinId;
  setSkin(theme.id);
  optionsPage = 'main';
  render();
  showToast('테마를 바꿨어요: ' + theme.name, function () {
    setSkin(before);
    return '되돌렸어요: 테마 → ' + findTheme(before).name;
  });
}

/* 버튼과 칸에 동작 달기 */
enableDrag(list);
undoButton.addEventListener('click', undo);
themeButton.addEventListener('click', toggleTheme);
settingsButton.addEventListener('click', function () {
  if (activeTab === 'options') {
    activeTab = lastTab;
    render();
  } else {
    openOptions();
  }
});
byId('opt-back').addEventListener('click', optionsBack);
byId('opt-theme-row').addEventListener('click', function () {
  optionsPage = 'themes';
  render();
});
byId('preview-prev').addEventListener('click', function () { movePreview(-1); });
byId('preview-next').addEventListener('click', function () { movePreview(1); });
byId('preview-choose').addEventListener('click', chooseTheme);
nameInput.addEventListener('input', function () {
  userName = nameInput.value.trim();
  storeSet(NAME_KEY, userName);
  queueSetting('name', userName, 600);
  render();
});
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
spanButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    spanMode = b.dataset.span;
    render();
  });
});
daysFilterButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    daysFilter = b.dataset.days;
    render();
  });
});
byId('span-prev').addEventListener('click', function () { moveSpan(-1); });
byId('span-next').addEventListener('click', function () { moveSpan(1); });
byId('span-today').addEventListener('click', function () {
  spanAnchor = todayString();
  render();
});
clearButton.addEventListener('click', clearDone);
tabButtons.forEach(function (b) {
  b.addEventListener('click', function () { switchTab(b.dataset.tab); });
});
byId('cal-prev').addEventListener('click', function () { moveMonth(-1); });
byId('cal-next').addEventListener('click', function () { moveMonth(1); });
byId('cal-today').addEventListener('click', goToday);
byId('confirm-cancel').addEventListener('click', function () { byId('confirm-dialog').close(); });
byId('confirm-ok').addEventListener('click', function () {
  const action = confirmAction;
  confirmAction = null;
  byId('confirm-dialog').close();
  if (action) action();
});
byId('confirm-dialog').addEventListener('click', function (e) {
  if (e.target === byId('confirm-dialog')) byId('confirm-dialog').close();
});
byId('confirm-dialog').addEventListener('close', function () { confirmAction = null; });
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
byId('detail-pending-clear').addEventListener('click', function () { setPending(null, ''); });
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
detail.addEventListener('close', function () {
  detailId = null;
  pendingDue = null;
  pendingLabel = '';
});

/* 설정(이름·테마)은 settings 표에도 저장한다. 글자를 칠 때마다 보내지 않게 조금 모아서 보낸다 */
const settingTimers = {};
let settingsChain = Promise.resolve();
let settingsNoticed = false;

function queueSetting(key, value, wait) {
  clearTimeout(settingTimers[key]);
  settingTimers[key] = setTimeout(function () {
    settingsChain = settingsChain.then(function () {
      if (!settingsReady) return undefined;
      return db('POST', 'settings?on_conflict=key', [{ key: key, value: value }], { Prefer: 'resolution=merge-duplicates' });
    }).catch(handleSettingsError);
  }, wait);
}

function handleSettingsError(error) {
  if (isMissingTable(error)) settingsReady = false;
  if (settingsNoticed) return;
  settingsNoticed = true;
  notify('이름·테마를 Supabase에 저장하지 못했어요(' + describeError(error) + '). 이 브라우저에는 저장돼요');
}

async function loadSettings() {
  try {
    const rows = await db('GET', 'settings?select=key,value');
    const saved = {};
    rows.forEach(function (row) { saved[row.key] = row.value; });
    if (Object.prototype.hasOwnProperty.call(saved, 'name')) {
      userName = String(saved.name || '').trim();
      storeSet(NAME_KEY, userName);
    } else if (userName) {
      queueSetting('name', userName, 0);
    }
    if (THEMES.some(function (t) { return t.id === saved.skin; })) {
      if (saved.skin !== skinId) setSkin(saved.skin, true);
    } else if (skinId !== DEFAULT_SKIN) {
      queueSetting('skin', skinId, 0);
    }
  } catch (error) {
    handleSettingsError(error);
  }
}

/* 시작할 때 표에서 할 일을 불러온다 */
async function fetchTodoRows() {
  try {
    const rows = await db('GET', 'todos?select=' + TODO_COLUMNS + '&order=sort_order.asc.nullslast,created_at.desc');
    fullSchema = true;
    return rows;
  } catch (error) {
    if (!isMissingColumn(error)) throw error;
    // 새 칸(due·important·memo·sort_order·sample)이 아직 없는 표: 글과 완료만 저장한다
    fullSchema = false;
    notify('Supabase 표에 새 칸(due, important, memo, sort_order, sample)이 없어서 글과 완료만 저장돼요. 나머지는 새로고침하면 사라져요');
    return db('GET', 'todos?select=' + BASIC_COLUMNS + '&order=created_at.desc');
  }
}

function sortByOrder(list) {
  return list.slice().sort(function (a, b) {
    const x = a.order === null ? Infinity : a.order;
    const y = b.order === null ? Infinity : b.order;
    return x === y ? 0 : x < y ? -1 : 1;
  });
}

async function loadTodos() {
  const rows = await fetchTodoRows();
  const fetched = rows.map(fromRow);
  const fixes = [];

  // 순서가 비어 있는 예전 할 일은 만든 순서(표가 정렬해 준 순서) 그대로 맨 아래에 붙인다
  let next = fetched.reduce(function (max, t) { return t.order !== null && t.order > max ? t.order : max; }, -1) + 1;
  rows.forEach(function (row, i) {
    const todo = fetched[i];
    const needsOrder = todo.order === null;
    const needsDue = fullSchema && !validDate(row.due);
    if (needsOrder) {
      todo.order = next;
      next += 1;
    }
    if (fullSchema && (needsOrder || needsDue)) fixes.push(todo);
  });

  // 불러오는 동안 새로 만든 할 일은 그대로 남기고, 예전에 복사해 둔 목록에만 있던 것(다른 곳에서 이미 지운 것)은 버린다
  const knownIds = new Set(fetched.map(function (t) { return String(t.id); }));
  const local = todos.filter(function (t) { return !knownIds.has(String(t.id)) && (isTemp(t.id) || createdHere.has(t)); });
  todos = sortByOrder(fetched.concat(local));
  if (todos.some(function (t, i) { return i > 0 && t.order <= todos[i - 1].order; })) renormalize();
  fixes.forEach(function (t) { persistUpdate(t, ['order', 'due']); });

  save();
  render();
  if (fullSchema) importLegacy();
}

// 예전에 이 브라우저에만 저장했던 할 일을 처음 한 번만 표로 옮긴다
function importLegacy() {
  if (storeGet(IMPORTED_KEY)) return;
  const old = readLegacy();
  const have = new Set(todos.map(function (t) { return t.text + '|' + t.due; }));
  const fresh = old.filter(function (t) { return !have.has(t.text + '|' + t.due); });
  if (!fresh.length) {
    storeSet(IMPORTED_KEY, '1');
    return;
  }
  const last = todos.length ? todos[todos.length - 1].order : -1;
  fresh.forEach(function (t, i) { t.order = last + 1 + i; });
  todos.push(...fresh);
  save();
  render();
  persistInsert(fresh).then(function () {
    storeSet(IMPORTED_KEY, '1');
    notify('이 브라우저에 있던 할 일 ' + fresh.length + '개를 Supabase로 옮겼어요');
  }).catch(function () {
    // 실패하면 표시를 남기지 않아서 다음에 다시 시도한다
  });
}

async function start() {
  try {
    await loadTodos();
  } catch (error) {
    document.documentElement.dataset.loaded = 'error';
    reportError(error);
  }
  await loadSettings();
  if (document.documentElement.dataset.loaded !== 'error') document.documentElement.dataset.loaded = 'true';
  render();
}

todayText.textContent = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
applyTheme(readTheme());
render();
start();
