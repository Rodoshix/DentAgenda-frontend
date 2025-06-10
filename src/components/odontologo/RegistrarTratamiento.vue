<template>
    <v-dialog
      :model-value="modelValue"
      @update:model-value="(val) => emit('update:modelValue', val)"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          🩺 Registrar Tratamiento
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Diagnóstico"
            v-model="diagnostico"
            required
          />
          <v-text-field
            label="Tratamiento"
            v-model="tratamiento"
            required
          />
          <v-textarea
            label="Observaciones"
            v-model="observaciones"
            rows="3"
          />
          <v-alert
            v-if="error"
            type="error"
            class="mt-2"
          >
            {{ error }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue" @click="guardarTratamiento">
            Guardar
          </v-btn>
          <v-btn variant="text" @click="cerrar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import api from '../../interceptors/axiosAuth'
  
  const props = defineProps({
    modelValue: Boolean,
    citaId: Number,
    pacienteId: Number
  })
  const emit = defineEmits(['update:modelValue', 'cerrar', 'guardado'])
  
  const diagnostico = ref('')
  const tratamiento = ref('')
  const observaciones = ref('')
  const error = ref('')
  
  const guardarTratamiento = async () => {
    if (!diagnostico.value || !tratamiento.value) {
      error.value = 'Diagnóstico y tratamiento son obligatorios.'
      return
    }
  
    try {
        await api.post('/tratamientos/registrar', {
        idCita: props.citaId,
        diagnostico: diagnostico.value,
        procedimiento: tratamiento.value,
        observacion: observaciones.value
        })
        
      emit('guardado')
      cerrar()
    } catch (err) {
      error.value = 'Error al guardar el tratamiento.'
    }
  }
  
  const cerrar = () => {
    emit('update:modelValue', false)
    emit('cerrar')
    diagnostico.value = ''
    tratamiento.value = ''
    observaciones.value = ''
    error.value = ''
  }
  </script>