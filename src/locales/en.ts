// src/locales/en.ts
export default {
  // Navbar
  nav: {
    home: 'Home',
    services: 'Services',
    cuts: 'Cuts', // New Cuts link
    calendar: 'Calendar', // Added Calendar link
    admin_login: 'Admin Login',
    toggle_menu: 'Toggle Menu',
    logout: 'Logout',
  },
  // Homepage
  home: {
    title: 'BarberApp',
    subtitle: 'Your neighborhood barbershop for premium grooming.',
    popular_services: 'Popular Services',
    popular_services_desc: 'Check out some of our client favorites.',
    view_all_services: 'View All Services',
    book_appointment: 'Book Your Appointment',
    book_appointment_desc: 'Select a service and find a time that suits you.',
    our_work: 'Our Work',
    our_work_desc: 'Take a look at some of the styles we create.',
    footer_rights: 'All rights reserved.',
    footer_address: '123 Barber Street, Cityville',
  },
  // Services Page
  services_page: {
    title: 'Our Services',
    subtitle: 'Find the perfect grooming service for you.',
    no_services: 'No services currently available. Please check back later.',
    // Added specific category translations with 'category_' prefix
    category_other: 'Other Services',
    category_haircuts: 'Haircuts',
    category_beard_care: 'Beard Care',
    category_shaves: 'Shaves',
    category_styling: 'Styling',
    category_coloring: 'Coloring',
  },
  // Cuts Page
  cuts_page: {
      title: 'Style Gallery',
      subtitle: 'Explore the cuts and styles we offer.',
      all_cuts: 'All Cuts', // Filter option
      // Keys for filters, matching service categories if applicable
      haircuts: 'Haircuts',
      beard_care: 'Beard Care',
      shaves: 'Shaves',
      styling: 'Styling',
  },
  // Calendar Page
  calendar_page: {
      title: 'Appointment Calendar',
      subtitle: 'View scheduled appointments by date.',
      previous_month: 'Previous Month',
      next_month: 'Next Month',
      select_date: 'Select a Date',
      appointments_for_day: 'Appointments for this day',
      no_appointments_today: 'No appointments scheduled for this day.',
      click_date_prompt: 'Click on a date in the calendar to see appointments.',
  },
  // Booking Form
  booking_form: {
    name: 'Name',
    name_placeholder: 'Your Full Name',
    name_error: 'Name must be at least 2 characters.',
    phone: 'Phone',
    phone_placeholder: '+1234567890',
    phone_error: 'Invalid phone number format (e.g., +1234567890).', // Added example format
    email: 'Email',
    email_placeholder: 'your.email@example.com',
    email_error: 'Invalid email address.',
    service: 'Service',
    select_service: 'Select a service',
    service_error: 'Please select a service.',
    date: 'Date',
    pick_a_date: 'Pick a date',
    date_error: 'Please select a date.',
    time: 'Time',
    select_a_time: 'Select a time',
    time_error: 'Please select a time.',
    book_button: 'Book Appointment',
    booking_button: 'Booking...',
    success_title: 'Appointment Booked!',
    success_description: 'Thanks, {name}! Your appointment for {serviceName} on {date} at {time} is confirmed.',
    // Service details (used in ServiceList)
    duration_minutes: '{duration} minutes',
  },
  // Login Page
  login_page: {
      title: 'Admin Login',
      description: 'Access the BarberApp dashboard.',
      email: 'Email',
      email_placeholder: 'admin@admin.com',
      email_error: 'Invalid email address.',
      password: 'Password',
      password_placeholder: '******',
      password_error: 'Password must be at least 6 characters.',
      login_button: 'Login',
      logging_in_button: 'Logging In...',
      login_success_title: 'Login Successful',
      login_success_description: 'Redirecting to admin panel...',
      login_fail_title: 'Login Failed',
      login_fail_description: 'Invalid email or password.',
  },
  // Admin Panel
  admin_page: {
      title: 'Admin Panel',
      authenticated: 'Authenticated',
      manage_appointments: 'Manage Appointments',
      manage_services: 'Manage Services',
      appointments_title: 'Appointments',
      appointments_desc: 'View, confirm, or cancel upcoming appointments.',
      services_title: 'Services',
      services_desc: 'Add, edit, or activate/deactivate barbering services.',
      footer_copy: 'BarberApp Admin © {year}',
  },
  // Admin Appointment Manager
  admin_appointment: {
      date_time: 'Date & Time',
      client: 'Client',
      service: 'Service',
      status: 'Status',
      actions: 'Actions',
      no_appointments: 'No appointments found.',
      change_status: 'Change Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
      update_success_title: 'Appointment Status Updated',
      update_success_desc: 'Appointment ID {appointmentId} set to {newStatus}.',
      invalid_date: 'Invalid Date', // Added for invalid date scenario
  },
  // Admin Service Manager
  admin_service: {
      add_new: 'Add New Service',
      edit_service: 'Edit Service', // Modal title
      add_service: 'Add New Service', // Modal title & button
      add_service_desc: 'Fill in the details for the new service.', // Modal description
      edit_service_desc: 'Update the details for this service.', // Modal description
      save_changes: 'Save Changes', // Modal button
      cancel: 'Cancel', // Modal button
      service_name: 'Service Name',
      name_error: 'Service name must be at least 3 characters.',
      category: 'Category',
      category_placeholder: 'e.g., Haircuts, Beard Care',
      category_error: 'Category name must be at least 2 characters.',
      description: 'Description',
      description_error: 'Description must be at least 5 characters.',
      duration: 'Duration (min)',
      duration_error: 'Duration must be a positive number (minutes).',
      price: 'Price ({symbol})', // Updated price label
      price_error: 'Price must be a positive number.',
      active_status: 'Active Status',
      // Table Headers
      th_name: 'Name',
      th_category: 'Category',
      th_duration: 'Duration',
      th_price: 'Price',
      th_status: 'Status',
      th_actions: 'Actions',
      // Status Badges
      status_active: 'Active',
      status_inactive: 'Inactive',
      // Tooltips/Labels
      activate_tooltip: 'Activate Service',
      deactivate_tooltip: 'Deactivate Service',
      edit_tooltip: 'Edit Service',
      delete_tooltip: 'Delete Service',
      // Toasts
      update_success_title: 'Service Updated',
      update_success_desc: '"{serviceName}" has been updated.',
      add_success_title: 'Service Added',
      add_success_desc: '"{serviceName}" has been added.',
      toggle_success_title_activated: 'Service Activated',
      toggle_success_title_deactivated: 'Service Deactivated',
      toggle_success_desc: '"{serviceName}" is now {status}.', // status will be 'active' or 'inactive'
      delete_success_title: 'Service Deleted',
      delete_success_desc: '"{serviceName}" has been deleted.',
      update_error_title: 'Update Failed',
      add_error_title: 'Add Failed',
      toggle_error_title: 'Status Change Failed',
      delete_error_title: 'Delete Failed',
      fetch_error_title: 'Fetch Failed',
      fetch_error_desc: 'Could not load services. Please try again.',
      error_generic_desc: 'An unexpected error occurred. Please try again.',
      no_services: 'No services found.', // Message in table body
      // Delete Confirmation
      delete_confirm_title: 'Are you sure?',
      delete_confirm_desc: 'This action cannot be undone. This will permanently delete the service "{serviceName}".',
      delete_confirm_button: 'Delete',
  },
} as const;

