#include <iostream>

using namespace std;

const int max = 256;

class Number {
    public:
        Number(int _value, Number *_next, Number *_last)
        {
                value = _value;
                next = _next;
                last = _last;
                count = 1;
        }

        int value;
        int count;
        Number *next;
        Number *last;

        void increment()
        {
                count++;
        }
};

class Array {
    private:
        Number *head = nullptr;
        void add(int value)
        {
                if (!head) {
                        Number *_new = new Number(value, nullptr, nullptr);
                        head = _new;
                        return;
                }
                if (head->value > value) {
                        Number *_new = new Number(value, head, nullptr);
                        head->last = _new;
                        head = _new;
                        return;
                }
                Number *ptr = head;
                while (ptr->next && ptr->next->value < value) {
                        ptr = ptr->next;
                }
                Number *_new = new Number(value, ptr->next, ptr);
                if (ptr->next) {
                        ptr->next->last = _new;
                }
                ptr->next = _new;
        }

    public:
        Array(Number *_head = nullptr)
        {
                head = _head;
        }
        void addOrIncrement(int value)
        {
                Number *ptr = head;
                while (ptr) {
                        if (ptr->value == value) {
                                ptr->increment();
                                return;
                        }
                        ptr = ptr->next;
                }
                add(value);
        }
        void print()
        {
                Number *ptr = head;
                while (ptr) {
                        cout << ptr->value << ": " << ptr->count << endl;
                        ptr = ptr->next;
                }
        }
};

int main(int argc, char **argv)
{
        Array array;

        for (int i = 1; i < argc; i++) {
                array.addOrIncrement(atoi(argv[i]));
        }
        array.print();

        return 0;
}