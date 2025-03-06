export const rules = [
  {
    id: 1,
    error: "Orden incorrecto de las propiedades en componentes",
    correction:
      "Ordenar las propiedades en los componentes en un orden lógico y alfabético dentro de cada grupo.",
    reason: "Mantiene la coherencia y mejora la legibilidad del código.",
    example_wrong: {
      code: '<input [type]="type" [id]="id" matInput class="mdc-text-field__input">',
    },
    example_correct: {
      code: '<input matInput class="mdc-text-field__input" [id]="id" [type]="type">',
    },
  },
  {
    id: 2,
    error: "Uso de 'any' en tipado de TypeScript",
    correction: "Utilizar tipos específicos en lugar de 'any'.",
    reason:
      "Mejora la seguridad del tipo y previene errores en tiempo de ejecución.",
    example_wrong: {
      code: "let data: any;",
    },
    example_correct: {
      code: "let data: string | number;",
    },
  },
  {
    id: 3,
    error: "No usar AAA en pruebas unitarias",
    correction: "Seguir la estructura Arrange-Act-Assert en pruebas unitarias.",
    reason: "Facilita la comprensión y mantenimiento del código de prueba.",
    example_wrong: {
      code: "it('suma dos números', () => { expect(add(2, 3)).toBe(5); });",
    },
    example_correct: {
      code: "it('suma dos números', () => {\n  // Arrange\n  const num1 = 2;\n  const num2 = 3;\n  const expected = 5;\n\n  // Act\n  const result = add(num1, num2);\n\n  // Assert\n  expect(result).toBe(expected);\n});",
    },
  },
  {
    id: 4,
    error: "Uso de valores absolutos en CSS",
    correction:
      "Utilizar variables de _spacing.scss en lugar de valores absolutos.",
    reason: "Permite un diseño más consistente y mantenible.",
    example_wrong: {
      code: "margin: 10px;",
    },
    example_correct: {
      code: "margin: $spacing-m;",
    },
  },
  {
    id: 5,
    error: "No verificar el estado del componente en pruebas",
    correction: "Comprobar el estado del componente además del DOM.",
    reason:
      "Asegura que los cambios afectan correctamente la lógica interna del componente.",
    example_wrong: {
      code: "expect(inputElement.value).toBe('test value');",
    },
    example_correct: {
      code: "inputElement.dispatchEvent(new Event('input'));\nexpect(component.model.value).toBe('test value');",
    },
  },
  {
    id: 6,
    error: "Uso de 'NO_ERRORS_SCHEMA' en Angular",
    correction: "Utilizar 'CUSTOM_ELEMENTS_SCHEMA' en su lugar.",
    reason:
      "Permite solo elementos personalizados válidos, evitando ocultar errores.",
    example_wrong: {
      code: "schemas: [NO_ERRORS_SCHEMA]",
    },
    example_correct: {
      code: "schemas: [CUSTOM_ELEMENTS_SCHEMA]",
    },
  },
  {
    id: 7,
    error: "Uso innecesario de 'fakeAsync' y 'async' en pruebas",
    correction: "Eliminar 'fakeAsync' y 'async' cuando no sean necesarios.",
    reason: "Simplifica el código y mejora el rendimiento de las pruebas.",
    example_wrong: {
      code: "it('should test async function', fakeAsync(() => { myAsyncFunction(); tick(); expect(result).toBe(true); }));",
    },
    example_correct: {
      code: "it('should test async function', () => { myAsyncFunction(); expect(result).toBe(true); });",
    },
  },
  {
    id: 8,
    error: "Uso de bucles manuales en lugar de métodos de array",
    correction: "Utilizar métodos de array como 'map' en lugar de 'for'.",
    reason: "Código más legible y menos propenso a errores.",
    example_wrong: {
      code: "const names = []; for (let i = 0; i < items.length; i++) { names.push(items[i].name); }",
    },
    example_correct: {
      code: "const names = items.map(item => item.name);",
    },
  },
  {
    id: 9,
    error: "Uso de módulos compartidos innecesarios",
    correction:
      "Evitar importar SharedModule directamente en componentes independientes.",
    reason: "Reduce dependencias innecesarias y mejora la modularidad.",
    example_wrong: {
      code: "imports: [SharedModule]",
    },
    example_correct: {
      code: "imports: [ErrorDisplayModule, DialogModule, MatIconModule]",
    },
  },
  {
    id: 10,
    error: "No eliminar console.logs y comentarios innecesarios",
    correction:
      "Eliminar 'console.log' y comentarios temporales antes de fusionar el código.",
    reason: "Mantiene el código limpio y profesional.",
    example_wrong: {
      code: "console.log('Debugging value:', value); // TODO: Remove before merge",
    },
    example_correct: {
      code: "// Código limpio sin console.logs innecesarios",
    },
  },
];
