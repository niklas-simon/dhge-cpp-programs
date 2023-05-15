#include <fstream>
#include <iostream>

using namespace std;

int main(int argc, char **argv) {
    if (atoi(argv[1]) == 1) {
        // Task 1
        ifstream input(argv[2]);
        ofstream output(argv[3]);
        for (;;) {
            char c = input.get();
            if (input.eof())
                break;
            if (!input || input.fail() || input.bad()) {
                cerr << "error while reading file" << endl;
                break;
            }
            if (c >= 65 && c <= 90) {
                c += 32;
            }
            output.put(c);
            if (!output || output.fail() || output.bad()) {
                cerr << "error while writing file" << endl;
                break;
            }
        }
    } else if (atoi(argv[1]) == 2) {
        // Task 2
        const int length = 80;
        ifstream input(argv[2]);
        for (;;) {
            char cline[length];
            input.getline(cline, length);
            string line = cline;
            // weiter das nächste mal
        }
    }
}