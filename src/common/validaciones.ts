import { BadRequestException } from '@nestjs/common';

export type ErrorValidacion = string | null;

function obligatorio(campo: string): string {
    return `El campo ${campo} es obligatorio`;
}

export function lanzarSiHayErrores(errores: ErrorValidacion[]): void {
    const mensajes = errores.filter((error): error is string =>  error !== null);

    if (mensajes.length > 0) {
        throw new BadRequestException(mensajes);
    }
}

export function validarBodyNoVacio(body: unknown): void {
    if (typeof body !== 'object' || body === null || Array.isArray(body) ||Object.keys(body).length === 0) {
        throw new BadRequestException(['El cuerpo de la petición no puede estar vacio']);
    }
}

