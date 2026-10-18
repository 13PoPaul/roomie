<script setup>
//import the component repsonsible for displaying a single task card
import TaskCard from './TaskCard.vue'

//define data received from the parent component DashBoard.vue
defineProps({
    title : String, //name displayed at the top of the column
    tasks : Array,//array containing all the tasks that will be displayed in this column
    color : String //tailwind class that will be used to color the background
})

const emit = defineEmits(['change-status']) //define the custom event that will be sent to the parent component when a task status is changed

function handleStatusChange(id, status) {
    emit('change-status', id, status) //emit the custom event to the parent component
}

</script>

<template>
    <section class="rounded-lg p-4 min-h-[400px]" :class="color">
        <div class="flex items-center gap-2 mb-4">
            <h2 class="font-bold texte-gray-800">
                {{title}}
            </h2>
            <span class="bg-white rounded-full px-2 text-xs font-semibold text-gray-500">
                {{tasks.length}}
            </span>
        </div>
        <div class="space-y-3">
            <TaskCard v-for="task in tasks" :key="task.id" :task="task" @change-status="handleStatusChange"/>
        </div>

        <p v-if = "tasks.lenght===0" class="text-sm text-gray-400 text-center py-10">
            No tasks available.
        </p>
    </section>
</template>