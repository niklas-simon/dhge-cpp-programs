#include <fstream>
#include <iostream>

using namespace std;

int main(int argc, char **argv)
{
        if (atoi(argv[1]) == 1) {
                // Task 1
                ifstream input(argv[2]);
                if (!input) {
                        cerr << "error while reading file" << endl;
                        return EXIT_FAILURE;
                }
                ofstream output(argv[3]);
                if (!output) {
                        cerr << "error while reading file" << endl;
                        return EXIT_FAILURE;
                }
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
                for (int i = 2; i < argc; i++) {
                        ifstream input(argv[i]);
                        if (!input) {
                                cerr << "error while reading file" << endl;
                                continue;
                        }
                        for (;;) {
                                char cline[length + 1];
                                input.getline(cline, length);
                                if (input.eof())
                                        break;
                                if (!input || input.fail() || input.bad()) {
                                        cerr << "error while reading file"
                                             << endl;
                                        break;
                                }
                                string line = cline;
                                string spaces = "";
                                for (int _ = 0;
                                     _ < (length - line.length()) / 2; _++) {
                                        spaces += " ";
                                }
                                line = spaces + line + spaces;
                                cout << line << endl;
                        }
                }
        }
}