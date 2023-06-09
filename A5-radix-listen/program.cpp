static const int e_count = 100;
static const int d_count = 3;

#include <iostream>
#include <time.h>

using namespace std;

class Element {
    private:
        friend class List;
        short int digits[d_count];
        int id;
        Element *next;
        static int id_counter;
        Element() :
            id(id_counter++), next(nullptr) {
            for (int i = 0; i < d_count; i++) {
                digits[i] = rand() % 10;
            }
        }
        void print() {
            cout << id << ":\t";
            for (int i = 0; i < d_count; i++) {
                cout << digits[i];
            }
            cout << endl;
        }
};

int Element::id_counter = 1;

class List {
    private:
        Element *head, *tail;

    public:
        List() {
            head = tail = nullptr;
        }
        Element *removeFirst() {
            if (!head)
                return nullptr;
            Element *t = head;
            head = t->next;
            if (!head)
                tail = nullptr;
            return t;
        }
        void append(Element *e) {
            if (!head)
                head = e;
            if (tail)
                tail->next = e;
            tail = e;
            e->next = nullptr;
        }
        void append(List &l) {
            if (!l.head)
                return;
            if (!head) {
                head = l.head;
                tail = l.tail;
            } else {
                tail->next = l.head;
                tail = l.tail;
                tail->next = nullptr;
            }
            l.head = l.tail = nullptr;
        }
        List &sort() {
            List buckets[10];
            for (int i = d_count - 1; i >= 0; i--) {
                for (Element *e = removeFirst(); e; e = removeFirst()) {
                    buckets[e->digits[i]].append(e);
                }
                for (int j = 0; j < 10; j++) {
                    append(buckets[j]);
                }
            }
            return *this;
        }
        List &fill(int n) {
            for (int i = 0; i < n; i++) {
                append(new Element());
            }
            return *this;
        }
        List &print() {
            for (Element *e = head; e; e = e->next) {
                e->print();
            }
            cout << endl;
            return *this;
        }
};

int main() {
    srand(time(nullptr));
    List l = List();
    l.fill(e_count).print().sort().print();
}