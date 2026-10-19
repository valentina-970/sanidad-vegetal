export function contar(cantidad: number, singular: string, plural: string): string {
    return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}

export function unirConY(partes: string[]): string {
    if (partes.length === 1) {
        return partes[0];
    }
    return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;
}