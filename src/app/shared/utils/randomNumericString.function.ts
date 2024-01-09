export const generateRandomNumericString = (length: number): string =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
