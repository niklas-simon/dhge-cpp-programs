#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

typedef struct Item {
        char name[20];
        double value;
        double weight;
        double ratio;
        bool curr_packed;
        bool opt_packed;
} Item;

#define MAX_ITEMS 30

int calls = 0;

double solve(Item *items, int size, int index, double max_weight,
             double curr_weight, double curr_value, double optimal)
{
        calls++;
        if (index >= size) {
                if (curr_value > optimal) {
                        for (int i = 0; i < size; i++) {
                                items[i].opt_packed = items[i].curr_packed;
                        }
                        optimal = curr_value;
                }
                return optimal;
        }

        double possible = curr_value + items[index].ratio * (size - index);
        if (possible <= optimal) {
                return optimal;
        }

        items[index].curr_packed = false;
        optimal = solve(items, size, index + 1, max_weight, curr_weight,
                        curr_value, optimal);
        if (curr_weight + items[index].weight < max_weight) {
                items[index].curr_packed = true;
                optimal = solve(items, size, index + 1, max_weight,
                                curr_weight + items[index].weight,
                                curr_value + items[index].value, optimal);
        }
        return optimal;
}

int sort(const void *a, const void *b)
{
        return ((Item *)a)->ratio > ((Item *)b)->ratio ? -1 : 1;
}

int main(int argc, char **argv)
{
        if (argc != 3) {
                fprintf(stderr, "usage: %s items max_weight\n", argv[0]);
                exit(EXIT_FAILURE);
        }

        FILE *input = fopen(argv[1], "r");
        if (!input) {
                fprintf(stderr, "%s: error while opening file %s: %s\n",
                        argv[0], argv[1], strerror(errno));
                exit(errno);
        }
        Item items[MAX_ITEMS];
        int count;
        for (count = 0; count < MAX_ITEMS; count++) {
                int res = fscanf(input, "%s %lf %lf\n", items[count].name,
                                 &(items[count].value), &(items[count].weight));
                if (res == -1) {
                        break;
                }
                if (res < 3) {
                        fprintf(stderr,
                                "%s: error while reading from file %s: invalid structure: %d\n",
                                argv[0], argv[1], res);
                        exit(EXIT_FAILURE);
                }
                items[count].ratio = items[count].value / items[count].weight;
        }
        qsort(items, count, sizeof(Item), sort);

        double max_weight = atof(argv[2]);

        double optimal = solve(items, count, 0, max_weight, 0, 0, 0);

        for (int i = 0; i < count; i++) {
                if (items[i].opt_packed) {
                        printf("%20s (weight: %1f, value: %1f)\n",
                               items[i].name, items[i].weight, items[i].value);
                }
        }
        printf("sum value: %f\n", optimal);
        printf("needed %d solve calls\n", calls);

        return EXIT_SUCCESS;
}