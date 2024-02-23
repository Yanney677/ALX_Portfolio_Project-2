window.addEventListener('load', () =>{
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTOdoForm = document.querySelector('#new-todo-form');
    
    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    })

    newTOdoForm.addEventListener('submit', e => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        }

        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos));

        e.target.reset();

        displayTodos();
    })
    
    displayTodos();
})

/* Function to display todos. */
function displayTodos () {
    /* Select the todo list element */
    const todoList = document.querySelector('#todo-list');

    // Clear the existing content of the todo list.
    todoList.innerHTML = '';

    /* Sort todos based on creation time using a custom sorting function */
    todos.sort((a, b) => a.createdAt - b.createdAt).forEach(todo => {
        /* Create HTML elements for each todo item. */
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item')

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        /* Set attributes and classes for the elements. */
        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');

        /* Set category-specific class for styling */
        if (todo.category == 'personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('business');
        }

        /* Add classes to other elements. */
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        /* Set HTML content for elements. */
        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        /* Append elements to the todo item. */
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        /* Append todo item to the todo list. */
        todoList.appendChild(todoItem);

        // Add 'done' class to todo item if it is marked as done.
        if(todo.done) {
            todoItem.classList.add('done');
        }

        // Event listener for checkbox to mark todo as done.
        input.addEventListener('click', e => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            /* Add or remove 'done' class based on the checkbox state. */
            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            /* Refresh the displayed todos. */
            displayTodos();
        })

        // Event listener for edit button to edit todo content.
        edit.addEventListener('click', e => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', e => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                // Refresh the displayed todos.
                displayTodos();
            })
        })

        /* Event listener for delete button to delete todo. */
        deleteButton.addEventListener('click', e => {
            // Filter out the deleted todo from the todos array.
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            /* Refresh the displayed todos. */
            displayTodos();
        })
    
    })
}
