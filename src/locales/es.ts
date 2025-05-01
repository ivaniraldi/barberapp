// src/locales/es.ts
export default {
  // Navbar
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    cuts: 'Cortes',
    calendar: 'Calendario', // Added Calendar link
    admin_login: 'Login Admin',
    toggle_menu: 'Alternar Menú',
    logout: 'Cerrar Sesión',
  },
  // Homepage
  home: {
    title: 'BarberApp',
    subtitle: 'Tu barbería de barrio para un aseo premium.',
    popular_services: 'Servicios Populares',
    popular_services_desc: 'Echa un vistazo a los favoritos de nuestros clientes.',
    view_all_services: 'Ver Todos los Servicios',
    book_appointment: 'Reserva Tu Cita',
    book_appointment_desc: 'Selecciona un servicio y encuentra la hora que te convenga.',
    our_work: 'Nuestro Trabajo',
    our_work_desc: 'Mira algunos de los estilos que creamos.',
    footer_rights: 'Todos los derechos reservados.',
    footer_address: 'Calle Barbero 123, Villaciudad',
  },
  // Services Page
  services_page: {
    title: 'Nuestros Servicios',
    subtitle: 'Encuentra el servicio de aseo perfecto para ti.',
    no_services_available: 'No hay servicios disponibles actualmente. Por favor, vuelve más tarde.', // Changed key for clarity
    // Added specific category translations with 'category_' prefix matching generated keys
    category_other: 'Otros Servicios',
    category_cortes_de_pelo: 'Cortes de Pelo', // Matches 'cortes_de_pelo' key
    category_cuidado_con_la_barba: 'Cuidado de Barba', // Matches 'cuidado_com_a_barba' key (normalized from pt)
    category_cuidado_de_barba: 'Cuidado de Barba', // Matches 'cuidado_de_barba' key (if generated from es)
    category_barbear: 'Afeitados', // Matches 'barbear' key (normalized from pt)
    category_afeitados: 'Afeitados', // Matches 'afeitados' key (if generated from es)
    category_estilizacao: 'Estilismo', // Matches 'estilizacao' key (normalized from pt)
    category_estilismo: 'Estilismo', // Matches 'estilismo' key (if generated from es)
    category_coloracao: 'Coloración', // Matches 'coloracao' key (normalized from pt)
    category_coloracion: 'Coloración', // Matches 'coloracion' key (if generated from es)
  },
  // Cuts Page
  cuts_page: {
      title: 'Galería de Estilos',
      subtitle: 'Explora los cortes y estilos que ofrecemos.',
      all_cuts: 'Todos los Cortes',
      haircuts: 'Cortes de Pelo',
      beard_care: 'Cuidado de Barba',
      shaves: 'Afeitados',
      styling: 'Estilismo',
  },
  // Calendar Page
  calendar_page: {
      title: 'Calendario de Citas',
      subtitle: 'Ver citas programadas por fecha.',
      previous_month: 'Mes Anterior',
      next_month: 'Mes Siguiente',
      select_date: 'Selecciona una Fecha',
      appointments_for_day: 'Citas para este día',
      no_appointments_today: 'No hay citas programadas para este día.',
      click_date_prompt: 'Haz clic en una fecha del calendario para ver las citas.',
  },
  // Booking Form
  booking_form: {
    name: 'Nombre',
    name_placeholder: 'Tu Nombre Completo',
    name_error: 'El nombre debe tener al menos 2 caracteres.',
    phone: 'Teléfono',
    phone_placeholder: '+34666112233', // Example ES format
    phone_error: 'Formato de número de teléfono inválido (ej., +34666112233).',
    email: 'Correo Electrónico',
    email_placeholder: 'tu.email@ejemplo.com',
    email_error: 'Dirección de correo electrónico inválida.',
    service: 'Servicio',
    select_service: 'Selecciona un servicio',
    service_error: 'Por favor, selecciona un servicio.',
    date: 'Fecha',
    pick_a_date: 'Elige una fecha',
    date_error: 'Por favor, selecciona una fecha.',
    time: 'Hora',
    select_a_time: 'Selecciona una hora',
    time_error: 'Por favor, selecciona una hora.',
    book_button: 'Reservar Cita',
    booking_button: 'Reservando...',
    success_title: '¡Cita Reservada!',
    success_description: '¡Gracias, {name}! Tu cita para {serviceName} el {date} a las {time} está confirmada.',
    duration_minutes: '{duration} minutos',
  },
  // Login Page
  login_page: {
      title: 'Login de Admin',
      description: 'Accede al panel de BarberApp.',
      email: 'Correo Electrónico',
      email_placeholder: 'admin@admin.com',
      email_error: 'Dirección de correo electrónico inválida.',
      password: 'Contraseña',
      password_placeholder: '******',
      password_error: 'La contraseña debe tener al menos 6 caracteres.',
      login_button: 'Iniciar Sesión',
      logging_in_button: 'Iniciando Sesión...',
      login_success_title: 'Inicio de Sesión Exitoso',
      login_success_description: 'Redirigiendo al panel de administración...',
      login_fail_title: 'Fallo de Inicio de Sesión',
      login_fail_description: 'Correo electrónico o contraseña inválidos.',
  },
  // Admin Panel
  admin_page: {
      title: 'Panel de Administración',
      authenticated: 'Autenticado',
      manage_appointments: 'Gestionar Citas',
      manage_services: 'Gestionar Servicios',
      appointments_title: 'Citas',
      appointments_desc: 'Ver, confirmar o cancelar próximas citas.',
      services_title: 'Servicios',
      services_desc: 'Añadir, editar o activar/desactivar servicios de barbería.',
      footer_copy: 'BarberApp Admin © {year}',
  },
  // Admin Appointment Manager
  admin_appointment: {
      date_time: 'Fecha y Hora',
      client: 'Cliente',
      service: 'Servicio',
      status: 'Estado',
      actions: 'Acciones',
      no_appointments: 'No se encontraron citas.',
      change_status: 'Cambiar Estado',
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      update_success_title: 'Estado de la Cita Actualizado',
      update_success_desc: 'La cita ID {appointmentId} se ha establecido a {newStatus}.',
      invalid_date: 'Fecha Inválida',
  },
  // Admin Service Manager
  admin_service: {
      add_new: 'Añadir Nuevo Servicio',
      edit_service: 'Editar Servicio',
      add_service: 'Añadir Nuevo Servicio',
      add_service_desc: 'Completa los detalles para el nuevo servicio.',
      edit_service_desc: 'Actualiza los detalles de este servicio.',
      save_changes: 'Guardar Cambios',
      cancel: 'Cancelar',
      service_name: 'Nombre del Servicio',
      name_error: 'El nombre del servicio debe tener al menos 3 caracteres.',
      category: 'Categoría',
      category_placeholder: 'Ej., Cortes de pelo, Cuidado de barba',
      category_error: 'El nombre de la categoría debe tener al menos 2 caracteres.',
      description: 'Descripción',
      description_error: 'La descripción debe tener al menos 5 caracteres.',
      duration: 'Duración (min)',
      duration_error: 'La duración debe ser un número positivo (minutos).',
      price: 'Precio ({symbol})', // Updated price label
      price_error: 'El precio debe ser un número positivo.',
      active_status: 'Estado Activo',
      // Table Headers
      th_name: 'Nombre',
      th_category: 'Categoría',
      th_duration: 'Duración',
      th_price: 'Precio',
      th_status: 'Estado',
      th_actions: 'Acciones',
      // Status Badges
      status_active: 'Activo',
      status_inactive: 'Inactivo',
      // Tooltips/Labels
      activate_tooltip: 'Activar Servicio',
      deactivate_tooltip: 'Desactivar Servicio',
      edit_tooltip: 'Editar Servicio',
      delete_tooltip: 'Eliminar Servicio',
      // Toasts
      update_success_title: 'Servicio Actualizado',
      update_success_desc: '"{serviceName}" ha sido actualizado.',
      add_success_title: 'Servicio Añadido',
      add_success_desc: '"{serviceName}" ha sido añadido.',
      toggle_success_title_activated: 'Servicio Activado',
      toggle_success_title_deactivated: 'Servicio Desactivado',
      toggle_success_desc: '"{serviceName}" ahora está {status}.',
      delete_success_title: 'Servicio Eliminado',
      delete_success_desc: '"{serviceName}" ha sido eliminado.',
      update_error_title: 'Error al Actualizar',
      add_error_title: 'Error al Añadir',
      toggle_error_title: 'Error al Cambiar Estado',
      delete_error_title: 'Error al Eliminar',
      fetch_error_title: 'Error al Cargar',
      fetch_error_desc: 'No se pudieron cargar los servicios. Inténtalo de nuevo.',
      error_generic_desc: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
      no_services: 'No se encontraron servicios.',
      // Delete Confirmation
      delete_confirm_title: '¿Estás seguro?',
      delete_confirm_desc: 'Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio "{serviceName}".',
      delete_confirm_button: 'Eliminar',
  },
} as const;
