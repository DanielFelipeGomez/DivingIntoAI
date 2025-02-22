## code review:

generame una code review del siguiente codigo:

function HacerAlgoRaro(x: number, y: number): void {
let resultado = x + y;
console.log("Este console.log es accidental y no debería estar aquí");
console.log(`El resultado es: ${resultado}`);
}

let numero = 10;
numero = 20;

HacerAlgoRaro(numero, 5);
