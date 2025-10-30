/**
 * Utilidades de validación
 */

/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar NIT colombiano
 */
export const isValidNIT = (nit: string): boolean => {
  const nitRegex = /^\d{9,10}-?\d?$/;
  return nitRegex.test(nit);
};

/**
 * Validar teléfono colombiano
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[3]\d{9}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  return phoneRegex.test(cleanPhone);
};

/**
 * Validar cédula colombiana
 */
export const isValidCedula = (cedula: string): boolean => {
  const cedulaRegex = /^\d{6,10}$/;
  return cedulaRegex.test(cedula);
};

/**
 * Validar contraseña segura
 * Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validar edad mínima
 */
export const isMinimumAge = (birthDate: string, minAge: number): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }
  
  return age >= minAge;
};

/**
 * Validar rango de salario
 */
export const isValidSalaryRange = (salary: number, min: number = 0, max: number = 999999999): boolean => {
  return salary >= min && salary <= max;
};

/**
 * Validar fecha futura
 */
export const isFutureDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

/**
 * Validar fecha pasada
 */
export const isPastDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate <= today;
};

/**
 * Validar archivo por extensión
 */
export const isValidFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

/**
 * Validar tamaño de archivo (en MB)
 */
export const isValidFileSize = (fileSize: number, maxSizeMB: number): boolean => {
  const fileSizeMB = fileSize / (1024 * 1024);
  return fileSizeMB <= maxSizeMB;
};

/**
 * Validar URL
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};