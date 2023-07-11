#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

char **last;
char **misplaced;
char present[5];
char correct[5];
char absent[26];

typedef struct LCNT {
    char chr;
    int cnt;
} LCNT;

typedef struct WSCR {
    const char *word;
    int score;
} WSCR;

int lcnt_sort(const void *a, const void *b) {
    return ((LCNT *)b)->cnt - ((LCNT *)a)->cnt;
}

int wscr_sort(const void *a, const void *b) {
    return ((WSCR *)b)->score - ((WSCR *)a)->score;
}

int main(int argc, char **argv) {
    if (argc % 2 != 1) {
        fprintf(stderr, "usage: %s [guess value]*\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    // read wordlist
    FILE *f = fopen("list.txt", "r");
    int used = 1024;
    char **wordlist = malloc(used * sizeof(char *));
    int length;
    char c = getc(f);
    for (length = 0;; length++) {
        if (length >= used) {
            used *= 2;
            wordlist = realloc(wordlist, used * sizeof(char *));
            if (!wordlist) {
                fprintf(stderr, "%s: reallocation error\n", argv[0]);
                exit(EXIT_FAILURE);
            }
        }
        wordlist[length] = malloc(5 * sizeof(char));
        if (!wordlist[length]) {
            fprintf(stderr, "%s: allocation error\n", argv[0]);
            exit(EXIT_FAILURE);
        }
        for (int i = 0; i < 5 && c != EOF && c >= 'a' && c <= 'z'; i++) {
            wordlist[length][i] = c;
            c = getc(f);
        }
        for (;c != EOF && (c < 'a' || c > 'z'); c = getc(f)) {}
        if (c == EOF) {
            break;
        }
    }
    fclose(f);

    // letter count
    LCNT lcnt[26];
    for (int i = 0; i < 26; i++) {
        lcnt[i] = (LCNT){'a' + i, 0};
    }
    for (int i = 0; i < length; i++) {
        for (int j = 0; j < 5; j++) {
            lcnt[wordlist[i][j] - 'a'].cnt++;
        }
    }
    qsort(lcnt, 26, sizeof(LCNT), lcnt_sort);

    // word scores
    WSCR wscr[length];
    for (int i = 0; i < length; i++) {
        int sum = 0;
        for (int j = 0; j < 5; j++) {
            bool found = false;
            for (int k = 0; k < j; k++) {
                if (wordlist[i][j] == wordlist[i][k]) {
                    found = true;
                    break;
                }
            }
            if (found) continue;
            sum += lcnt[wordlist[i][j] - 'a'].cnt;
        }
        wscr[i] = (WSCR){wordlist[i], sum};
    }
    qsort(wscr, length, sizeof(WSCR), wscr_sort);

    // generate words array
    const char *words[length];
    for (int i = 0; i < length; i++) {
        words[i] = wscr[i].word;
    }

    int l_last = (argc - 1) / 2;
    last = malloc(l_last * sizeof(char *));
    misplaced = malloc(l_last * sizeof(char *));
    if (!last) {
        fprintf(stderr, "%s: allocation error\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < 5; i++) {
        present[i] = '\0';
        correct[i] = '\0';
        absent[i] = '\0';
    }
    for (int i = 5; i < 26; i++) {
        absent[i] = '\0';
    }

    for (int i = 0; i < l_last; i++) {
        if (strlen(argv[i * 2 + 1]) != 5 || strlen(argv[i * 2 + 2]) != 5) {
            fprintf(stderr, "%s: guess and value must be of length 5\n", argv[0]);
            exit(EXIT_FAILURE);
        }
        last[i] = argv[i * 2 + 1];

        misplaced[i] = malloc(5 * sizeof(char));
        if (!misplaced[i]) {
            fprintf(stderr, "%s: allocation error\n", argv[0]);
            exit(EXIT_FAILURE);
        }

        for (int j = 0; j < 5; j++) {
            int k;
            misplaced[i][j] = '\0';
            switch (argv[i * 2 + 2][j]) {
                case '0':
                    for (k = 0; k < 26 && absent[k] && argv[i * 2 + 1][j] != absent[k]; k++) {}
                    if (k < 26 && !absent[k]) {
                        absent[k] = argv[i * 2 + 1][j];
                    }
                    break;
                case '1':
                    for (k = 0; k < 5 && present[k] && argv[i * 2 + 1][j] != present[k]; k++) {}
                    if (k < 26 && !present[k]) {
                        present[k] = argv[i * 2 + 1][j];
                    }
                    misplaced[i][j] = argv[i * 2 + 1][j];
                    break;
                case '2':
                    correct[j] = argv[i * 2 + 1][j];
                    break;
            }
        }
    }
    
    int i;
    for (i = 0; i < length; i++) {
        const char *guess = words[i];
        bool found = true;

        // is correct
        for (int j = 0; j < 5; j++) {
            if (correct[j] && guess[j] != correct[j]) {
                found = false;
                break;
            }
        }
        if (!found) {
            continue;
        }

        // is absent
        for (int j = 0; j < 5; j++) {
            for (int k = 0; k < 26; k++) {
                if (!absent[k]) break;
                if (guess[j] == absent[k]) {
                    found = false;
                    break;
                }
            }
            if (!found) {
                break;
            }
        }
        if (!found) {
            continue;
        }

        // is present
        for (int j = 0; j < 5; j++) {
            if (!present[j]) break;
            bool is_present = false;
            for (int k = 0; k < 5; k++) {
                if (present[j] == guess[k]) {
                    is_present = true;
                    break;
                }
            }
            if (!is_present) {
                found = false;
                break;
            }
        }
        if (!found) {
            continue;
        }

        // misplaced placed the same
        for (int j = 0; j < l_last; j++) {
            for (int k = 0; k < 5; k++) {
                if (misplaced[j][k] == guess[k]) {
                    found = false;
                    break;
                }
            }
            if (!found) break;
        }
        if (!found) {
            continue;
        }
        if (found) break;
    }
    if (i < length) {
        printf("%s\n", words[i]);
        exit(EXIT_SUCCESS);
    } else {
        fprintf(stderr, "%s: no solution found\n", argv[0]);
        exit(EXIT_FAILURE);
    }
}