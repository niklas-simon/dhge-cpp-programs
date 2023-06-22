#include <forward_list>
#include <fstream>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
void merge_sort(forward_list<T> *list, vector<T> &vector, int begin, int end) {
    if (end < begin)
        return;
    if (end == begin) {
        list->push_front(vector[begin]);
        return;
    }
    forward_list<T> tmp;
    int middle = begin + (end - begin) / 2;
    merge_sort<T>(list, vector, begin, middle);
    merge_sort<T>(&tmp, vector, middle + 1, end);
    list->merge(tmp);
}

void copy_sorted(string in, string out) {
    ifstream input = ifstream(in);
    ofstream output = ofstream(out);
    if (!input || !output) {
        throw "error opening files!";
    }
    vector<string> vector;
    string line;
    while (getline(input, line).good()) {
        vector.push_back(line);
    }
    forward_list<string> list;
    merge_sort<string>(&list, vector, 0, vector.size() - 1);
    for (string s : list) {
        output << s << endl;
    }
}

int main(int argc, char **argv) {
    if (argc != 3) {
        cerr << "usage: " << argv[0] << " input output" << endl;
        exit(EXIT_FAILURE);
    }
    try {
        copy_sorted(argv[1], argv[2]);
    } catch (const char *e) {
        cerr << argv[0] << ": " << e << endl;
        exit(EXIT_FAILURE);
    }
    exit(EXIT_SUCCESS);
}

// todo: D