#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    int n = atoi(argv[1]);
    for (int i = n / 2; i > 1; i--) {
        bool is_prime = true;
        for (int j = i - 1; j > 1; j--) {
            if (i % j == 0) {
                is_prime = false;
                break;
            }
        }
        if (is_prime) {
            while (n % i == 0) {
                printf("%i", i);
                n /= i;
                if (n != 1)
                    printf(" * ");
            }
            if (n == 1)
                break;
        }
    }
    if (n != 1)
        printf("%i\n", n);
}