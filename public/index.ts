interface TapasItem {
  type: string;
  checked: boolean;
}

let tapasList: TapasItem[] = [];
const TAPAS_LIST_KEY = 'tapasList';

const formatLabel = (str: string) =>
  str
    .split('-')
    .map(word => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join(' ');

const formatItem = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/, '-');

const handleCheck = (e: Event) => {
  const { id, checked } = e.target as HTMLInputElement;
  const index = tapasList.findIndex(item => item.type === id);

  if (index > -1) {
    tapasList[index].checked = checked;
    localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));
  }
};

const buildTapasLi = (item: TapasItem) => {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = item.type;
  checkbox.id = item.type;
  checkbox.checked = item.checked;

  const label = document.createElement('label');
  label.textContent = formatLabel(item.type);
  label.htmlFor = checkbox.id;

  li.append(checkbox, label);
  return li;
};

const addItem = (e: Event) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const { value } = form.elements.namedItem('item') as HTMLInputElement;

  const item: TapasItem = { type: formatItem(value), checked: false };

  tapasList.push(item);
  localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));

  const li = buildTapasLi(item);
  const tapasUl = document.querySelector('.tapas-list ul');
  tapasUl.appendChild(li);

  form.reset();
};

const buildTapasListUl = (tapasList: TapasItem[]) => {
  const liNodes = tapasList.map(item => buildTapasLi(item));

  const ul = document.createElement('ul');
  ul.append(...liNodes);
  ul.addEventListener('change', handleCheck);

  return ul;
};

const buildAddItemForm = () => {
  const form = document.createElement('form');
  form.classList.add('add-item');

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'item';
  input.id = 'add-item-input';
  input.setAttribute('aria-label', 'enter item to add');

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+ Add Item';

  form.append(input, btn);
  form.addEventListener('submit', addItem);

  return form;
};

const paintTapasList = (tapasList: TapasItem[]) => {
  const newTapasListUl = buildTapasListUl(tapasList);
  const currentTapasList = document.querySelector<HTMLUListElement>(
    '.tapas-list ul'
  );
  currentTapasList.replaceWith(newTapasListUl);
};

const buildActionButtons = () => {
  const [checkAllButton, uncheckAllButton, clearAllButton] = [
    'check all',
    'uncheck all',
    'clear all'
  ].map(text => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    return button;
  });

  checkAllButton.addEventListener('click', e => {
    tapasList = tapasList.map(item => ({
      ...item,
      checked: true
    }));
    localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));
    paintTapasList(tapasList);
  });

  uncheckAllButton.addEventListener('click', e => {
    tapasList = tapasList.map(item => ({
      ...item,
      checked: false
    }));
    localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));
    paintTapasList(tapasList);
  });

  clearAllButton.addEventListener('click', e => {
    tapasList.length = 0;
    localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));
    paintTapasList(tapasList);
  });

  const container = document.createElement('div');
  container.classList.add('action-buttons');
  container.append(checkAllButton, uncheckAllButton, clearAllButton);
  return container;
};

const init = () => {
  const currentTapasList = document.querySelector<HTMLUListElement>(
    '.tapas-list ul'
  );
  const loading = document.createElement('p');
  loading.textContent = 'Loading ...';
  currentTapasList.replaceWith(loading);

  const storedList = localStorage.getItem(TAPAS_LIST_KEY);
  if (storedList) {
    tapasList = JSON.parse(storedList);
  } else {
    tapasList = [
      ...currentTapasList.querySelectorAll<HTMLInputElement>('input')
    ].map(input => ({
      type: input.id,
      checked: input.checked
    }));
    localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));
  }

  const tapasListUl = buildTapasListUl(tapasList);
  const addItemForm = buildAddItemForm();
  const actionButtons = buildActionButtons();
  loading.replaceWith(tapasListUl, addItemForm, actionButtons);
};

window.addEventListener('load', init);
