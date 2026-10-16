import { BadRequestException } from '@nestjs/common';

export type ErrorValidacion = string | null;
const PATRON_SECUENCIA = /^[ACGT]+$/;
const PATRON_ENTERO_POSITIVO = /^[1-9]\d*$/;
const PATRON_FECHA = /^(\d{2})-(\d{2})-(\d{4})$/;

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

export function validarTexto(valor: unknown, campo: string, longitudMaxima?: number): ErrorValidacion {
    if (valor === undefined || valor === null) {
        return obligatorio(campo);
    }

    if (typeof valor !== 'string') {
        return `El campo ${campo} debe ser un texto`;
    }

    const limpio = valor.trim();
    if (limpio.length === 0) {
        return `El campo ${campo} no puede estar vacío`;
    }

    if (longitudMaxima !== undefined && limpio.length > longitudMaxima) {
        return `El campo ${campo} no puede tener más de ${longitudMaxima} caracteres (tiene ${limpio.length})`;
    }

    return null;
}

export function validarLista(valor: unknown, campo: string, permitidos: readonly string[]): ErrorValidacion {
    if (valor === undefined || valor === null) {
        return obligatorio(campo);
    }

    if (typeof valor !== 'string' || !permitidos.includes(valor)) {
        return `El campo ${campo} debe ser uno de: ${permitidos.join(', ')}`;
    }

    return null;
}

export function validarId(valor: unknown, campo: string): ErrorValidacion {
    if (valor === undefined || valor === null) {
        return obligatorio(campo);
    }

    if (typeof valor !== 'number' || !Number.isSafeInteger(valor) || valor <= 0) {
        return `El campo ${campo} debe ser un número entero positivo`;
    }

    return null;
}

export function validarIdTexto(valor: unknown, campo: string): ErrorValidacion {
    if (typeof valor !== 'string' || !PATRON_ENTERO_POSITIVO.test(valor)) {
        return `El campo ${campo} debe ser un número entero positivo (se recibió "${String(valor)}")`;
    }

    return null;
}

export function parsearIdRuta(id: string): number {
    lanzarSiHayErrores([validarIdTexto(id, 'id')]);

    return Number(id);
}

export function hoyEnColombia(): string {
    return new Intl.DateTimeFormat('es-CO', {
        timeZone: 'America/Bogota',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date());
}

export function validarFormatoFecha(valor: unknown, campo: string): ErrorValidacion {
    if (valor === undefined || valor === null) {
        return obligatorio(campo);
    }

    if (typeof valor !== 'string') {
        return `El campo ${campo} debe ser un texto con formato DD-MM-YYYY`;
    }

    const partes = PATRON_FECHA.exec(valor);
    if (!partes) {
        return `El campo ${campo} debe tener el formato DD-MM-YYYY (se recibió "${valor}")`;
    }

    const dia = Number(partes[1]);
    const mes = Number(partes[2]);
    const anio = Number(partes[3]);
    const fecha = new Date(Date.UTC(dia, mes - 1, anio));
    if (fecha.getUTCDate() !== dia || fecha.getUTCMonth() !== mes - 1 || fecha.getUTCFullYear() !== anio) {
        return `El campo ${campo} no es una fecha real (se recibió "${valor}")`;
    }

    return null;
}

export function validarFecha(valor: unknown, campo: string): ErrorValidacion {
    const errorFormato = validarFormatoFecha(valor, campo);
    if (errorFormato) {
        return errorFormato;
    }

    const hoy = hoyEnColombia();
    if ((valor as string) > hoy) {
        return `El campo ${campo} no puede ser una fecha futura (se recibió "${String(valor)}", hoy es ${hoy})`;
    }
    return null;
}