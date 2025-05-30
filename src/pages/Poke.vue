<template>
  <div class="poke-page">
    <h1>Buscar Pokémon</h1>
    <button @click="buscarPokemon">🔍 Buscar a un Pokemon</button>

    <div v-if="pokemon">
      <h2>{{ capitalizar(pokemon.name) }}</h2>
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
      <p><strong>Tipo:</strong> {{ pokemon.types[0].type.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from '@/lib/axios'

const pokemon = ref(null)

const buscarPokemon = async () => {
  try {
    const response = await axios.get('/pokemon/chikorita')
    pokemon.value = response.data
  } catch (error) {
    console.error('Error al buscar el Pokémon:', error)
  }
}

const capitalizar = (nombre: string) => {
  return nombre.charAt(0).toUpperCase() + nombre.slice(1)
}
</script>

<style scoped>
.poke-page {
  padding: 2rem;
}
button {
  padding: 0.5rem 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
img {
  width: 150px;
}
</style>
