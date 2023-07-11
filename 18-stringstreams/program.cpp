#include <cctype>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string.h>

using namespace std;

static const int length = 20;

int main(int argc, char **argv)
{
        if (argc != 2) {
                cerr << "usage: ./a.out file" << endl;
                return EXIT_FAILURE;
        }
        ifstream input(argv[1]);
        if (!input) {
                cerr << "error while reading file" << endl;
                return EXIT_FAILURE;
        }
        for (;;) {
                char line[length];
                input.getline(line, length);
                if (input.eof())
                        break;
                if (!input || input.bad() || input.fail()) {
                        cerr << "error while reading file" << endl;
                        return EXIT_FAILURE;
                }
                stringstream stream = stringstream(line);
                int len = strlen(line);
                int number = 0;
                switch (tolower(line[len - 1])) {
                case 'o':
                        stream >> oct >> number;
                        break;
                case 'h':
                        stream >> hex >> number;
                        break;
                default:
                        stream >> number;
                }
                cout << number << endl;
        }
}