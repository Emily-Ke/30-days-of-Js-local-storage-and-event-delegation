let tapasList = [];
const TAPAS_LIST_KEY = 'tapasList';

const formatLabel = str =>
  str
    .split('-')
    .map(word => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join(' ');

const formatItem = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/, '-');

const handleCheck = e => {
  const { id, checked } = e.target;
  const index = tapasList.findIndex(item => item.type === id);

  if (index > -1) {
    tapasList[index].checked = checked;
    localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));
  }
};

const buildTapasLi = item => {
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

const addItem = e => {
  e.preventDefault();

  const item = { type: formatItem(e.target.item.value), checked: false };

  tapasList.push(item);
  localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));

  const li = buildTapasLi(item);
  const tapasUl = document.querySelector('.tapas-list ul');
  tapasUl.appendChild(li);

  e.target.reset();
};

const buildTapasListUl = tapasList => {
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
  input.id = 'add-item-imput';
  input.setAttribute('aria-label', 'enter item to add');

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+ Add Item';

  form.append(input, btn);
  form.addEventListener('submit', addItem);

  return form;
};

const init = () => {
  const storedList = localStorage.getItem(TAPAS_LIST_KEY);
  if (storedList) {
    tapasList = JSON.parse(storedList);
  } else {
    tapasList = [...document.querySelectorAll('.tapas-list input')].map(
      input => ({
        type: input.id,
        checked: input.checked
      })
    );
    localStorage.setItem(TAPAS_LIST_KEY, JSON.stringify(tapasList));
  }

  const tapasListUl = buildTapasListUl(tapasList);
  const addItemForm = buildAddItemForm();
  const currentTapasList = document.querySelector('.tapas-list ul');
  currentTapasList.replaceWith(tapasListUl, addItemForm);
};

window.addEventListener('load', init);
