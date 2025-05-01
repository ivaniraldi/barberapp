import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Centralized currency formatting function - Always formats as BRL
export const formatCurrency = (price: number): string => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'BRL', // Always use BRL
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    try {
        // Use 'pt-BR' locale for formatting conventions, but currency is BRL
        return new Intl.NumberFormat('pt-BR', options).format(price);
    } catch (error) {
        console.error("Currency formatting error:", error);
        // Fallback to simple formatting with R$
        return `R$${price.toFixed(2)}`;
    }
};
