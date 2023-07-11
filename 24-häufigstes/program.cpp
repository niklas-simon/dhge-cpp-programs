#include <iostream>
#include <string>

using namespace std;

template <class T>
T most(const T *array, const int size, const T &def, int &out)
{
        T best = def;
        out = 0;
        for (int i = 0; i < size; i++) {
                int count = 1;
                for (int j = i + 1; j < size; j++) {
                        if (array[i] == array[j])
                                count++;
                }
                if (out < count) {
                        best = array[i];
                        out = count;
                }
        }
        return best;
}

int main(int argc, char **argv)
{
        string strings[argc - 1];
        int numbers[argc - 1];
        for (int i = 1; i < argc; i++) {
                strings[i - 1] = argv[i];
                numbers[i - 1] = atoi(argv[i]);
        }

        int count;
        cout << "strings: most: "
             << most<string>(strings, argc - 1, "empty", count)
             << " count: " << count << endl;
        cout << "numbers: most: " << most<int>(numbers, argc - 1, 0, count)
             << " count: " << count << endl;
}