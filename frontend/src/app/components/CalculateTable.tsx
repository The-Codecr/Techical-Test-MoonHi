'use client'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { operadores } from '@/Interfaces/data';
import { routes } from '@/api/routes';
import { useState } from 'react';
import axios from "axios";

export default function CalculateTable() {
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [firtsNumError, setFirtsNumError] = useState<string | null>(null);
    const [secondNumError, setSecondNumError] = useState<string | null>(null);
    const [operadorError, setOperadorError] = useState<string | null>(null);
    const [operation, setOperation] = useState('addition');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("");

    const handleFirtsNum = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let { value } = event.target;
        value = formatNumber(value);
        setNum1(value);
    };

    const handleSecondNum = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let { value } = event.target;
        value = formatNumber(value);
        setNum2(value);
    };

    function formatNumber(value: string): string {
        value = value.replace(/[^0-9.]/g, '');
        const [integerPart, decimalPart] = value.split('.');
        if (!decimalPart) {
            return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${formattedIntegerPart}.${decimalPart}`;
    }

    function formatResult(value: number): string {
        return new Intl.NumberFormat('en-CR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }

    function inputValidation() {
        let hasError = false;

        setFirtsNumError(!num1 ? "Please, enter the first number" : null);
        hasError = !num1;

        setSecondNumError(!num2 ? "Please, enter the second number" : null);
        hasError = !num2;

        setOperadorError(!operation ? "Please, select an operator" : null);
        hasError = !operation;

        return !hasError;
    }

    const fetchData = async () => {
        try {
            if (!inputValidation()) {
                return;
            }

            const num1Parsed = parseFloat(num1.replace(/,/g, ''));
            const num2Parsed = parseFloat(num2.replace(/,/g, ''));

            if (isNaN(num1Parsed) || isNaN(num2Parsed)) {
                setError('Please enter valid numbers');
                return;
            }

            const response = await axios.post(routes.calculo, {
                num1: num1Parsed,
                num2: num2Parsed,
                operation,
            });

            setResult(formatResult(response.data.result));
            setError(null);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
                setError(errorMessage);
            } else {
                setError('An unexpected error occurred');
            }
            setResult(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    const resetFields = () => {
        setNum1('');
        setNum2('');
        setResult(null);
        setOperation('Addition');
        setFirtsNumError(null);
        setSecondNumError(null);
        setOperadorError(null);
    };

    return (
        <div className={"h-screen flex justify-center items-center"}>
            <div className="w-96 h-auto bg-neutral-100 text-center rounded-2xl shadow-2xl">
                <div>
                    <h1 className='text-5xl font-semibold mt-10 text-black'>Calculator</h1>
                </div>
                <form className='w-full h-2/3' onSubmit={handleSubmit} >
                    <div className='flex flex-col p-5'>
                        <div className='flex flex-col my-2'>
                            <Label className='text-base font-semibold text-start text-slate-600 '>First Number</Label>
                            <Input
                                type="text"
                                value={num1}
                                onChange={handleFirtsNum}
                                placeholder="Enter firts value"
                                className={`bg-white h-10 p-2 text-black font-medium  text-center ${firtsNumError ? 'border-2 border-red-500' : ''}`}
                                maxLength={15}
                            />
                            {firtsNumError && (
                                <div className="text-red-500 text-lg text-center">{firtsNumError}</div>
                            )}
                        </div>
                        <div className='flex flex-col my-2'>
                            <Label className='text-base font-semibold text-start text-slate-600 '>Second Number</Label>
                            <Input
                                type="text"
                                value={num2}
                                onChange={handleSecondNum}
                                placeholder="Enter second value"
                                className={`bg-white h-10 p-2 text-black font-medium  text-center ${secondNumError ? 'border-2 border-red-500' : ''}`}
                                maxLength={15}
                            />
                            {secondNumError && (
                                <div className="text-red-500 text-lg text-center">{secondNumError}</div>
                            )}
                        </div>
                        <div className='flex flex-col my-2'>
                            <Label className='text-base font-semibold text-start text-slate-600 '>Operation</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={`w-[345px] h-10 justify-between bg-white p-2 text-black font-medium text-center ${secondNumError ? 'border-2 border-red-500' : ''}`}
                                    >
                                        {value
                                            ? operadores.find((operador) => operador.value === value)?.label
                                            : "Select Operator"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[345px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search Operator" />
                                        <CommandList>
                                            <CommandEmpty>No operator found.</CommandEmpty>
                                            <CommandGroup>
                                                {operadores.map((operador) => (
                                                    <CommandItem
                                                        key={operador.value}
                                                        value={operador.value}
                                                        className='font-semibold'
                                                        onSelect={(currentValue) => {
                                                            setValue(currentValue);
                                                            setOperation(currentValue);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                value === operador.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {operador.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {operadorError && (
                                <div className="text-red-500 text-xl text-center">{operadorError}</div>
                            )}
                            {error && <p className="text-red-500 text-lg">Error: {error}</p>}
                        </div>
                        <div className='flex justify-end'>
                            <Button
                                disabled={!num1 || !num2 || !operation}
                                onClick={resetFields}
                                className={`w-15 h-6 bg-orange-500 justify-end rounded-md font-normal text-white hover:bg-orange-600 ${(!num1 || !num2 || !operation) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >Reset
                            </Button>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-500  rounded-md font-semibold text-white p-2 hover:bg-orange-600 mt-5"
                        >
                            Calculate
                        </button>
                    </div>
                </form>
                <div className="w-full h-20 rounded-b-xl mt-5 bg-gradient-to-r from-yellow-300 via-orange-500 to-orange-500">
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        {result !== null && <span className="text-xl font-bold text-start text-black">Result:</span>}
                        {result !== null && <p className="text-3xl font-bold text-start text-black">{result}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
