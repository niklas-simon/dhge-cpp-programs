#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

int c, n, t1, t2, t3, i, check_i, is_prime, j, check_j;

int main(int argc, char **argv) {
    // int n = atoi(argv[1]);
    c = getc(stdin);
    n = 0;
    while (c != EOF && c >= '0' && c <= '9') {
        // n *= 10
        t1 = 9;
        t2 = 0;
        t3 = 0;
        while (n) {
            t2++;
            t3++;
            n--;
        }
        while (t3) {
            n++;
            t3--;
        }
        while (t1) {
            t1--;
            while (t2) {
                t3++;
                n++;
                t2--;
            }
            while (t3) {
                t2++;
                t3--;
            }
        }
        t2 = 0;
        c -= '0';
        while (c) {
            n++;
            t2++;
            c--;
        }
        t2 = 0;
        c = getc(stdin);
    }
    // for (int i = n; i > 1; i--) {
    i = 0;
    while (n) {
        i++;
        t1++;
        n--;
    }
    while (t1) {
        n++;
        t1--;
    }
    check_i = 0;
    while (i) {
        check_i++;
        t1++;
        i--;
    }
    while (t1) {
        i++;
        t1--;
    }
    check_i--;
    while (check_i) {
        // bool is_prime = true;
        is_prime = 1;
        // for (int j = i - 1; j > 1; j--) {
        j = 0;
        while (i) {
            t1++;
            j++;
            i--;
        }
        while (t1) {
            i++;
            t1--;
        }
        j--;
        check_j = 0;
        while (j) {
            check_j++;
            t1++;
            j--;
        }
        while (t1) {
            j++;
            t1--;
        }
        check_j--;
        while (check_j) {
            if (i % j == 0) {
                is_prime = false;
                break;
            }
            j--;
            check_j = 0;
            while (j) {
                check_j++;
                t1++;
                j--;
            }
            while (t1) {
                j++;
                t1--;
            }
            check_j--;
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
        //...
        i--;
        check_i = 0;
        while (i) {
            check_i++;
            t1++;
            i--;
        }
        while (t1) {
            i++;
            t1--;
        }
        check_i--;
    }
    if (n != 1)
        printf("%i", n);
    printf("\n");
}