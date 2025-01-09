/*
*/
export interface invalidMsgObj {
  badInput?: string;
  customError?: string;
  patternMismatch?: string;
  rangeOverflow?: string;
  rangeUnderflow?: string;
  stepMismatch?: string;
  tooLong?: string;
  tooShort?: string;
  typeMismatch?: string;
  valueMissing?: string;
  confirm?: string;
  [key: string]: string | undefined;
}

function getValidityMessage(input: HTMLInputElement):string {
    const validityState = input.validity;
  if (validityState.badInput) {
    return "badInput";
  } else if (validityState.patternMismatch) {
    return "patternMismatch";
  } else if (validityState.rangeOverflow) {
    return "rangeOverflow";
  } else if (validityState.rangeUnderflow) {
    return "rangeUnderflow";
  } else if (validityState.stepMismatch) {
    return "stepMismatch";
  } else if (validityState.tooLong) {
    return "tooLong";
  } else if (validityState.tooShort) {
    return "tooShort";
  } else if (validityState.typeMismatch) {
    return "typeMismatch";
  } else if (validityState.valueMissing) {
    return "valueMissing";
  }
  return "error";
}

export default function invalidMsg(input: HTMLInputElement): string {
  const invalidName = getValidityMessage(input);
  const validity: invalidMsgObj = {
    badInput: "badInput",
    customError: "Custom Error",
    patternMismatch: "El valor no coincide con el formato solicitado",
    rangeOverflow: "El número deve ser menor",
    rangeUnderflow: "El número deve ser mayor",
    stepMismatch: "deve ser valor entero",
    tooLong: "El campo es muy largo.",
    tooShort: "El campo es muy corto.",
    typeMismatch: "El campo no concuerda con el formato requerido.",
    valueMissing: "Por favor, ingresa este campo.",
  };
  let message: invalidMsgObj = {};
  switch (input.name) {
    case "name":
      message = {
        valueMissing: "Por favor, ingresa tu nombre completo.",
        patternMismatch: "Ingresa tu nombre con apellido paterno y materno",
      };
      break;
    case "email":
      message = {
        valueMissing:
          "Por favor, ingresa una cuenta de correo válida ej.: nombre@dominio.com",
        patternMismatch:
          "Por favor, ingresa una cuenta de correo válida ej.: nombre@dominio.com",
      };
      break;
    case "whatsapp":
      message = {
        valueMissing:
          "Por favor, ingresa un número de teléfono valido ej.:55 1234 5678",
        patternMismatch:
          "Por favor, ingresa un número de teléfono valido ej.:55 1234 5678",
        tooShort: "tu número de teléfono debe de tener al menos 10 dígitos",
      };
      break;
  }
  const validityObject = {
    ...validity,
    ...message,
  };
  return validityObject[invalidName] ?? "badInput";
}