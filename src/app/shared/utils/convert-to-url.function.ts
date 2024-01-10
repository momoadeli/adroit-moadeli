
export const convertToValidUrl = (input: string): string | null => {
    try {
        new URL(input);
        return input;
    } catch (e) {
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
            return 'https://' + input;
        }
        return null;
    }
}