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
const allServices: Service[] = [
  { id: '1', name: 'Corte de Cabelo Clássico', description: 'Corte de cabelo tradicional com tesoura e máquina.', duration: 30, price: 25, category: 'Cortes de Cabelo', active: true },
  { id: '2', name: 'Aparar e Modelar Barba', description: 'Modele e apare sua barba com perfeição.', duration: 20, price: 18, category: 'Cuidado com a Barba', active: true },
  { id: '3', name: 'Barbear com Toalha Quente', description: 'Barbear relaxante com toalha quente e navalha.', duration: 45, price: 40, category: 'Barbear', active: true },
  { id: '4', name: 'Lavar e Pentear Cabelo', description: 'Shampoo, condicionador e estilização profissional.', duration: 25, price: 22, category: 'Estilização', active: true },
  { id: '5', name: 'Corte Degradê (Skin Fade)', description: 'Degradê moderno até a pele.', duration: 45, price: 35, category: 'Cortes de Cabelo', active: true },
  { id: '6', name: 'Cuidado Completo da Barba', description: 'Lavar, condicionar, aparar, modelar e olear.', duration: 30, price: 30, category: 'Cuidado com a Barba', active: true },
  { id: '7', 'name': 'Raspar Cabeça', description: 'Raspagem suave da cabeça com máquina ou navalha.', duration: 30, price: 28, category: 'Barbear', active: true },
  { id: '8', name: 'Corte Infantil', description: 'Cortes pacientes e estilosos para crianças (menores de 12 anos).', duration: 25, price: 20, category: 'Cortes de Cabelo', active: true },
  { id: '9', name: 'Coloração de Cabelo', description: 'Consulta necessária. Preço varia.', duration: 60, price: 50, category: 'Coloração', active: false }, // Example inactive service
  { id: '10', name: 'Acabamento Simples', description: 'Limpeza rápida ao redor das orelhas e pescoço.', duration: 15, price: 15, category: 'Cortes de Cabelo', active: true },
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
