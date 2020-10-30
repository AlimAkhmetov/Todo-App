(function () {
	// Создание будущей разметки:
	// Создаем и возврващаем заголовок приложения
	function createAppTitle(title) {
		let appTitle = document.createElement('h2');
		appTitle.innerHTML = title;
		return appTitle
	};

	// Создаем и возвращаем форму и её элементы
	function createTodoItemForm() {

		// Создаем элементы формы
		let form = document.createElement('form');
		let input = document.createElement('input');
		let buttonWrapper = document.createElement('div');
		let button = document.createElement('button');

		// Добавляем классы bootstrap и значения
		form.classList.add('input-group', 'mb-3');
		input.classList.add('form-control');
		input.placeholder = 'Введите название нового дело';
		buttonWrapper.classList.add('input-group-append');
		button.classList.add('btn', 'btn-primary');
		button.textContent = 'Добавить дело';

		// Добавляем атрибут 'disavle' к кнопки формы
		button.setAttribute('disabled', 'disabled');

		// Вкладываем элементы формы в форму
		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

		return {
			form,
			input,
			button
		}
	};

	// Создаем и возвращаем список будующих элементов
	function createTodoList() {
		let list = document.createElement('ul');
		list.classList.add('list-group');
		return list
	};

	// Создаем элемент списка:
	function createTodoItem(name, option = null) {
		// Создаем элемент списка
		let item = document.createElement('li');

		// Создаем кнопки в элементе
		let buttonGroup = document.createElement('div');
		let doneButton = document.createElement('button');
		let deleteButton = document.createElement('button');

		// Устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части (с помощью flex)
		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		item.textContent = name;

		// Проверяем функцию на наличие второго атрибута (option = true/fasle)
		if (option === true) {
			item.classList.toggle('list-group-item-success');
		}
		// Добавляем классы bootstrap
		buttonGroup.classList.add('btn-group', 'btn-group-sm');
		doneButton.classList.add('btn', 'btn-success');
		doneButton.textContent = 'Готово';
		deleteButton.classList.add('btn', 'btn-danger');
		deleteButton.textContent = 'Удалить';

		// Вкладываем кнопки в элемент
		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(buttonGroup);

		return {
			item,
			doneButton,
			deleteButton
		};
	};

	// Создание готового приложения:
	function createTodoApp(container, title = 'Список дел:', todoItems = null, localStorageKey) {

		// Создаем элементы всего приложения
		let todoAppTitle = createAppTitle(title);
		let todoItemForm = createTodoItemForm();
		let todoList = createTodoList();

		// Добавляем разметку в нужный нам html блок
		container.append(todoAppTitle);
		container.append(todoItemForm.form);
		container.append(todoList);

		// Проверяем пустой ли массив в localStorage или нет (если да: создаем пустой массив, иначе обновляем localStorage)
		let itemsArray = localStorage.getItem(localStorageKey)
			? JSON.parse(localStorage.getItem(localStorageKey))
			: [...todoItems];

		// Добавляем в localStorage массив
		localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));

		// После перезагрузки страницы добавляем ранее созданные элементы
		itemsArray.forEach(function (item) {
			let todoItem = createTodoItem(item.name);
			todoList.append(todoItem.item);
			if (item.done === true) {
				todoItem.item.classList.add('list-group-item-success');
			}

			// Добавляем обработчики событий на кнопки 'готово' и 'удалить'
			todoItem.doneButton.addEventListener('click', function () {
				todoItem.item.classList.toggle('list-group-item-success');
				if (todoItem.item.classList.contains('list-group-item-success')) {
					item.done = true;
					localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));
				}
				else {
					item.done = false;
					localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));
				}
			});

			todoItem.deleteButton.addEventListener('click', function () {
				if (confirm('Вы уверены?')) {
					itemsArray.splice(itemsArray.indexOf(item), 1);
					localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));
					todoItem.item.remove();
				}
			});
		});

		// Добавляем атрибут disable к кнопки формы, если пользователь ничего не ввел
		todoItemForm.input.oninput = function () {
			if (!todoItemForm.input.value || todoItemForm.input.value.length === 0) {
				todoItemForm.button.setAttribute('disabled', 'disabled');
			} else {
				todoItemForm.button.removeAttribute('disabled');
			}
		}

		// Добавляем обработчик события, при нажатии на кнопку (или через Enter)
		todoItemForm.form.addEventListener('submit', function (e) {

			// Сбрасываем стандартное действие браузера (перезагрузка страницы)
			e.preventDefault();

			// Если пользователь ничего не ввел, выдаем ошибку
			if (!todoItemForm.input.value) {
				return alert('Вы ничего не ввели');
			}

			// Создаем переменную и записываем в нее готовый элемент со значением, введенное пользовыателем
			let todoItem = createTodoItem(todoItemForm.input.value);

			// Создаем объект и записываем в него значение введенное пользователем
			let itemsObject = {};
			itemsObject.name = todoItemForm.input.value;
			itemsObject.done = false;

			// Добавляем в массив значения, введенные пользователем и записываем их в localStorage
			itemsArray.push(itemsObject);
			localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));

			// Добавляем новоый элемент
			todoList.append(todoItem.item);

			// Сбрасываем значение и добавляем атирбут disable
			todoItemForm.input.value = '';
			todoItemForm.button.setAttribute('disabled', 'disabled');

			// Добавляем обработчики событий на кнопки 'готово' и 'удалить'
			todoItem.doneButton.addEventListener('click', function () {
				todoItem.item.classList.toggle('list-group-item-success');
				if (todoItem.item.classList.contains('list-group-item-success')) {
					for (invaildItem of itemsArray) {
						if (invaildItem.name === itemsObject.name) {
							invaildItem.done = true;
							localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));
						}
					}
				} else {
					for (invaildItem of itemsArray) {
						if (invaildItem.name === itemsObject.name) {
							invaildItem.done = false;
							localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));
						}
					}
				}
			});

			todoItem.deleteButton.addEventListener('click', function () {
				if (confirm('Вы уверены?')) {
					for (invaildItem of itemsArray) {
						if (invaildItem.name === itemsObject.name) {
							let indexInvalidItem = itemsArray.indexOf(invaildItem);
							itemsArray.splice(indexInvalidItem, 1);
							localStorage.setItem(localStorageKey, JSON.stringify(itemsArray));
							todoItem.item.remove();
							break;
						}
					}
				}
			});
		});
	};

	// Создаем в глобальном объекте нашу функцию:
	window.createTodoApp = createTodoApp;
})();

