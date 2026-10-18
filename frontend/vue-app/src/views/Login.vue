<template>
  <div class="p-6 text-center">
    <h1 class="text-3xl font-bold text-blue-600">Welcome, new roomate!</h1>
    <p>Create your account and get things done together.</p>
  </div>
  <div>
    <p>Name : {{ name }}</p>
    <input v-model="name" placeholder="Paul" />
    <p>Surname: {{ surname }}</p>
    <input v-model="surname" placeholder="Iglesias" />
    <p>Email address: {{ email }}</p>
    <input v-model="email" placeholder="paul@email.com" />
  </div>
</template>