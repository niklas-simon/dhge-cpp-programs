#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#define LENGTH 10657

char words[LENGTH][5];

char chars[26] = "EARIOTNSLCUDPMHGBFYWKVXZJQ";

char *last;
unsigned int correct = 0x0;
unsigned int present = 0x0;

bool valid(char *guess) {
    for (int i = 0; i < 5; i++) {
        if (!guess[i]) {
            return true;
        }
        if ((correct & (0x1 << i)) && guess[i] != last[i]) {
            return false;
        }
        if (present & (0x1 << i)) {
            bool found = false;
            for (int j = 0; j < 5; j++) {
                if (last[i] == guess[j]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
    }
    // optimization needed
    bool found = false;
    for (int i = 0; i < LENGTH; i++) {
        if (strcmp(words[i], guess) == 0) {
            found = true;
            break;
        }
    }
    return found;
}

bool find_next(char *guess, int index) {
    if (index >= 5) {
        return true;
    }
    for (int i = 0; i < 26; i++) {
        guess[index] = chars[i];
        printf("%s\n", guess);
        if (valid(guess) && find_next(guess, index + 1)) {
            return true;
        }
        guess[index] = '\0';
    }
    return false;
}

int main(int argc, char **argv) {
    if (argc != 3 && argc != 1) {
        fprintf(stderr, "usage: %s [guess value]\n", argv[0]);
        exit(EXIT_FAILURE);
    }
    if (argc == 3) {
        if (strlen(argv[1]) != 5 || strlen(argv[2]) != 5) {
            fprintf(stderr, "%s: guess and value must be of length 5\n", argv[0]);
            exit(EXIT_FAILURE);
        }
        last = argv[1];
        for (int i = 0; i < 5; i++) {
            switch (argv[2][i]) {
                case '1':
                    present |= 0x1 << i;
                case '2':
                    correct |= 0x1 << i;
            }
        }
    }
    
    FILE *wordlist = fopen("words.txt", "r");
    for (int i = 0; i < LENGTH; i++) {
        if (!fgets(words[i], 5, wordlist)) {
            fprintf(stderr, "%s: error reading wordlist\n", argv[0]);
            exit(EXIT_FAILURE);
        }
    }
    fclose(wordlist);

    
    char next[5] = "\0\0\0\0\0";
    if (find_next(next, 0)) {
        printf("%s\n", next);
        return EXIT_SUCCESS;
    } else {
        fprintf(stderr, "%s: no solution found\n", argv[0]);
        return EXIT_FAILURE;
    }
}