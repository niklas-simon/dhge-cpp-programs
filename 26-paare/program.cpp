#include <iostream>
#include <string>

using namespace std;

template <class T, class U>
class Pair {
    public:
        Pair() {}
        Pair(const T first, const U second) :
            first(first), second(second) {}
        T getFirst() const { return first; }
        U getSecond() const { return second; }
        bool operator==(const Pair<T, U> &pair) const {
            return pair.first == first;
        }
        bool operator<(const Pair<T, U> &pair) const {
            return first < pair.first;
        }

    private:
        T first;
        U second;
};

template <class T>
class Array {
    public:
        Array(const int size) :
            size(size) {
            array = new T[size];
            used = 0;
        }
        ~Array() {
            delete[] array;
        }
        bool add(const T &e) {
            if (used >= size) {
                return false;
            }
            array[used] = e;
            used++;
            return true;
        }
        T *smallest() const {
            T *best = NULL;
            for (int i = 0; i < used; i++) {
                if (!best || array[i] < *best) {
                    best = &(array[i]);
                }
            }
            return best;
        }
        T *next(const T &ref) const {
            T *best = NULL;
            for (int i = 0; i < used; i++) {
                if (ref < array[i] && (!best || array[i] < *best)) {
                    best = &(array[i]);
                }
            }
            return best;
        }

    private:
        T *array;
        int size;
        int used;
};

typedef Pair<string, int> StrInt;

int main(int argc, char **argv) {
    Array array = Array<StrInt>(argc - 1);
    for (int i = 1; i < argc; i++) {
        StrInt e = StrInt(argv[i], i);
        if (!array.add(e)) {
            cout << "failed to add " << i << "th element" << endl;
        }
    }
    for (StrInt *ptr = array.smallest(); ptr; ptr = array.next(*ptr)) {
        cout << ptr->getSecond() << ": " << ptr->getFirst() << endl;
    }
}