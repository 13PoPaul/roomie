<script setup>
import { ref, computed, onMounted } from 'vue'
import TaskColumn from '../components/TaskColumn.vue'
import TaskDataService from '../services/TaskDataService'

// Liste réactive alimentée par la base de données
const tasks = ref([])
const errorMessage = ref('')

const selectedArea = ref('All') 
const selectedRoomate = ref('All')

const areas = ['All', 'Bathroom', 'Bedroom', 'Kitchen', 'Other']
const roomates = ['All', 'Edouard', 'Clemence', 'Paul', 'Jeanne']

// 1. Charger les tâches depuis le serveur au montage du composant
function loadTasks() {
  TaskDataService.getAll()
    .then(response => {
      // Transformation des données reçues pour correspondre aux propriétés du front
      tasks.value = response.data.map(task => ({
        id: task.id,
        title: task.title,
        area: task.location || 'Other',
        assignedTo: task.description || 'Edouard',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 'todo'
      }))
    })
    .catch(error => {
      console.error('Erreur lors du chargement des tâches :', error)
      errorMessage.value = 'Impossible de contacter le serveur.'
    })
}

onMounted(() => {
  loadTasks()
})

// Filtrage dynamique
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesArea = selectedArea.value === 'All' || task.area === selectedArea.value
    const matchesRoomate = selectedRoomate.value === 'All' || task.assignedTo === selectedRoomate.value
    return matchesArea && matchesRoomate
  })
})

// Répartition dans les trois colonnes du Kanban
const columns = computed(() => [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-purple-100',
    tasks: filteredTasks.value.filter(task => task.status === 'todo')
  },
  {
    id: 'doing',
    title: 'Doing',
    color: 'bg-orange-100',
    tasks: filteredTasks.value.filter(task => task.status === 'doing')
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-100',
    tasks: filteredTasks.value.filter(task => task.status === 'done')
  }
])

// 2. Mettre à jour le statut d'une tâche (clic ou drag & drop)
function changeTaskStatus(id, newStatus) {
  if (!['todo', 'doing', 'done'].includes(newStatus)) return

  TaskDataService.update(id, { status: newStatus })
    .then(() => {
      const task = tasks.value.find(t => t.id === id)
      if (task) task.status = newStatus
    })
    .catch(err => console.error('Erreur de mise à jour du statut :', err))
}

function handleTaskDrop(taskId, newStatus) {
  changeTaskStatus(Number(taskId), newStatus)
}

// 3. Formulaire d'ajout d'une tâche
const showAddForm = ref(false)
const newTask = ref({
  title: '',
  area: 'Bathroom',
  assignedTo: 'Edouard',
  priority: 'Medium',
  dueDate: '',
  status: 'todo'
})

function addTask() {
  const title = newTask.value.title.trim()
  if (!title || !newTask.value.dueDate) return

  // Préparation du payload pour le modèle Sequelize
  const payload = {
    title: title,
    location: newTask.value.area,
    description: newTask.value.assignedTo,
    priority: newTask.value.priority,
    dueDate: newTask.value.dueDate,
    status: newTask.value.status
  }

  TaskDataService.create(payload)
    .then(response => {
      // Ajout immédiat de la tâche renvoyée avec son ID généré par MySQL
      tasks.value.push({
        id: response.data.id,
        title: response.data.title,
        area: response.data.location || newTask.value.area,
        assignedTo: response.data.description || newTask.value.assignedTo,
        priority: response.data.priority,
        dueDate: response.data.dueDate ? response.data.dueDate.split('T')[0] : '',
        status: response.data.status
      })
      showAddForm.value = false
      newTask.value = { 
        title: '',
        area: 'Bathroom',
        assignedTo: 'Edouard',
        priority: 'Medium',
        dueDate: '',
        status: 'todo'
      }
    })
    .catch(err => console.error('Erreur lors de la création de la tâche :', err))
}

// 4. Édition et suppression
const showEditForm = ref(false)
const editingTask = ref(null)

function openEditTask(taskId) {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return
  editingTask.value = { ...task }
  showEditForm.value = true
}

function saveTask() {
  if (!editingTask.value) return
  const title = editingTask.value.title.trim()
  if (!title || !editingTask.value.dueDate) return

  const payload = {
    title: title,
    location: editingTask.value.area,
    description: editingTask.value.assignedTo,
    priority: editingTask.value.priority,
    dueDate: editingTask.value.dueDate,
    status: editingTask.value.status
  }

  TaskDataService.update(editingTask.value.id, payload)
    .then(() => {
      const task = tasks.value.find(t => t.id === editingTask.value.id)
      if (task) {
        Object.assign(task, { ...editingTask.value, title })
      }
      showEditForm.value = false
      editingTask.value = null
    })
    .catch(err => console.error('Erreur lors de la modification :', err))
}

function deleteTask() {
  if (!editingTask.value) return
  const confirmed = window.confirm('Are you sure you want to delete this task?')
  if (!confirmed) return

  TaskDataService.delete(editingTask.value.id)
    .then(() => {
      tasks.value = tasks.value.filter(t => t.id !== editingTask.value.id)
      showEditForm.value = false
      editingTask.value = null
    })
    .catch(err => console.error('Erreur lors de la suppression :', err))
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">What needs to be done ?</h1>
      <p class="text-gray-500 mt-2">Keep the place clean, keep the roomates happy.</p>
    </div>

    <!-- Alerte en cas de problème réseau avec le serveur -->
    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
      {{ errorMessage }}
    </div>

    <div class="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div class="flex flex-wrap gap-3">
        <select v-model="selectedArea" class="bg-white border border-gray-200 rounded-lg px-4 py-2">
          <option v-for="area in areas" :key="area" :value="area">  
            {{ area === 'All' ? 'All Areas' : area }}
          </option>
        </select>

        <select v-model="selectedRoomate" class="bg-white border border-gray-200 rounded-lg px-4 py-2">
          <option v-for="roomate in roomates" :key="roomate" :value="roomate">
            {{ roomate === 'All' ? 'Everyone' : roomate }}
          </option>
        </select>
      </div>

      <button @click="showAddForm = true" class="flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 active:scale-95 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer w-full sm:w-auto">
        + Add Task
      </button>
    </div>

    <!-- Colonnes Kanban -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <TaskColumn 
        v-for="column in columns" 
        :key="column.id" 
        :title="column.title" 
        :tasks="column.tasks" 
        :color="column.color" 
        :status="column.id" 
        @change-status="changeTaskStatus" 
        @drop-task="handleTaskDrop" 
        @edit-task="openEditTask" 
      />
    </div>

    <!-- Modal d'ajout -->
    <div v-if="showAddForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form @submit.prevent="addTask" class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 class="text-xl font-bold">Add New Task</h2>
        
        <input v-model="newTask.title" required placeholder="Task title" class="w-full border rounded-lg p-2" />
        
        <label class="block text-sm">Area</label>
        <select v-model="newTask.area" class="w-full border rounded-lg p-2">
          <option v-for="area in areas.filter(a => a !== 'All')" :key="area" :value="area">
            {{ area }}
          </option>
        </select>

        <label class="block text-sm">Assigned To</label>
        <select v-model="newTask.assignedTo" class="w-full border rounded-lg p-2">
          <option v-for="roomate in roomates.filter(r => r !== 'All')" :key="roomate" :value="roomate">
            {{ roomate }}
          </option>
        </select>

        <label class="block text-sm">Priority</label>
        <select v-model="newTask.priority" class="w-full border rounded-lg p-2">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label class="block text-sm">Due Date</label>
        <input v-model="newTask.dueDate" type="date" required class="w-full border rounded-lg p-2" />
        
        <div class="flex justify-end gap-3 pt-3">
          <button type="button" @click="showAddForm = false" class="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-violet-500 text-white rounded-lg">
            Create Task
          </button>
        </div>
      </form>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditForm && editingTask" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form @submit.prevent="saveTask" class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <div class="flex justify-between items-center"> 
          <h2 class="text-xl font-bold text-gray-800">Edit Task</h2>
          <button type="button" @click="showEditForm = false" class="text-gray-400 hover:text-gray-700">✕</button>
        </div>
        
        <div>
          <label class="block text-sm mb-1">Task Title</label>
          <input v-model="editingTask.title" required placeholder="Task title" class="w-full border rounded-lg p-2" />
        </div>
        
        <div>
          <label class="block text-sm mb-1">Area</label>
          <select v-model="editingTask.area" class="w-full border rounded-lg p-2">
            <option v-for="area in areas.filter(a => a !== 'All')" :key="area" :value="area">
              {{ area }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm mb-1">Assigned To</label>
          <select v-model="editingTask.assignedTo" class="w-full border rounded-lg p-2">
            <option v-for="roomate in roomates.filter(r => r !== 'All')" :key="roomate" :value="roomate">
              {{ roomate }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm mb-1">Priority</label>
          <select v-model="editingTask.priority" class="w-full border rounded-lg p-2">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm mb-1">Due Date</label>
          <input v-model="editingTask.dueDate" type="date" required class="w-full border rounded-lg p-2" />
        </div>

        <div class="flex justify-between items-center pt-4">
          <button type="button" @click="deleteTask" class="bg-red-50 text-red-600 hover:bg-red-100 rounded-lg px-4 py-2 transition">
            🗑️ Delete
          </button>
          <div class="flex gap-2">
            <button type="button" @click="showEditForm = false" class="px-4 py-2 rounded-lg border">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-violet-500 text-white hover:bg-violet-600 rounded-lg">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>