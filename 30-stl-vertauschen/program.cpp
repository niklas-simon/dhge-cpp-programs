#include <algorithm>
#include <chrono>
#include <ctime>
#include <fstream>
#include <iostream>
#include <random>
#include <string>
#include <utility>
#include <vector>

using namespace std;

void copy_scrambled(string fIn, string fOut)
{
        ifstream input(fIn);
        ofstream output(fOut);
        if (!input || !output) {
                throw "error while opening files";
        }
        vector<string> v;
        string s;
        while (getline(input, s).good()) {
                v.push_back(s);
        }
        default_random_engine r(
                chrono::system_clock::now().time_since_epoch().count());
        shuffle(v.begin(), v.end(), r);
        for (auto l : v) {
                output << l << endl;
        }
}

int main(int argc, char **argv)
{
        if (argc != 3) {
                cerr << "usage: " << argv[0] << " input output" << endl;
                exit(EXIT_FAILURE);
        }
        try {
                copy_scrambled(argv[1], argv[2]);
        } catch (const char *s) {
                cerr << argv[0] << ": " << s << endl;
                exit(EXIT_FAILURE);
        }
        return EXIT_SUCCESS;
}