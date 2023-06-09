#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void print(int *arr, int len) {
    static int count = 1;
    printf("%6i: ", count);
    for (int i = 0; i < len; i++) {
        if (i) {
            printf(", ");
        }
        printf("%2i", arr[i]);
    }
    printf("\n");
    count++;
}

int main(int argc, char **argv) {
    srand(time(NULL));

    int len = argc - 1;
    int arr[len];
    for (int i = 1; i < argc; i++) {
        arr[i - 1] = atoi(argv[i]);
    }

    int sorted = 0;
    while (!sorted) {
        // "sort"
        for (int i = 0; i < len; i++) {
            int r = rand() % len;
            int t = arr[i];
            arr[i] = arr[r];
            arr[r] = t;
        }
        // print
        print(arr, len);
        // test
        sorted = 1;
        for (int i = 1; i < len; i++) {
            if (arr[i] < arr[i - 1]) {
                sorted = 0;
                break;
            }
        }
    }
}