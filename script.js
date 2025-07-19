let draggedTask = null;
        let currentColumn = null;
        let taskId = 0;

        // Sample data
        const sampleTasks = {
            backlog: [
                {
                    id: 1,
                    title: "Build UI kit component library",
                    description: "Build a comprehensive UI kit component library for the project",
                    priority: "high",
                    tag: "design",
                    assignee: "JS"
                },
                {
                    id: 2,
                    title: "Build design system",
                    description: "Create a comprehensive design system for consistency",
                    priority: "medium",
                    tag: "design",
                    assignee: "AD"
                },
                {
                    id: 3,
                    title: "Build settings UI",
                    description: "Design and implement the settings interface",
                    priority: "low",
                    tag: "design",
                    assignee: "MK"
                }
            ],
            todo: [
                {
                    id: 4,
                    title: "API integration with backend",
                    description: "Integrate frontend with backend API endpoints",
                    priority: "high",
                    tag: "development",
                    assignee: "RK"
                },
                {
                    id: 5,
                    title: "Advanced search functionality",
                    description: "Implement advanced search and filtering options",
                    priority: "medium",
                    tag: "development",
                    assignee: "SP"
                },
                {
                    id: 6,
                    title: "Design onboarding flow",
                    description: "Create user onboarding experience design",
                    priority: "low",
                    tag: "design",
                    assignee: "UI"
                }
            ],
            "in-progress": [
                {
                    id: 7,
                    title: "Responsive design implementation",
                    description: "Make the application fully responsive across all devices",
                    priority: "high",
                    tag: "development",
                    assignee: "DV"
                },
                {
                    id: 8,
                    title: "Performance optimization",
                    description: "Optimize application performance and loading times",
                    priority: "medium",
                    tag: "development",
                    assignee: "PO"
                },
                {
                    id: 9,
                    title: "Create rapid prototypes",
                    description: "Build quick prototypes for user testing",
                    priority: "low",
                    tag: "design",
                    assignee: "PR"
                }
            ],
            done: [
                {
                    id: 10,
                    title: "User authentication system",
                    description: "Implement secure user login and registration",
                    priority: "high",
                    tag: "development",
                    assignee: "AU"
                },
                {
                    id: 11,
                    title: "Database schema design",
                    description: "Design and implement the database schema structure",
                    priority: "medium",
                    tag: "development",
                    assignee: "DB"
                },
                {
                    id: 12,
                    title: "Market research analysis",
                    description: "Complete market research and competitive analysis",
                    priority: "low",
                    tag: "testing",
                    assignee: "MR"
                }
            ]
        };

        // Initialize the app
        function init() {
            loadTasks();
            setupDragAndDrop();
            updateColumnCounts();
        }

        // Load tasks into columns
        function loadTasks() {
            Object.keys(sampleTasks).forEach(column => {
                const tasksContainer = document.getElementById(`${column}-tasks`);
                tasksContainer.innerHTML = '';
                
                sampleTasks[column].forEach(task => {
                    const taskElement = createTaskElement(task);
                    tasksContainer.appendChild(taskElement);
                });
            });
        }

        // Create task element
        function createTaskElement(task) {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.draggable = true;
            taskDiv.dataset.taskId = task.id;
            
            const assigneeInitials = task.assignee || 'UN';
            
            taskDiv.innerHTML = `
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-tags">
                    <span class="tag ${task.tag}">${task.tag}</span>
                </div>
                <div class="task-footer">
                    <div class="task-priority">
                        <div class="priority-dot priority-${task.priority}"></div>
                        <span>${task.priority}</span>
                    </div>
                    <div class="task-assignee">${assigneeInitials}</div>
                </div>
            `;
            
            return taskDiv;
        }

        // Setup drag and drop
        function setupDragAndDrop() {
            const tasks = document.querySelectorAll('.task');
            const columns = document.querySelectorAll('.column');
            
            tasks.forEach(task => {
                task.addEventListener('dragstart', handleDragStart);
                task.addEventListener('dragend', handleDragEnd);
            });
            
            columns.forEach(column => {
                column.addEventListener('dragover', handleDragOver);
                column.addEventListener('drop', handleDrop);
                column.addEventListener('dragenter', handleDragEnter);
                column.addEventListener('dragleave', handleDragLeave);
            });
        }

        function handleDragStart(e) {
            draggedTask = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
            draggedTask = null;
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }

        function handleDragEnter(e) {
            this.classList.add('drag-over');
        }

        function handleDragLeave(e) {
            this.classList.remove('drag-over');
        }

        function handleDrop(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedTask) {
                const targetColumn = this.dataset.column;
                const sourceColumn = findTaskColumn(draggedTask.dataset.taskId);
                
                if (targetColumn !== sourceColumn) {
                    moveTask(draggedTask.dataset.taskId, sourceColumn, targetColumn);
                    const tasksContainer = this.querySelector('.tasks');
                    tasksContainer.appendChild(draggedTask);
                    updateColumnCounts();
                }
            }
        }

        function findTaskColumn(taskId) {
            for (let column in sampleTasks) {
                if (sampleTasks[column].find(task => task.id == taskId)) {
                    return column;
                }
            }
            return null;
        }

        function moveTask(taskId, sourceColumn, targetColumn) {
            const taskIndex = sampleTasks[sourceColumn].findIndex(task => task.id == taskId);
            if (taskIndex > -1) {
                const task = sampleTasks[sourceColumn].splice(taskIndex, 1)[0];
                sampleTasks[targetColumn].push(task);
            }
        }

        function updateColumnCounts() {
            Object.keys(sampleTasks).forEach(column => {
                const count = sampleTasks[column].length;
                const columnElement = document.querySelector(`[data-column="${column}"]`);
                const countElement = columnElement.querySelector('.column-count');
                countElement.textContent = count;
            });
        }

        // Modal functions
        function openModal(column = null) {
            currentColumn = column;
            const modal = document.getElementById('taskModal');
            modal.style.display = 'block';
            
            // Reset form
            document.getElementById('taskForm').reset();
            
            // Focus on title input
            document.getElementById('taskTitle').focus();
        }

        function closeModal() {
            const modal = document.getElementById('taskModal');
            modal.style.display = 'none';
            currentColumn = null;
        }

        // Handle form submission
        document.getElementById('taskForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const priority = document.getElementById('taskPriority').value;
            const tag = document.getElementById('taskTag').value;
            const assignee = document.getElementById('taskAssignee').value;
            
            const newTask = {
                id: ++taskId + 100,
                title,
                description,
                priority,
                tag,
                assignee: assignee.substring(0, 2).toUpperCase() || 'UN'
            };
            
            const targetColumn = currentColumn || 'backlog';
            sampleTasks[targetColumn].push(newTask);
            
            // Add task to DOM
            const taskElement = createTaskElement(newTask);
            const tasksContainer = document.getElementById(`${targetColumn}-tasks`);
            tasksContainer.appendChild(taskElement);
            
            // Setup drag and drop for new task
            taskElement.addEventListener('dragstart', handleDragStart);
            taskElement.addEventListener('dragend', handleDragEnd);
            
            updateColumnCounts();
            closeModal();
        });

        // Theme toggle
        function toggleTheme() {
            document.body.classList.toggle('light-mode');
            const themeText = document.querySelector('.theme-toggle span');
            themeText.textContent = document.body.classList.contains('light-mode') ? 'Light mode' : 'Dark mode';
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            const modal = document.getElementById('taskModal');
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);