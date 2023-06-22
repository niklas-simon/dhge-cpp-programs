#include <cctype>
#include <fstream>
#include <iostream>
#include <map>
#include <string.h>
#include <string>

using namespace std;

template <typename T, typename U>
struct Pair {
    public:
        T first;
        U second;
};

template <typename T>
class Counter : private map<T, int> {
    public:
        void count(T e) {
            auto elem = this->find(e);
            if (elem != this->end()) {
                elem->second++;
            } else {
                this->insert(pair<T, int>(e, 1));
            }
        }
        template <typename T2>
        friend ostream &operator<<(ostream &out, const Counter<T2> &c);
};

template <typename T2>
ostream &operator<<(ostream &out, const Counter<T2> &c) {
    for (auto &e : c) {
        out << e.first << ": " << e.second << endl;
    }
    return out;
}

const int max_line = 4096;

int main(int argc, char **argv) {
    if (argc != 2) {
        cerr << "need 1 argument";
        exit(1);
    }

    Counter<char> cChar = Counter<char>();
    Counter<string> cString = Counter<string>();
    Counter<int> cInt = Counter<int>();

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