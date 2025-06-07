<template>
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h2>Bienvenido a DentAgenda</h2>
          <h1>Atención Odontológica de Calidad</h1>
          <p>Gestiona tus citas, consulta tu historial y recibe atención especializada.</p>
          <button class="hero-button" @click="goToLogin">Iniciar Sesión</button>
        </div>
        <div class="hero-image">
          <img :src="dentistaSonriente" alt="Odontóloga sonriente" />
        </div>
      </div>
    </section>

    <section class="highlight-section">
      <div class="highlight-container">
        <div class="highlight-card">
          <img :src="iconoCaries" alt="Icono Protección" class="highlight-icon" />
          <h3>Atención Preventiva</h3>
          <p>Previene enfermedades dentales con controles y limpieza periódica.</p>
        </div>
        <div class="highlight-card">
          <img :src="iconoEstetoscopio" alt="Icono Estetoscopio" class="highlight-icon" />
          <h3>Especialistas</h3>
          <p>Contamos con un equipo profesional en distintas áreas odontológicas.</p>
        </div>
      </div>
    </section>

    <section class="about-section">
      <div class="about-container">
        <div class="about-image">
          <img :src="equipoDental" alt="Equipo dental sonriente" />
        </div>
        <div class="about-text">
          <h2>Confianza y Profesionalismo</h2>
          <p class="subtitle">Nos comprometemos con tu salud dental.</p>
          <p>
              Nuestro equipo odontológico combina experiencia, calidez humana y tecnología moderna
              para entregarte un servicio ágil, personalizado y de calidad.
          </p>
            <button
            @click="scrollToContacto"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            >
            Conócenos
            </button>
        </div>
      </div>
    </section>

    <section class="testimonios-section">
      <h2 class="section-title">Lo que nuestros pacientes dicen</h2>
      <div class="testimonios-grid">
        <div class="testimonio-card" v-for="(t, index) in testimonios" :key="index">
          <img :src="t.imagen" alt="Foto paciente" class="testimonio-img" />
        <div class="testimonio-nombre">{{ t.nombre }}</div>
        <div class="estrellas">★★★★★</div>
          <p class="testimonio-texto">{{ t.texto }}</p>
        </div>
      </div>
    </section>

    <section class="contacto-section" id="contacto">
    <h2 class="section-title">Ubicación y Contacto</h2>
      <div class="contacto-container">
        <div class="contacto-info">
          <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
          <p><strong>Correo:</strong> contacto@dentagenda.cl</p>
          <p><strong>Dirección:</strong> Av. Dental 1234, Santiago, Chile</p>
          <p class="contacto-desc">Estamos ubicados en el corazón de la ciudad. ¡Ven a visitarnos o llámanos para más información!</p>
        </div>
        <div class="contacto-mapa">
          <img :src="mapaFicticio" alt="Ubicación clínica" />
        </div>
      </div>
    </section>

    <!-- MÓDULO 6 - FOOTER -->
    <footer class="footer">
    <div class="footer-content">
      <div class="footer-column">
        <h3>DentAgenda</h3>
        <p>Av. Salud Dental #123<br>Villa Los Arcos Dentales</p>
        <p>📞 +56 9 1234 5678</p>
        <p>✉️ contacto@dentagenda.cl</p>
      </div>
        <div class="footer-column">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Agendar Cita</a></li>
            <li><a href="#">Historial</a></li>
            <li><a href="#">Perfil</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 DentAgenda. Todos los derechos reservados.</p>
      </div>
    </footer>

  </template>
  
  <script setup>
    import { useRouter } from 'vue-router'

    const router = useRouter()
    function goToLogin() {
    router.push('/login')
    }
    //seccion 1
    const dentistaSonriente = new URL('@/assets/homeviewimg/dentistaSonriente.webp', import.meta.url).href
    
    //seccion 2
    const iconoCaries = new URL('@/assets/homeviewimg/protectorCaries.webp', import.meta.url).href
    const iconoEstetoscopio = new URL('@/assets/homeviewimg/atencion.webp', import.meta.url).href
    
    //seccion 3
    const equipoDental = new URL('@/assets/homeviewimg/diverseDentist.webp', import.meta.url).href
    
    function scrollToContacto() {
    const contacto = document.getElementById('contacto')
    if (contacto) {
        contacto.scrollIntoView({ behavior: 'smooth' })
    }
    }

    //seccion 4
    const testimonios = [
    {
        nombre: 'Laura García',
        imagen: new URL('@/assets/homeviewimg/resena1.webp', import.meta.url).href,
        texto: 'El servicio dental fue excelente. El dentista fue muy profesional y atento.'
    },
    {
        nombre: 'Miguel Ramírez',
        imagen: new URL('@/assets/homeviewimg/resena2.webp', import.meta.url).href,
        texto: 'El servicio dental fue excepcional. El personal fue amable y profesional. ¡Muy recomendado!'
    },
    {
        nombre: 'María Fernández',
        imagen: new URL('@/assets/homeviewimg/resena3.webp', import.meta.url).href,
        texto: 'El servicio dental aquí es excelente. Los dentistas son muy profesionales y atentos.'
    },
    {
        nombre: 'Miguel García',
        imagen: new URL('@/assets/homeviewimg/resena4.webp', import.meta.url).href,
        texto: 'El servicio dental ha sido excelente. ¡Muy profesionales y amigables!'
    }
    ]

    //seccion 5
    const mapaFicticio = new URL('@/assets/homeviewimg/mapDentAgenda.webp', import.meta.url).href
  </script>
  
  <style scoped>
    .navbar-item.has-dropdown.is-hoverable:nth-child(1) .navbar-dropdown .navbar-item {
        pointer-events: none;
        cursor: default;
        color: white !important;
    }
    
    .gradient-header {
        background: linear-gradient(to right, #4fc3f7, #0288d1);
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
        padding-top: 3rem;
        margin-bottom: 2rem;
    }

    .hero-section {
    background: linear-gradient(to right, #e0f7fa, #ffffff);
    padding: 4rem 2rem;
    }

    .hero-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    gap: 2rem;
    flex-wrap: wrap;
    }

    .hero-text {
    flex: 1;
    min-width: 300px;
    }

    .hero-text h2 {
    color: #0288d1;
    font-weight: 600;
    font-size: 1.25rem;
    }

    .hero-text h1 {
    font-size: 2.5rem;
    color: #0277bd;
    margin: 0.5rem 0;
    }

    .hero-text p {
    font-size: 1rem;
    color: #555;
    }

    .hero-button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #0288d1;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    }

    .hero-button:hover {
    background-color: #0277bd;
    }

    .hero-image {
    flex: 1;
    min-width: 300px;
    text-align: center;
    }

    .hero-image img {
    max-width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    /* Sección 2 */
    .highlight-section {
    background-color: #e3f2fd;
    padding: 3rem 1rem;
    }

    .highlight-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: 0 auto;
    }

    .highlight-card {
    background-color: #42a5f5;
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    width: 280px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .highlight-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    }


    /* Sección 3 */
    .about-section {
    padding: 4rem 2rem;
    background-color: #f0f9ff;
    }

    .about-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    }

    .about-image {
    flex: 1;
    min-width: 300px;
    text-align: center;
    }

    .about-image img {
    width: 100%;
    max-width: 450px;
    border-radius: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .about-text {
    flex: 1;
    min-width: 300px;
    }

    .about-text h2 {
    color: #0277bd;
    font-size: 2rem;
    font-weight: 700;
    }

    .about-text .subtitle {
    color: #0288d1;
    font-weight: 500;
    margin-bottom: 1rem;
    }

    .about-text p {
    color: #444;
    line-height: 1.6;
    }

    .about-button {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #0288d1;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    }

    .about-button:hover {
    background-color: #0277bd;
    }

    /* Sección 4 */
    .testimonios-section {
    padding: 4rem 2rem;
    background-color: #f0f8ff;
    text-align: center;
    }

    .section-title {
    font-size: 2rem;
    color: #0277bd;
    margin-bottom: 2rem;
    font-weight: bold;
    }

    .testimonios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    }

    .testimonio-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .testimonio-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    }

    .testimonio-nombre {
    font-weight: bold;
    font-size: 1.1rem;
    color: #0288d1;
    }

    .estrellas {
    color: #fbc02d;
    margin: 0.5rem 0;
    }

    .testimonio-texto {
    font-size: 0.95rem;
    color: #333;
    line-height: 1.5;
    }

    /* Sección 5 */
    .contacto-section {
    background-color: #e3f2fd;
    padding: 4rem 2rem;
    text-align: center;
    }

    .contacto-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    }

    .contacto-info {
    flex: 1;
    min-width: 280px;
    text-align: left;
    font-size: 1rem;
    color: #333;
    }

    .contacto-info p {
    margin-bottom: 0.5rem;
    }

    .contacto-desc {
    margin-top: 1rem;
    color: #555;
    }

    .contacto-mapa {
    flex: 1;
    min-width: 300px;
    text-align: center;
    }

    .contacto-mapa img {
    max-width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    /* Footer */
    .footer {
    background-color: #0288d1;
    color: white;
    padding: 2rem 1rem;
    margin-top: 4rem;
    }

    .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1200px;
    margin: auto;
    gap: 2rem;
    }

    .footer-column h3,
    .footer-column h4 {
    margin-bottom: 1rem;
    }

    .footer-column p,
    .footer-column ul {
    margin: 0.25rem 0;
    }

    .footer-column ul {
    list-style: none;
    padding: 0;
    }

    .footer-column a {
    color: white;
    text-decoration: none;
    }

    .footer-column a:hover {
    text-decoration: underline;
    }

    .footer-bottom {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.9rem;
    }
  </style>