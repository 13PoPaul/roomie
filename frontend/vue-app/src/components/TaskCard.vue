<script setup>

// receive data from the parent component 
defineProps({
    task: {
        type : Object,
        required : true
    }
})

// decalres custom events that this component can send to its parent
const emit = defineEmits(['change-status', 'edit-task'])


// it is a javascript object and it associates task priority with a tailwind class
const priorityColors = {
    Low : 'bg-green-100 text-green-700',
    Medium : 'bg-yellow-100 text-yellow-700',
    High : 'bg-red-100 text-red-700'

}

//array containing every available task status. We separate value and label to help with MySQL database later
const statusOptions =[
    { value : 'todo', label : 'To Do'},
    {value : 'doing', label : 'Doing'},
    {value : 'done', label: 'Done'}

]



function formatDate(date){
    if (!date) return 'No due date'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
    const [year, month, day] = date.split('-').map(Number)
    const formattedDate = new Date(year, month - 1, day)
    return formattedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

</script>

<template>
    <div draggable="true" @dragstart="$event.dataTransfer.setData('text/plain',String(task.id))" @dblclick.stop="emit('edit-task', task.id)" class="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
        <h3 class = "font-semi-bold text-gray-800 mb-2">
            {{task.title}}
        </h3>
        <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                {{task.area}}
            </span>
            <span class="text-xs px-2 py-1 rounded-full" :class="priorityColors[task.priority]">
                {{task.priority}}
            </span>
        </div>

        <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span> 👤 {{task.assignedTo}}</span>
            <span> 📅 {{ formatDate(task.dueDate) }}</span>
        </div>

        
    </div>
</template>