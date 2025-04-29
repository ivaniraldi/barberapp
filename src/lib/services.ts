// src/lib/services.ts

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string; // Added category
  active: boolean; // Added active status
}

// Mock data for services, including categories and active status
// In a real app, this data would come from a database or API
const allServices: Service[] = [
  { id: '1', name: 'Classic Haircut', description: 'Traditional haircut with scissors and clippers.', duration: 30, price: 25, category: 'Haircuts', active: true },
  { id: '2', name: 'Beard Trim & Shape', description: 'Shape and trim your beard to perfection.', duration: 20, price: 18, category: 'Beard Care', active: true },
  { id: '3', name: 'Hot Towel Shave', description: 'Relaxing hot towel shave with a straight razor.', duration: 45, price: 40, category: 'Shaves', active: true },
  { id: '4', name: 'Hair Wash & Style', description: 'Shampoo, condition, and professional styling.', duration: 25, price: 22, category: 'Styling', active: true },
  { id: '5', name: 'Skin Fade Haircut', description: 'Modern fade down to the skin.', duration: 45, price: 35, category: 'Haircuts', active: true },
  { id: '6', name: 'Full Beard Grooming', description: 'Wash, condition, trim, shape, and oil.', duration: 30, price: 30, category: 'Beard Care', active: true },
  { id: '7', 'name': 'Head Shave', description: 'Smooth head shave with clippers or razor.', duration: 30, price: 28, category: 'Shaves', active: true },
  { id: '8', name: 'Kids Haircut', description: 'Patient and stylish cuts for children (under 12).', duration: 25, price: 20, category: 'Haircuts', active: true },
  { id: '9', name: 'Hair Coloring', description: 'Consultation required. Price varies.', duration: 60, price: 50, category: 'Coloring', active: false }, // Example inactive service
  { id: '10', name: 'Simple Trim', description: 'Quick cleanup around ears and neck.', duration: 15, price: 15, category: 'Haircuts', active: true },
];

// Function to get all services (simulates fetching data)
export function getServices(): Service[] {
  // In a real app, you might fetch this from an API or database
  return allServices;
}

// Function to get a service by ID (simulates fetching data)
export function getServiceById(id: string): Service | undefined {
  return allServices.find(service => service.id === id);
}
