// Created: 2026-02-19 09:00
// 쇼핑 리스트 앱 - LocalStorage 기반

const STORAGE_KEY = 'shopping-list';

const form = document.getElementById('add-form');
const input = document.getElementById('item-input');
const listEl = document.getElementById('shopping-list');
const countEl = document.getElementById('item-count');
const emptyMsg = document.getElementById('empty-msg');
const clearBtn = document.getElementById('clear-completed-btn');

// LocalStorage에서 리스트 불러오기
function loadItems() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// LocalStorage에 리스트 저장
function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// 항목 개수 업데이트
function updateCount(items) {
  const total = items.length;
  const completed = items.filter(item => item.checked).length;
  if (completed > 0) {
    countEl.textContent = `${total}개 항목 (${completed}개 완료)`;
  } else {
    countEl.textContent = `${total}개 항목`;
  }
  emptyMsg.classList.toggle('hidden', total > 0);
}

// 리스트 항목 DOM 생성
function createItemElement(item) {
  const li = document.createElement('li');
  li.className = 'list-item';
  li.dataset.id = item.id;

  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox' + (item.checked ? ' checked' : '');
  checkbox.addEventListener('click', () => toggleItem(item.id));

  const text = document.createElement('span');
  text.className = 'item-text' + (item.checked ? ' completed' : '');
  text.textContent = item.name;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '✕';
  deleteBtn.title = '삭제';
  deleteBtn.addEventListener('click', () => deleteItem(item.id));

  li.append(checkbox, text, deleteBtn);
  return li;
}

// 전체 리스트 렌더링
function render() {
  const items = loadItems();
  listEl.innerHTML = '';
  items.forEach(item => {
    listEl.appendChild(createItemElement(item));
  });
  updateCount(items);
}

// 항목 추가
function addItem(name) {
  const items = loadItems();
  items.push({
    id: Date.now().toString(),
    name: name.trim(),
    checked: false
  });
  saveItems(items);
  render();
}

// 항목 체크/해제 토글
function toggleItem(id) {
  const items = loadItems();
  const item = items.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    saveItems(items);
    render();
  }
}

// 항목 삭제
function deleteItem(id) {
  const items = loadItems().filter(i => i.id !== id);
  saveItems(items);
  render();
}

// 완료된 항목 모두 삭제
function clearCompleted() {
  const items = loadItems();
  const remaining = items.filter(i => !i.checked);
  if (remaining.length === items.length) return;
  saveItems(remaining);
  render();
}

// 이벤트 리스너
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addItem(value);
  input.value = '';
  input.focus();
});

clearBtn.addEventListener('click', clearCompleted);

// 초기 렌더링
render();
input.focus();
