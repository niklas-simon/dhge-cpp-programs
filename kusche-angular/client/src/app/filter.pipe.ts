import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe<T> implements PipeTransform {

    transform(array: T[], key: string, value: any): T[] {
        return array.filter(e => (e as any)[key] === value);
    }

}
