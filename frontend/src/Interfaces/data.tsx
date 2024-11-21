export interface Operador {
    value: string;
    label: string; 
}

export const operadores: Operador[] = [
    { value: "addition", label: "+ Addition" },
    { value: "subtraction", label: "- Subtraction" },
    { value: "multiplication", label: "* Multiplication" },
    { value: "division", label: "/ Division" },
];
