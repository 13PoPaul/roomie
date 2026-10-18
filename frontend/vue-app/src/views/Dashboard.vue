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
  const title = newTaks.value.title.trim() //trim() removes whitespace from both ends of the task title
  if (!title || !newTask.value.dueDate){
    return //if the title or due date is empty, do not add the task
  }
  //push adds a new object to the task array
  tasks.value.push({
    ...newTask.value, //... spread operator copies all properties from newTask.value
    id : tasks.value.length + 1, //assign a new id based on the current length of the tasks array
    title
  })

  showAddForm.value = false //hide the form after adding the task

  newTask.value = { //reset the newTask object to its initial state
    title: '',
    area: 'Bathroom',
    assignedTo: 'Edouard',
    priority: 'Medium',
    dueDate: '',
    status: 'todo'
  }
}

</script>