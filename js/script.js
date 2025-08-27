// Configuração das categorias com cores e ícones
const categoryConfig = {
  geral: { prefix: 'category-geral', activeTab: 'bg-geral', checkbox: 'category-geral', icon: '✨', title: 'Visão Geral' },
  trabalho: { prefix: 'category-trabalho', activeTab: 'bg-trabalho', checkbox: 'category-trabalho', icon: '💼', title: 'Trabalho' },
  estudo: { prefix: 'category-estudo', activeTab: 'bg-estudo', checkbox: 'category-estudo', icon: '📚', title: 'Estudo' },
  'atividade-fisica': { prefix: 'category-atividade-fisica', activeTab: 'bg-atividade-fisica', checkbox: 'category-atividade-fisica', icon: '💪', title: 'Atividade Física' },
  alimentacao: { prefix: 'category-alimentacao', activeTab: 'bg-alimentacao', checkbox: 'category-alimentacao', icon: '🍎', title: 'Alimentação' },
  saude: { prefix: 'category-saude', activeTab: 'bg-saude', checkbox: 'category-saude', icon: '❤️', title: 'Saúde' },
};

// Variáveis globais
let tasks = {};
let currentTheme = 'light';

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// Função principal de inicialização
function initializeApp() {
  // Configurar o toggle de tema
  setupThemeToggle();

  // Inicializar a aplicação
  displayDate();
  initializeTabs();
  loadTasks();
  renderAll();

  // Clicar na aba "Geral" por padrão
  document.querySelector('.tab-button[data-tab="geral"]').click();
}

// Configurar o botão de alternar tema
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');

  // Carregar tema salvo ou usar o padrão do sistema
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  // Atualizar ícone baseado no tema atual
  themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  // Adicionar evento de clique para alternar tema
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', currentTheme);
  });
}

// Aplicar o tema selecionado
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// Exibir a data atual
function displayDate() {
  const now = new Date();
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const dateDisplay = document.getElementById('current-date');
  dateDisplay.textContent = `${days[now.getDay()]}, ${now.toLocaleDateString('pt-BR')}`;
}

// Inicializar as abas
function initializeTabs() {
  const tabsContainer = document.getElementById('tabs');
  const tabContentsContainer = document.getElementById('tab-contents');

  // Adicionar evento de clique para as abas
  tabsContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const targetTab = e.target.dataset.tab;

      // Remover classe ativa de todos os botões
      tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        Object.values(categoryConfig).forEach(config => {
          btn.classList.remove(config.activeTab);
        });
      });

      // Adicionar classe ativa ao botão clicado
      e.target.classList.add('active', categoryConfig[targetTab].activeTab);

      // Esconder todos os conteúdos de abas
      tabContentsContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      // Mostrar o conteúdo da aba clicada
      document.getElementById(targetTab).classList.add('active');
    }
  });

  // Renderizar o conteúdo de cada aba (exceto a geral)
  Object.keys(categoryConfig).forEach(cat => {
    if (cat !== 'geral') {
      renderCategoryTab(cat);
    }
  });

  // Configurar eventos para formulários de adicionar tarefas
  setupTaskForms();
}

// Configurar eventos para formulários de adicionar tarefas
function setupTaskForms() {
  const tabContentsContainer = document.getElementById('tab-contents');

  tabContentsContainer.addEventListener('submit', (e) => {
    if (e.target.classList.contains('add-task-form')) {
      e.preventDefault();
      const form = e.target;
      const textInput = form.querySelector('input[type="text"]');
      const timeInput = form.querySelector('input[type="time"]');
      const taskText = textInput.value.trim();
      const taskTime = timeInput.value;
      const category = form.closest('.tab-content').id;

      if (taskText) {
        // Adicionar nova tarefa
        tasks[category].push({
          id: Date.now(),
          text: taskText,
          time: taskTime,
          completed: false
        });

        // Limpar formulário
        textInput.value = '';
        timeInput.value = '';

        // Salvar e renderizar
        saveTasks();
        renderAll();
      }
    }
  });
}

// Gerar tarefas iniciais para o dia
function generateInitialTasks() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayOfMonth = today.getDate();

  const newTasks = {
    trabalho: [
      { id: Date.now() + 1, text: 'Subir Volumetria', time: '07:50', completed: false },
      { id: Date.now() + 2, text: 'Preparar Fup', time: '08:00', completed: false },
      { id: Date.now() + 3, text: 'Falta de Volume', time: '08:20', completed: false },
      { id: Date.now() + 4, text: 'Analisar rotas da expedição no Web Varejo', time: '09:00', completed: false }
    ],
    estudo: [],
    'atividade-fisica': [],
    alimentacao: [
      { id: Date.now() + 5, text: '1° Refeição - Pré-dia', time: '05:20', completed: false },
      { id: Date.now() + 6, text: '2° Refeição - Café da manhã', time: '06:40', completed: false },
      { id: Date.now() + 7, text: '3° Refeição - Lanche da manhã', time: '09:30', completed: false },
      { id: Date.now() + 8, text: '4° Refeição - Almoço', time: '12:30', completed: false },
      { id: Date.now() + 9, text: '5° Refeição - Pré-treino', time: '15:30', completed: false },
      { id: Date.now() + 10, text: '6° Refeição - Jantar', time: '20:00', completed: false }
    ],
    saude: [
      { id: Date.now() + 11, text: 'Tomar creatina', time: '07:10', completed: false }
    ]
  };

  // Adicionar exercícios baseados no dia da semana
  const workoutPlan = [
    'Domingo: Ombro, panturrilha e ABS',
    'Segunda: Perna',
    'Terça: Costas, bíceps e trapézio',
    'Quarta: Peito, tríceps e ombro',
    'Quinta: Costas, bíceps',
    'Sexta: Peito e tríceps',
    'Sábado: Baba'
  ];

  let workoutTime = '18:30';
  if (dayOfWeek === 6) workoutTime = '06:00';  // Sábado
  if (dayOfWeek === 0) workoutTime = '08:00';  // Domingo

  newTasks['atividade-fisica'].push({
    id: Date.now() + 12,
    text: workoutPlan[dayOfWeek],
    time: workoutTime,
    completed: false
  });

  // Adicionar estudos baseados no dia
  if (dayOfWeek >= 1 && dayOfWeek <= 6) {
    const studyTopic = (dayOfMonth % 2 === 0) ?
      'PROGRAMAÇÃO DE SOLUÇÕES COMPUTACIONAIS' :
      'MODELAGEM DE SOFTWARE';

    newTasks.estudo.push({
      id: Date.now() + 13,
      text: `Estudar a noite: ${studyTopic}`,
      time: '21:00',
      completed: false
    });
  }

  if (dayOfMonth % 2 !== 0) {
    newTasks.estudo.push({
      id: Date.now() + 14,
      text: 'Estudar curso de BI e Excel',
      time: '21:00',
      completed: false
    });
  }

  return newTasks;
}

// Carregar tarefas do localStorage ou gerar novas
function loadTasks() {
  const todayKey = `dailyTasks-${new Date().toLocaleDateString('pt-BR')}`;
  const savedTasks = localStorage.getItem(todayKey);
  tasks = savedTasks ? JSON.parse(savedTasks) : generateInitialTasks();
  saveTasks();
}

// Salvar tarefas no localStorage
function saveTasks() {
  const todayKey = `dailyTasks-${new Date().toLocaleDateString('pt-BR')}`;
  localStorage.setItem(todayKey, JSON.stringify(tasks));
}

// Criar elemento de tarefa para o DOM
function createTaskElement(task, categoryForElement) {
  const li = document.createElement('li');
  li.className = 'task-item';
  if (task.completed) li.classList.add('completed');

  const taskCategory = task.category || categoryForElement;
  const colors = categoryConfig[taskCategory];

  // Prefixo de categoria (usado apenas na visão geral)
  const isGeneralView = categoryForElement === 'geral';
  const prefix = isGeneralView ?
    `<span class="category-prefix ${colors.prefix}">${taskCategory.replace('-', ' ')}:</span>` :
    '';

  li.innerHTML = `
        <div class="task-content">
            <span class="task-time">${task.time || ''}</span>
            <input type="checkbox" data-id="${task.id}" class="task-checkbox ${colors.checkbox}" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${prefix}${task.text}</span>
        </div>
        <button class="remove-task-btn" data-id="${task.id}" data-category="${taskCategory}">
            🗑️
        </button>
    `;

  return li;
}

// Renderizar uma aba de categoria
function renderCategoryTab(category) {
  const config = categoryConfig[category];
  const container = document.getElementById(category);

  container.innerHTML = `
        <h2>${config.icon} ${config.title}</h2>
        <ul id="${category}-list" class="task-list"></ul>
        <form class="add-task-form">
            <input type="text" placeholder="Nova tarefa..." required>
            <input type="time">
            <button type="submit" class="${config.activeTab}">Adicionar</button>
        </form>
    `;
}

// Renderizar o relatório de progresso
function renderReport() {
  const reportSummaryEl = document.getElementById('report-summary');
  const reportDetailsEl = document.getElementById('report-details');
  const pendingTasksListEl = document.getElementById('pending-tasks-list');

  // Limpar conteúdo anterior
  reportDetailsEl.innerHTML = '';
  pendingTasksListEl.innerHTML = '';

  let totalTasks = 0;
  let totalCompleted = 0;
  const allPendingTasks = [];
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // Processar cada categoria
  Object.keys(tasks).forEach(category => {
    const categoryTasks = tasks[category];
    if (categoryTasks.length === 0) return;

    const config = categoryConfig[category];
    const categoryCompleted = categoryTasks.filter(t => t.completed).length;
    const categoryTotal = categoryTasks.length;
    const percentage = categoryTotal > 0 ? (categoryCompleted / categoryTotal) * 100 : 0;

    totalTasks += categoryTotal;
    totalCompleted += categoryCompleted;

    // Coletar tarefas pendentes
    categoryTasks.forEach(task => {
      if (!task.completed) {
        allPendingTasks.push({ ...task, category });
      }
    });

    // Criar elemento de detalhe do relatório
    const detailDiv = document.createElement('div');
    detailDiv.className = 'report-category';
    detailDiv.innerHTML = `
            <div class="category-header">
                <span class="category-title ${config.prefix}">${config.icon} ${config.title}</span>
                <span class="category-stats">${categoryCompleted} / ${categoryTotal}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${config.activeTab}" style="width: ${percentage}%"></div>
            </div>
        `;

    reportDetailsEl.appendChild(detailDiv);
  });

  // Ordenar tarefas pendentes por horário
  allPendingTasks.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

  // Renderizar lista de tarefas pendentes
  allPendingTasks.forEach(task => {
    const config = categoryConfig[task.category];
    let status = { text: 'Pendente', color: 'text-secondary' };

    // Verificar se a tarefa está atrasada
    if (task.time) {
      const [taskHours, taskMinutes] = task.time.split(':').map(Number);
      if (taskHours < currentHours || (taskHours === currentHours && taskMinutes < currentMinutes)) {
        status = { text: 'Atrasado', color: 'text-red' };
      }
    }

    const li = document.createElement('li');
    li.innerHTML = `
            <span>${task.time ? `[${task.time}]` : ''} ${task.text} (${config.title})</span>
            <span class="${status.color}">${status.text}</span>
        `;
    pendingTasksListEl.appendChild(li);
  });

  // Calcular porcentagem geral de conclusão
  const overallPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Atualizar resumo do relatório
  reportSummaryEl.innerHTML = `
        <p class="text-secondary">Progresso Geral</p>
        <p class="text-large">${overallPercentage}%</p>
        <p class="text-secondary">${totalCompleted} de ${totalTasks} tarefas concluídas</p>
    `;

  // Mensagem se não houver tarefas pendentes
  if (pendingTasksListEl.children.length === 0) {
    pendingTasksListEl.innerHTML = '<li class="text-center text-secondary">Parabéns! Todas as tarefas foram concluídas.</li>';
  }
}

// Renderizar toda a interface
function renderAll() {
  // Renderizar lista geral (timeline)
  const geralList = document.getElementById('geral-list');
  geralList.innerHTML = '';

  // Coletar e ordenar todas as tarefas
  const allTasksFlat = Object.keys(tasks).flatMap(category =>
    tasks[category].map(task => ({ ...task, category }))
  );

  allTasksFlat.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

  // Adicionar tarefas à lista geral
  allTasksFlat.forEach(task => {
    geralList.appendChild(createTaskElement(task, 'geral'));
  });

  // Renderizar listas de cada categoria
  Object.keys(tasks).forEach(category => {
    const listElement = document.getElementById(`${category}-list`);
    if (listElement) {
      listElement.innerHTML = '';
      tasks[category]
        .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
        .forEach(task => listElement.appendChild(createTaskElement(task, category)));
    }
  });

  // Renderizar relatório
  renderReport();

  // Configurar eventos para checkboxes e botões de remover
  setupTaskInteractions();
}

// Configurar interações com as tarefas (checkboxes e botões de remover)
function setupTaskInteractions() {
  const tabContentsContainer = document.getElementById('tab-contents');

  // Evento para checkboxes
  tabContentsContainer.addEventListener('change', (e) => {
    const checkbox = e.target;
    if (checkbox.type === 'checkbox') {
      const taskId = Number(checkbox.dataset.id);

      // Encontrar e atualizar a tarefa
      Object.values(tasks).flat().forEach(task => {
        if (task.id === taskId) {
          task.completed = checkbox.checked;
        }
      });

      // Salvar e renderizar
      saveTasks();
      renderAll();
    }
  });

  // Evento para botões de remover
  tabContentsContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-task-btn');
    if (removeBtn) {
      const taskId = Number(removeBtn.dataset.id);
      const category = removeBtn.dataset.category;

      // Remover tarefa
      tasks[category] = tasks[category].filter(task => task.id !== taskId);

      // Salvar e renderizar
      saveTasks();
      renderAll();
    }
  });
}