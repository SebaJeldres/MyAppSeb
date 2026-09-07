# MyAppSeb

Sistema integral de gestión de productividad personal que centraliza cinco herramientas esenciales de organización diaria en una sola plataforma web, ofreciendo un flujo de trabajo dinámico y optimizado.

---

## Arquitectura y Tecnologías

El proyecto utiliza una arquitectura desacoplada basada en contenedores Docker:

* **Frontend:** React + Vite (Node 20 Alpine)
* **Backend:** Laravel 11 / PHP 8.4-FPM
* **Servidor Web:** Nginx (Reverse Proxy)
* **Base de Datos:** Supabase PostgreSQL (Soporte local opcional en MySQL 8.0)

---

## Módulos y Funcionalidades

### 1. ToDo (Diario)
Gestión de tareas de ciclo diario orientada a la simplicidad operacional[cite: 2, 6].
* **Flujo de Tareas:** Creación directa con asignación de estado inicial (Pendiente/Completado) y limpieza automática de input[cite: 2, 6].
* **Organización:** Tablas diferenciadas para tareas activas y tabla desplegable para completadas[cite: 6].
* **Ciclo de Vida:** Las tareas no completadas al finalizar la jornada se purgan automáticamente para mantener la relevancia diaria[cite: 2, 6].

### 2. Pomodoro Timer
Reloj de enfoque integrado con la lista de tareas[cite: 2, 5].
* **Control de Tiempo:** Temporizador digital configurable con actualización en tiempo real[cite: 2, 5].
* **Integración:** Despliegue e incorporación de tareas desde el ToDo para vincular bloques de trabajo con elementos pendientes específicos[cite: 2, 5].

### 3. Gestor de Notas
Módulo de anotaciones con jerarquización de prioridades[cite: 2, 3].
* **Gestión CRUD:** Creación, edición, consulta y eliminación de notas[cite: 2, 3].
* **Priorización:** Clasificación visual por colores según nivel de prioridad y fecha asociada[cite: 2, 3].

### 4. Calendario
Vista unificada de eventos y compromisos en formato mensual o semanal[cite: 1, 2].
* **Visualización:** Mapeo de notas directamente sobre las fechas correspondientes[cite: 1, 2].
* **Interacción:** Navegación hacia el detalle y gestión de cada nota seleccionada desde la propia grilla del calendario[cite: 1, 2].

### 5. Habit Tracker
Seguimiento periódico de metas y rutinas[cite: 2, 4].
* **Métricas:** Registro de hábitos con trazabilidad continua de días completados (ciclos de hasta 30 días)[cite: 2, 4].
* **Marcación:** Interfaz para marcar fechas de cumplimiento efectivo[cite: 2, 4].

---

## Estilo Visual e Interfaz

La interfaz de usuario destaca por una identidad visual estilizada, inspirada en un diseño estilizado de alto contraste (*Persona Series / Stylized Dark Anime UI*). Emplea paletas en tonos negros, blancos y acentos en rojo intenso, tipografías dinámicas e interfaces angulares que ofrecen una experiencia fluida y moderna.

---

## Instrucciones de Instalación con Docker

### Prerrequisitos
* Docker Desktop y Docker Compose instalados.
* Variables de entorno configuradas en `./MyAppSeb_Backend/.env` (Credenciales de Supabase PostgreSQL).

### Despliegue en Desarrollo

1. **Clonar el repositorio y acceder a la carpeta raíz:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd MyAppSeb

2. **Construir e iniciar los servicios:**
   ```bash
   docker compose up -d --build

2. **Ejecutar migraciones en el backend:**
   ```bash
   docker compose exec app php artisan migrate

2. **Ejecutar migraciones en el backend:**
   * Frontend: http://localhost:5173.
   * Backend API / Nginx: http://localhost:8000.
