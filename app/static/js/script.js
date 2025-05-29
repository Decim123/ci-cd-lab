document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const itemTypeSelect = document.getElementById('item-type');
    const addItemForm = document.getElementById('add-item-form');
    const itemsList = document.getElementById('items-list');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const editItemForm = document.getElementById('edit-item-form');
    const editFieldsContainer = document.getElementById('edit-fields');
    
    // Показать/скрыть специфичные поля при изменении типа товара
    itemTypeSelect.addEventListener('change', function() {
        document.querySelectorAll('.item-type-fields').forEach(el => {
            el.classList.add('d-none');
        });
        
        if (this.value) {
            document.getElementById(`${this.value}-fields`).classList.remove('d-none');
        }
    });
    
    // Загрузка товаров при загрузке страницы
    loadItems();
    
    // Обработка добавления товара
    addItemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addItem();
    });
    
    // Обработка редактирования товара
    editItemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateItem();
    });
    
    // Функция загрузки товаров
    function loadItems() {
        fetch('/items/')
            .then(response => response.json())
            .then(items => {
                itemsList.innerHTML = '';
                for (const [id, item] of Object.entries(items)) {
                    addItemToTable(id, item);
                }
            })
            .catch(error => console.error('Ошибка загрузки товаров:', error));
    }
    
    // Функция добавления товара в таблицу
    function addItemToTable(id, item) {
        const row = document.createElement('tr');
        row.dataset.id = id;
        
        // Определение типа товара
        let type = 'Неизвестно';
        if (item.author) type = 'Книга';
        else if (item.size) type = 'Одежда';
        else if (item.voltage) type = 'Электроника';
        
        row.innerHTML = `
            <td>${id}</td>
            <td>${type}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-warning edit-btn" data-id="${id}">Изменить</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${id}">Удалить</button>
            </td>
        `;
        
        itemsList.appendChild(row);
        
        // Назначение обработчиков событий
        row.querySelector('.edit-btn').addEventListener('click', function() {
            openEditModal(this.dataset.id);
        });
        
        row.querySelector('.delete-btn').addEventListener('click', function() {
            deleteItem(this.dataset.id);
        });
    }
    
    // Функция добавления товара
    function addItem() {
        const itemType = itemTypeSelect.value;
        const data = {
            name: document.getElementById('name').value,
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('description').value || null
        };
        
        // Добавление специфичных полей
        if (itemType === 'book') {
            data.author = document.getElementById('author').value;
            data.pages = parseInt(document.getElementById('pages').value);
        } else if (itemType === 'clothing') {
            data.size = document.getElementById('size').value;
            data.material = document.getElementById('material').value;
        } else if (itemType === 'electronics') {
            data.voltage = parseInt(document.getElementById('voltage').value);
            data.warranty = parseInt(document.getElementById('warranty').value);
        }
        
        fetch(`/${itemType}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            addItemToTable(result.id, result);
            addItemForm.reset();
            alert('Товар успешно добавлен!');
        })
        .catch(error => {
            console.error('Ошибка добавления товара:', error);
            alert('Ошибка при добавлении товара');
        });
    }
    
    // Функция открытия модального окна редактирования
    function openEditModal(itemId) {
        fetch(`/items/${itemId}`)
            .then(response => response.json())
            .then(itemData => {
                const item = itemData.data;
                document.getElementById('edit-item-id').value = itemId;
                
                // Определение типа товара
                let type = '';
                if (item.author) type = 'book';
                else if (item.size) type = 'clothing';
                else if (item.voltage) type = 'electronics';
                
                // Создание полей для редактирования
                let fieldsHtml = `
                    <div class="mb-3">
                        <label class="form-label">Название</label>
                        <input type="text" class="form-control" name="name" value="${item.name}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Цена</label>
                        <input type="number" step="0.01" class="form-control" name="price" value="${item.price}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Описание</label>
                        <textarea class="form-control" name="description">${item.description || ''}</textarea>
                    </div>
                `;
                
                // Добавление специфичных полей
                if (type === 'book') {
                    fieldsHtml += `
                        <div class="mb-3">
                            <label class="form-label">Автор</label>
                            <input type="text" class="form-control" name="author" value="${item.author}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Страницы</label>
                            <input type="number" class="form-control" name="pages" value="${item.pages}">
                        </div>
                    `;
                } else if (type === 'clothing') {
                    fieldsHtml += `
                        <div class="mb-3">
                            <label class="form-label">Размер</label>
                            <select class="form-select" name="size">
                                <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
                                <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
                                <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
                                <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Материал</label>
                            <input type="text" class="form-control" name="material" value="${item.material}">
                        </div>
                    `;
                } else if (type === 'electronics') {
                    fieldsHtml += `
                        <div class="mb-3">
                            <label class="form-label">Напряжение</label>
                            <input type="number" class="form-control" name="voltage" value="${item.voltage}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Гарантия</label>
                            <input type="number" class="form-control" name="warranty" value="${item.warranty}">
                        </div>
                    `;
                }
                
                editFieldsContainer.innerHTML = fieldsHtml;
                editModal.show();
            })
            .catch(error => {
                console.error('Ошибка загрузки данных товара:', error);
                alert('Ошибка при загрузке данных товара');
            });
    }
    
    // Функция обновления товара
    function updateItem() {
        const itemId = document.getElementById('edit-item-id').value;
        const formData = new FormData(editItemForm);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (value !== '') {
                // Преобразование числовых полей
                if (key === 'price' || key === 'pages' || key === 'voltage' || key === 'warranty') {
                    data[key] = parseFloat(value);
                } else {
                    data[key] = value;
                }
            }
        }
        
        fetch(`/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                editModal.hide();
                loadItems();
                alert('Товар успешно обновлен!');
            } else {
                throw new Error('Ошибка обновления товара');
            }
        })
        .catch(error => {
            console.error('Ошибка обновления товара:', error);
            alert('Ошибка при обновлении товара');
        });
    }
    
    // Функция удаления товара
    function deleteItem(itemId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            fetch(`/items/${itemId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    // Удаление строки из таблицы
                    document.querySelector(`#items-list tr[data-id="${itemId}"]`).remove();
                    alert('Товар успешно удален!');
                } else {
                    throw new Error('Ошибка удаления товара');
                }
            })
            .catch(error => {
                console.error('Ошибка удаления товара:', error);
                alert('Ошибка при удалении товара');
            });
        }
    }
});