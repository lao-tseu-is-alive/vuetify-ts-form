<template>
  <v-app>
    <v-app-bar title="Application"></v-app-bar>

    <v-main>
      <dynamic-form :schema="mySchema"></dynamic-form>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/DynamicForm.vue'
import {ref} from 'vue'
import {baseField, fieldInfo, iField} from './components/FormSchema';

const handleFormSaveEvent = (val: Record<string, unknown>) => {
  console.log('## IN APP handleFormSaveEvent val:', val);
};

const mySchema = ref({
  name: {
    name: 'name',
    title: 'Entrez votre nom',
    type: 'string',
    required: true,
    nullable: false,
    minLength: 3,
    maxLength: 250
  },
  isWorking: {
    name: 'isWorking',
    title: 'Est actif',
    type: 'boolean',
    required: true,
    nullable: false,
  },
  salary: {
    name: 'salary',
    title: 'Veuillez saisir votre salaire mensuel',
    type: 'integer',
    format: 'int32',
    required: true,
    nullable: false,
    minimum: 0,
    maximum: 100000
  },
  email: {
    name: 'email',
    title: 'Email',
    type: 'string',
    format: 'email',
    required: true,
    nullable: false,
    minLength: 6,
    maxLength: 250
  },
  birthDate: {
    name: 'birthDate',
    title: 'Date de naissance',
    type: 'string',
    format: 'date',
    required: true,
    nullable: false,
  },
} as Record<string, iField>);

</script>
