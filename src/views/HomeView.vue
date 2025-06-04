    <template>
        <div>
        <nav class="navbar gradient-header">
            <div class="navbar-item has-text-white">
                <span class="icon"><i class="fas fa-tooth"></i></span>
                <strong class="has-text-white">DentAgenda</strong>
            </div>
    
            <div class="navbar-menu">
            <div class="navbar-start">
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link custom-link">Especialidades</a>
                <div class="navbar-dropdown custom-dropdown">
                <a class="navbar-item">Ortodoncia</a>
                <a class="navbar-item">Implantes</a>
                <a class="navbar-item">Odontopediatría</a>
                <a class="navbar-item">Rehabilitación Oral</a>
                <a class="navbar-item">Estética Dental</a>
                </div>
            </div>
    
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link custom-link">¿Necesitas atención?</a>
                <div class="navbar-dropdown custom-dropdown">
                <a class="navbar-item">Agendar cita</a>
                <a class="navbar-item">Emergencias</a>
                </div>
            </div>
            </div>
    
            <div class="navbar-end">
            <div class="navbar-item">
                <a class="button is-light is-rounded" @click="goToLogin">
                <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                <span>Iniciar sesión</span>
                </a>
            </div>
            </div>
        </div>
        </nav>
    
        <section class="section content-area">
        <div class="container has-text-centered">
            <h1 class="title is-3 has-text-weight-bold has-text-link">Una nueva experiencia dental</h1>
            <p class="subtitle">Atención profesional, ágil y centrada en el paciente.</p>
        </div>
        </section>
    </div>
    </template>

    <script setup>
    import { useRouter } from 'vue-router'

    const router = useRouter()

    function goToLogin() {
    router.push('/login')
    }
    </script>
  
  <style scoped>

    .navbar-item.has-dropdown.is-hoverable:nth-child(1) .navbar-dropdown .navbar-item {
    pointer-events: none;
    cursor: default;
    color: white !important;
    }

    .gradient-header {
    background: linear-gradient(to right, #4fc3f7, #0288d1); /* celestes */
    color: white;
    padding: 0.5rem 1rem;
    }
    
    .navbar-link,
    .navbar-item {
    color: white !important;
    }
    
    .navbar-dropdown .navbar-item {
    color: white !important;
    }

    .custom-dropdown {
    background: linear-gradient(to right, #4fc3f7, #0288d1) !important;
    border-radius: 4px;
    padding: 0;
    }
  
    .custom-dropdown .navbar-item:hover,
    .custom-dropdown .navbar-item:focus,
    .custom-dropdown .navbar-item.is-active {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: #ffffff !important;
    }
  
    .content-area {
    background-color: white;
    min-height: 90vh;
    padding-top: 4rem;
    }
    </style>