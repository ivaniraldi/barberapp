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
// Translated to Portuguese
let allServices: Service[] = [
  { id: '1', name: 'Corte de Cabelo Clássico', description: 'Corte de cabelo tradicional com tesoura e máquina.', duration: 30, price: 30, category: 'Cortes de Cabelo', active: true },
  { id: '2', name: 'Aparar e Modelar Barba', description: 'Modele e apare sua barba com perfeição.', duration: 20, price: 25, category: 'Cuidado com a Barba', active: true },
  { id: '3', name: 'Barbear com Toalha Quente', description: 'Barbear relaxante com toalha quente e navalha.', duration: 45, price: 45, category: 'Barbear', active: true },
  { id: '4', name: 'Lavar e Pentear Cabelo', description: 'Shampoo, condicionador e estilização profissional.', duration: 25, price: 20, category: 'Estilização', active: true },
  { id: '5', name: 'Corte Degradê (Skin Fade)', description: 'Degradê moderno até a pele.', duration: 45, price: 40, category: 'Cortes de Cabelo', active: true },
  { id: '6', name: 'Cuidado Completo da Barba', description: 'Lavar, condicionar, aparar, modelar e olear.', duration: 30, price: 35, category: 'Cuidado com a Barba', active: true },
  { id: '7', 'name': 'Raspar Cabeça', description: 'Raspagem suave da cabeça com máquina ou navalha.', duration: 30, price: 30, category: 'Barbear', active: true },
  { id: '8', name: 'Corte Infantil', description: 'Cortes pacientes e estilosos para crianças (menores de 12 anos).', duration: 25, price: 25, category: 'Cortes de Cabelo', active: true },
  { id: '9', name: 'Coloração de Cabelo', description: 'Consulta necessária. Preço varia.', duration: 60, price: 60, category: 'Coloração', active: false }, // Example inactive service
  { id: '10', name: 'Acabamento Simples', description: 'Limpeza rápida ao redor das orelhas e pescoço.', duration: 15, price: 15, category: 'Cortes de Cabelo', active: true },
];

// --- API Simulation ---

// Simulate API delay
const simulateApiDelay = (delay = 300) => new Promise(resolve => setTimeout(resolve, delay)); // Reduced delay slightly

// Function to get all services (simulates fetching data)
export async function getServices(): Promise<Service[]> {
  await simulateApiDelay();
  // In a real app, fetch from API/DB
  return [...allServices]; // Return a copy to avoid direct mutation
}

// Function to get a service by ID (simulates fetching data)
export async function getServiceById(id: string): Promise<Service | undefined> {
  await simulateApiDelay();
  return allServices.find(service => service.id === id);
}

// Function to add a new service (simulates API call)
export async function addService(newServiceData: Omit<Service, 'id'>): Promise<Service> {
  await simulateApiDelay();
  const newService: Service = {
    ...newServiceData,
    id: `service-${Date.now()}-${Math.random().toString(16).slice(2)}`, // More unique ID
  };
  allServices = [newService, ...allServices]; // Add to the beginning
  console.log("Added Service:", JSON.stringify(newService)); // Log only the added service (stringified)
  // console.log("Current Services:", JSON.stringify(allServices)); // Removed logging the full array
  return newService;
}

// Function to update an existing service (simulates API call)
export async function updateService(id: string, updatedData: Partial<Omit<Service, 'id'>>): Promise<Service> {
  await simulateApiDelay();
  const serviceIndex = allServices.findIndex(service => service.id === id);
  if (serviceIndex === -1) {
    throw new Error(`Service with ID ${id} not found`);
  }
  const updatedService = { ...allServices[serviceIndex], ...updatedData };
  allServices[serviceIndex] = updatedService;
  console.log("Updated Service:", JSON.stringify(updatedService)); // Log only the updated service (stringified)
  // console.log("Current Services:", JSON.stringify(allServices)); // Removed logging the full array
  return updatedService;
}

// Function to delete a service (simulates API call)
export async function deleteService(id: string): Promise<void> {
  await simulateApiDelay(500); // Adjusted delay
  const initialLength = allServices.length;
  allServices = allServices.filter(service => service.id !== id);
  if (allServices.length === initialLength) {
      // Optional: Throw error if not found, or just complete silently
      // throw new Error(`Service with ID ${id} not found for deletion`);
      console.warn(`Service with ID ${id} not found for deletion.`);
  }
  console.log("Deleted Service ID:", id);
  // console.log("Current Services:", JSON.stringify(allServices)); // Removed logging the full array
}