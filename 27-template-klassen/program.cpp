#include <cctype>
#include <fstream>
#include <iostream>
#include <string.h>
#include <string>

using namespace std;

template <typename T, typename U>
struct Pair {
    public:
        T first;
        U second;
};

template <typename T, int size>
class Counter {
    public:
        Counter() :
            used(0) {}
        void count(T e) {
            int index = -1;
            for (int i = 0; i < used; i++) {
                if (array[i].first == e) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                array[index].second++;
            } else if (size > used) {
                for (index = used - 1; e < array[index].first && index >= 0; index--) {
                    array[index + 1] = array[index];
                }
                index++;
                array[index] = {e, 1};
                used++;
            } else {
                throw(string) "not enough space in array";
            }
        }
        template <typename T2, int size2>
        friend ostream &operator<<(ostream &out, Counter<T2, size2> &c);

    private:
        Pair<T, int> array[size];
        int used;
};

template <typename T2, int size2>
ostream &operator<<(ostream &out, Counter<T2, size2> &c) {
    for (int i = 0; i < c.used; i++) {
        out << c.array[i].first << ": " << c.array[i].second << endl;
    }
    return out;
}

const int max_line = 4096;

int main(int argc, char **argv) {
    if (argc != 2) {
        cerr << "need 1 argument";
        exit(1);
    }

    Counter cChar = Counter<char, 30>();
    Counter cString = Counter<string, 1000>();
    Counter cInt = Counter<int, 50>();

    ifstream input(argv[1]);
    char line[max_line];
    int begin = -1;
    while (input.getline(line, max_line).good()) {
        int len = strlen(line);
        for (int i = 0; i <= len; i++) {
            if (begin == -1 && !isspace(line[i])) {
                begin = i;
            }
            if (isalpha(line[i])) {
                try {
                    cChar.count(tolower(line[i]));
                } catch (string e) {
                    cerr << e << endl;
                }
            } else if ((isspace(line[i]) || line[i] == '\0') && begin != -1) {
                try {
                    string sub = string(&(line[begin]), i - begin);
                    cString.count(sub);
                    cInt.count(sub.length());
                } catch (string e) {
                    cerr << e << endl;
                }
                begin = -1;
            }
        }
    }
    cout << cChar;
    cout << cString;
    cout << cInt;
}