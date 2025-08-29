import React from "react";

// Types pour la validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  password?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: { [key: string]: string };
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

// Règles de validation prédéfinies
export const VALIDATION_RULES = {
  required: (value: any): string | null => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "Ce champ est requis";
    }
    return null;
  },

  minLength:
    (min: number) =>
    (value: any): string | null => {
      if (value && typeof value === "string" && value.length < min) {
        return `Minimum ${min} caractères requis`;
      }
      return null;
    },

  maxLength:
    (max: number) =>
    (value: any): string | null => {
      if (value && typeof value === "string" && value.length > max) {
        return `Maximum ${max} caractères autorisés`;
      }
      return null;
    },

  pattern:
    (regex: RegExp, message: string) =>
    (value: any): string | null => {
      if (value && !regex.test(value)) {
        return message;
      }
      return null;
    },

  email: (value: any): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return "Format d'email invalide";
    }
    return null;
  },

  password: (value: any): string | null => {
    if (value) {
      const errors: string[] = [];

      if (value.length < 8) {
        errors.push("Minimum 8 caractères");
      }

      if (!/[A-Z]/.test(value)) {
        errors.push("Au moins une majuscule");
      }

      if (!/[a-z]/.test(value)) {
        errors.push("Au moins une minuscule");
      }

      if (!/\d/.test(value)) {
        errors.push("Au moins un chiffre");
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.push("Au moins un caractère spécial");
      }

      if (errors.length > 0) {
        return errors.join(", ");
      }
    }
    return null;
  },

  username: (value: any): string | null => {
    if (value) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(value)) {
        return "Nom d'utilisateur : 3-20 caractères, lettres, chiffres et underscore uniquement";
      }
    }
    return null;
  },

  dateOfBirth: (value: any): string | null => {
    if (value) {
      const date = new Date(value);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();

      if (isNaN(date.getTime())) {
        return "Date invalide";
      }

      if (age < 13) {
        return "Vous devez avoir au moins 13 ans";
      }

      if (age > 120) {
        return "Date de naissance invalide";
      }
    }
    return null;
  },

  phoneNumber: (value: any): string | null => {
    if (value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        return "Numéro de téléphone invalide";
      }
    }
    return null;
  },
};

// Classe de validation
export class FormValidator {
  private rules: FieldValidation;

  constructor(rules: FieldValidation) {
    this.rules = rules;
  }

  // Valider un champ spécifique
  validateField(fieldName: string, value: any): string | null {
    const fieldRules = this.rules[fieldName];
    if (!fieldRules) return null;

    // Vérifier les règles une par une
    for (const [ruleName, ruleValue] of Object.entries(fieldRules)) {
      let error: string | null = null;

      switch (ruleName) {
        case "required":
          if (ruleValue) {
            error = VALIDATION_RULES.required(value);
          }
          break;

        case "minLength":
          if (typeof ruleValue === "number") {
            error = VALIDATION_RULES.minLength(ruleValue)(value);
          }
          break;

        case "maxLength":
          if (typeof ruleValue === "number") {
            error = VALIDATION_RULES.maxLength(ruleValue)(value);
          }
          break;

        case "pattern":
          if (ruleValue instanceof RegExp) {
            error = VALIDATION_RULES.pattern(
              ruleValue,
              "Format invalide",
            )(value);
          }
          break;

        case "email":
          if (ruleValue) {
            error = VALIDATION_RULES.email(value);
          }
          break;

        case "password":
          if (ruleValue) {
            error = VALIDATION_RULES.password(value);
          }
          break;

        case "username":
          if (ruleValue) {
            error = VALIDATION_RULES.username(value);
          }
          break;

        case "dateOfBirth":
          if (ruleValue) {
            error = VALIDATION_RULES.dateOfBirth(value);
          }
          break;

        case "phoneNumber":
          if (ruleValue) {
            error = VALIDATION_RULES.phoneNumber(value);
          }
          break;

        case "custom":
          if (typeof ruleValue === "function") {
            error = ruleValue(value);
          }
          break;
      }

      if (error) return error;
    }

    return null;
  }

  // Valider tous les champs
  validateForm(formData: { [key: string]: any }): ValidationResult {
    const errors: string[] = [];
    const fieldErrors: { [key: string]: string } = {};

    for (const [fieldName, value] of Object.entries(formData)) {
      const error = this.validateField(fieldName, value);
      if (error) {
        errors.push(error);
        fieldErrors[fieldName] = error;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  }

  // Valider en temps réel (pour l'UX)
  validateFieldRealTime(fieldName: string, value: any): string | null {
    return this.validateField(fieldName, value);
  }
}

// Règles de validation prédéfinies pour les formulaires courants
export const FORM_VALIDATION_RULES = {
  login: {
    username: { required: true, minLength: 3 },
    password: { required: true, minLength: 8 },
  },

  signup: {
    username: { required: true, username: true },
    email: { required: true, email: true },
    password: { required: true, password: true },
    confirmPassword: { required: true },
    sex: { required: true },
    date_of_birth: { required: true, dateOfBirth: true },
  },

  profile: {
    username: { required: true, username: true },
    email: { required: true, email: true },
    phoneNumber: { phoneNumber: true },
    bio: { maxLength: 500 },
  },
};

// Hook personnalisé pour la validation en temps réel
export const useFormValidation = (rules: FieldValidation) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});
  const validator = new FormValidator(rules);

  const validateField = (fieldName: string, value: any) => {
    const error = validator.validateField(fieldName, value);
    setErrors((prev: { [key: string]: string }) => ({
      ...prev,
      [fieldName]: error || "",
    }));
    return error;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  const handleFieldBlur = (fieldName: string, value: any) => {
    setTouched((prev: { [key: string]: boolean }) => ({
      ...prev,
      [fieldName]: true,
    }));
    validateField(fieldName, value);
  };

  const validateForm = (formData: { [key: string]: any }) => {
    const result = validator.validateForm(formData);
    setErrors(result.fieldErrors || {});
    return result;
  };

  const clearErrors = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validateField,
    handleFieldChange,
    handleFieldBlur,
    validateForm,
    clearErrors,
  };
};
