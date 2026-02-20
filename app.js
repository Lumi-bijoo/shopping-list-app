// Created: 2026-02-19 09:00
// Modified: 2026-02-20 - LocalStorage → Supabase 연동
// 쇼핑 리스트 앱 - Supabase 데이터베이스 기반

const SUPABASE_URL = 'https://wyesdaepjqebmgevhyll.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5ZXNkYWVwanFlYm1nZXZoeWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzY5NTksImV4cCI6MjA4NzExMjk1OX0.9kkJrS47pcO5W8P0FGtVb6N3Mt3lsTzGNQnYaqdoWt0';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('add-form');
const input = document.getElementById('item-input');
const listEl = document.getElementById('shopping-list');
const countEl = document.getElementById('item-count');
const emptyMsg = document.getElementById('empty-msg');
const clearBtn = document.getElementById('clear-completed-btn');

// Supabase에서 항목 불러오기
async function loadItems() {
  const { data, error } = await db
    .from('shopping_items')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
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
  checkbox.addEventListener('click', () => toggleItem(item.id, item.checked));

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
async function render() {
  try {
    const items = await loadItems();
    listEl.innerHTML = '';
    items.forEach(item => listEl.appendChild(createItemElement(item)));
    updateCount(items);
  } catch (error) {
    console.error('데이터 로딩 오류:', error);
  }
}

// 항목 추가
async function addItem(name) {
  const { error } = await db
    .from('shopping_items')
    .insert({ name: name.trim() });
  if (error) throw error;
  await render();
}

// 항목 체크/해제 토글
async function toggleItem(id, currentChecked) {
  const { error } = await db
    .from('shopping_items')
    .update({ checked: !currentChecked })
    .eq('id', id);
  if (error) throw error;
  await render();
}

// 항목 삭제
async function deleteItem(id) {
  const { error } = await db
    .from('shopping_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
  await render();
}

// 완료된 항목 모두 삭제
async function clearCompleted() {
  const { error } = await db
    .from('shopping_items')
    .delete()
    .eq('checked', true);
  if (error) throw error;
  await render();
}

// 이벤트 리스너
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  try {
    await addItem(value);
    input.value = '';
    input.focus();
  } catch (error) {
    console.error('항목 추가 오류:', error);
  }
});

clearBtn.addEventListener('click', async () => {
  try {
    await clearCompleted();
  } catch (error) {
    console.error('완료 항목 삭제 오류:', error);
  }
});

// 초기 렌더링
render();
input.focus();
