#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef uint64_t int64;

int s_count = 0;

void print(int64 queens, int64 guarded) {
    s_count++;
    printf("\n┌───┬───┬───┬───┬───┬───┬───┬───┐\n");
    for (int i = 0; i < 8; i++) {
        printf("│ ");
        for (int j = 0; j < 8; j++) {
            printf("%c │ ", (queens & (0x1LL << ((i * 8) + j))) ? '#' : ' ');
        }
        if (i != 7) {
            printf("\n├───┼───┼───┼───┼───┼───┼───┼───┤\n");
        } else {
            printf("\n└───┴───┴───┴───┴───┴───┴───┴───┘\n");
        }
    }
}

/**
 * solve the 8-queens-problem
 * @param queens grid of 8x8 queens represented by a 1 in binary representation
 * @param guarded grid of tiles all current queens are guarding
 * @param index current number of queen to be placed
*/
void solve(int64 queens, int64 guarded, int row) {
    int64 newguarded, newqueens;
    if (row >= 8) {
        print(queens, guarded);
        return;
    }
    for (int col = 0; col < 8; col++) {
        if (!((0x1LL << (row * 8 + col)) & guarded)) {
            newqueens = queens | (0x1LL << (row * 8 + col)); // insert queen where she belongs
            newguarded = guarded | (0xffLL << (row << 3)) // row of ones shifted into row where queen is (i / 8)
                | (0x0101010101010101LL << col); // col of ones shifted into col where queen is (i % 8)
            if (col > row) {
                // shift diag-pattern difference rows up
                newguarded |= 0x8040201008040201LL >> ((col - row) << 3);
            } else {
                // shift diag-pattern difference rows down
                newguarded |= 0x8040201008040201LL << ((row - col) << 3);
            }
            if ((7 - col) > row) {
                // shift diag2-pattern difference rows up
                newguarded |= 0x102040810204080LL >> (((7 - col) - row) << 3);
            } else {
                // shift diag2-pattern difference rows down
                newguarded |= 0x102040810204080LL << ((row - (7 - col)) << 3);
            }
            solve(newqueens, newguarded, row + 1);
        }
    }
}

int main(int argc, char **argv) {
    solve(0x0LL, 0x0LL, 0);
    printf("\nfound %d solutions\n", s_count);
}