#include <iostream>

using namespace std;

class Cat {
    protected:
        char *name;

    public:
        Cat(char *_name) {
            name = _name;
        }
        void meow() {
            cout << name << " says meow!\n";
        }
};

class Ginger : public Cat {
    public:
        Ginger(char *_name) : Cat(_name) {}
        void meow() {
            cout << name << " tries to say meow but is too dumb to do so!\n";
        }
};

int main(int argc, char **argv) {
    srand(time(NULL));
    for (int i = 1; i < argc; i++) {
        if (rand() % 4) {
            Cat(argv[i]).meow();
        } else {
            Ginger(argv[i]).meow();
        }
    }
    return 0;
}
