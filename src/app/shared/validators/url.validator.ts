import { FormControl } from '@angular/forms';

export const urlValidator = (control: FormControl): { [key: string]: any } | null => {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    const isValid = urlRegex.test(control.value);
    return isValid ? null : { 'invalidUrl': { value: control.value } };
}
