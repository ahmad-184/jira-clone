type ConvertDateFields<T> = T extends object
  ? {
      [K in keyof T]: K extends "createdAt" | "dueDate" | "emailVerified"
        ? Date // Convert both fields to Date
        : ConvertDateFields<T[K]>; // Recurse for nested objects
    }
  : T;

export function convertToDate<T extends object>(obj: T): ConvertDateFields<T> {
  const converted: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (key === "createdAt" || key === "dueDate" || key === "emailVerified") {
        // Convert string to Date, preserve existing Dates
        converted[key] = typeof value === "string" ? new Date(value) : value;
      } else if (typeof value === "object" && value !== null) {
        // Recurse for nested objects/arrays
        converted[key] = convertToDate(value);
      } else {
        converted[key] = value;
      }
    }
  }

  return converted as ConvertDateFields<T>;
}
