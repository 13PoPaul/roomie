<script setup>
//import Vue's reacativity functions
import {ref, computed} from 'vue'

//import the column component
import TaskColumn from '../components/TaskColumn.vue'

const tasks = ref([
  {
    id: 1,                      //unique identifier
    title: 'Clean the bathroom',
    area: 'Bathroom',       
    assignedTo: 'Edouard',        
    priority: 'High',          
    dueDate: 'Tomorrow',        
    status: 'todo'              
  },
  {
    id: 2,
    title: 'Buy toilet paper',
    area: 'Bathroom',
    assignedTo: 'Clemence',
    priority: 'Medium',
    dueDate: 'Sunday',
    status: 'todo'
  },
  {
    id: 3,
    title: 'Take out the trash',
    area: 'Kitchen',
    assignedTo: 'Paul',
    priority: 'High',
    dueDate: 'Today',
    status: 'todo'
  },
  {
    id: 4,
    title: 'Clean the kitchen',
    area: 'Kitchen',
    assignedTo: 'Jeanne',
    priority: 'High',
    dueDate: 'Tomorrow',
    status: 'doing'
  },
  {
    id: 5,
    title: 'Wipe down counters',
    area: 'Kitchen',
    assignedTo: 'Jeanne',
    priority: 'Medium',
    dueDate: 'Friday',
    status: 'doing'
  },
  {
    id: 6,
    title: 'Vacuum living room',
    area: 'Other',
    assignedTo: 'Edouard',
    priority: 'Low',
    dueDate: 'Yesterday',
    status: 'done'
  }
]) //reactive variable that will change values when Vue updates the interface

const selectedArea = ref('All') 
const selectedRoomate = ref('All')

const areas = ['All', 'Bathroom', 'Bedroom', 'Kitchen', 'Other']
const roomates = ['All', 'Edouard', 'Clemence', 'Paul', 'Jeanne']

//computed() creates a value derived from reactive data. It will automatically recalculate when tasks, selectedArea or selectedRoomate change
const filteredTasks = computed(() => {
  return tasks.value.filter(task =>{
    const matchesArea = selectedArea.value==='All' || task.area===selectedArea.value
    const matchesRoomate = selectedRoomate.value==='All' || task.assignedTo===selectedRoomate.value
    return matchesArea && matchesRoomate
  })
})



//build the 3 dashboard columns by filtering the tasks based on their status
const columns = computed(() =>[
  {
    id : 'todo',
    title : 'To Do',
    color : 'bg-purple-100',
    tasks : filteredTasks.value.filter(task => task.status==='todo')
  },
  {
    id : 'doing',
    title : 'Doing',
    color : 'bg-orange-100',
    tasks : filteredTasks.value.filter(task => task.status==='doing')
  },
  {
    id : 'done',
    title : 'Done',
    color : 'bg-green-100',
    tasks : filteredTasks.value.filter(task => task.status==='done')
  }
])


function changeTaskStatus(id, newStatus) {
  const task = tasks.value.find(task => task.id === id)
  if (task && ['todo', 'doing', 'done'].includes(newStatus)) {
    task.status = newStatus
  }
}

const showAddForm = ref(false)

const newTask = ref({
  title: '',
  area: 'Bathroom',
  assignedTo: 'Edouard',
  priority: 'Medium',
  dueDate: '',
  status: 'todo'
})


//function executed when the user submits the form

function addTask(){
   //trim() removes whitespace from both ends of the task title
  const title = newTask.value.title.trim()
  if (!title || !newTask.value.dueDate){
    return
  }
  const task = {...newTask.value, 
    id : tasks.value.length + 1, //generate a unique identifier for the new task
    title}
  tasks.value.push(task)
  //hide the form after adding the task
  showAddForm.value = false 

  //reset the newTask object to its initial state
  newTask.value = { 
    title: '',
    area: 'Bathroom',
    assignedTo: 'Edouard',
    priority: 'Medium',
    dueDate: '',
    status: 'todo'
  }
}

function handleTaskDrop(taskId, newStatus){
  const task =  tasks.value.find(task => String(task.id)===taskId)
  if (!task) return
  task.status = newStatus
}


</script>

<template>
  <main class="max-w-7xl mx-auto px-6 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold texte-gray-900">What needs to be done ?</h1>
      <p class="text-gray-500 mt-2">Keep the place clean, keep the roomates happy.</p>
    </div>
    <div class="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div class = "flex flex-wrap gap-3">
        <select v-model="selectedArea" class="bg-white border border-gray-200 rounded-lg px-4 py-2">
          <option v-for="area in areas" :key="area" :value="area">  
            {{ area === 'All' ? 'All Areas' : area}}
          </option>
        </select>

        <select v-model="selectedRoomate" class="bg-white border border-gray-200 rounded-lg px-4 py-2">
          <option v-for="roomate in roomates" :key="roomate" :value="roomate">
            {{ roomate === 'All' ? 'Everyone' : roomate }}
          </option>
        </select>
      </div>
      <button @click="showAddForm=true" class=" flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 active:scale-95 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer w-full sm:w-auto">
        + Add Task
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <TaskColumn v-for="column in columns" :key="column.id" :title="column.title" :tasks="column.tasks" :color="column.color" :status="column.id" @change-status="changeTaskStatus" @drop-task="handleTaskDrop" />
    </div>

    <div v-if="showAddForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form @submit.prevent="addTask" class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 class="text-xl font-bold">
          Add New Task
        </h2>
        <input v-model="newTask.title" required placeholder="Task title" class="w-full border rounded-lg p-2"/>
        <label class="block text-sm">Area</label>
        <select v-model="newTask.area" class="w-full border rounded-lg p-2">
          <option v-for="area in areas.filter (area => area !== 'All')" :key="area">
            {{area}}
          </option>
        </select>

        <label class="block text-sm">Assigned To</label>
        <select v-model="newTask.assignedTo" class="w-full border rounded-lg p-2">
          <option v-for="roomate in roomates.filter(roomate => roomate !== 'All')" :key="roomate">
            {{roomate}}
          </option>
        </select>

        <label class="block text-sm">Priority</label>
        <select v-model="newTask.priority" class="w-full border rounded-lg p-2">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label class="block text-sm">Due Date</label>
        <input v-model="newTask.dueDate" type="date" required class="w-full border rounded-lg p-2"/>
        <div class="flex justify-end gap-3 pt-3">
          <button type="button" @click="showAddForm=false" class="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-violet-500 text-white rounded-lg">
            Create Task
          </button>
        </div>
      </form>
    </div>
  </main>
</template>