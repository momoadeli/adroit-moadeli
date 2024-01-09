
export const convertToValidUrl = (input: string): string | null => {
    try {
      // Check if the URL is valid by trying to create a new URL object
      new URL(input);
      // If no error is thrown, the URL is valid
      return input;
    } catch (e) {
      // If an error is thrown, the URL is not valid
      // Check if the input starts with a protocol
      if (!input.startsWith('http://') && !input.startsWith('https://')) {
        // If not, prepend 'https://' to the input
        return 'https://' + input;
      }
      // If the URL has a protocol but is still invalid, return null or handle as needed
      return null;
    }
  }