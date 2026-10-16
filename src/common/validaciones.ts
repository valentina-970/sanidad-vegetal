import { BadRequestException } from '@nestjs/common';

export type ErrorValidacion = string | null;
const PATRON_SECUENCIA = /^[ACGT]+$/;

function obligatorio(campo: string): string {
    return `El campo ${campo} es obligatorio`;
}

export function lanzarSiHayErrores(errores: ErrorValidacion[]): void {
    const mensajes = errores.filter((error): error is string => error !== null);

    if (mensajes.length > 0) {
        throw new BadRequestException(mensajes);
    }
}

export function validarBodyNoVacio(body: unknown): void {
    if (typeof body !== 'object' || body === null || Array.isArray(body) || Object.keys(body).length === 0) {
        throw new BadRequestException(['El cuerpo de la petición no puede estar vacio']);
    }
}

export function validarSecuencia(valor: unknown, campo: string): ErrorValidacion {
    if (valor === undefined || valor === null) {
        return obligatorio(campo);
    }

    if (typeof valor !== 'string') {
        return `El campo ${campo} debe ser un texto`;
    }

    if (valor.trim().length === 0) {
        return `El campo ${campo} no puede estar vacio`;
    }

    if (!PATRON_SECUENCIA.test(valor)) {
        return `El campo ${campo} solo puede contener las letras A, C, G y T en mayúscula`;
    }
    
    return null;
}