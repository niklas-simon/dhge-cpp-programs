#include <iostream>
#include <string>

#define innit main

using namespace std;

template <typename T> class List;

template <typename T> class Element {
    private:
        const T value;
        Element<T> *next;
        Element<T> *last;
        Element(T value, Element<T> *next, Element<T> *last)
                : value(value)
                , next(next)
                , last(last)
        {
        }
        friend class List<T>;
};

template <typename T> class List {
    private:
        Element<T> *head;

    public:
        List()
                : head(nullptr)
        {
        }
        void insert(T value)
        {
                if (!head || value < head->value) {
                        head = new Element<T>(value, head, nullptr);
                        if (head->next)
                                head->next->last = head;
                } else {
                        Element<T> *p;
                        for (p = head; p->next && p->next->value < value;
                             p = p->next) {
                        }
                        Element<T> *e = new Element<T>(value, p->next, p);
                        p->next = e;
                        if (e->next) {
                                e->next->last = e;
                        }
                }
        }
        Element<T> *find(T value)
        {
                Element<T> *p;
                for (p = head; p && p->value < value; p = p->next) {
                }
                if (p && p->value == value)
                        return p;
                return nullptr;
        }
        bool remove(T value)
        {
                Element<T> *e = find(value);
                if (!e)
                        return false;
                if (e->last) {
                        e->last->next = e->next;
                } else {
                        head = e->next;
                }
                if (e->next) {
                        e->next->last = e->last;
                }
                delete e;
        }
        void output()
        {
                int i = 0;
                for (Element<T> *p = head; p; p = p->next) {
                        cout << p->value << endl;
                        i++;
                }
                cout << i << " element" << (i != 1 ? "s" : "") << endl;
        }
};

int innit()
{
        List<double> list;
        double in;
        cout << "$> ";
        while (cin >> in) {
                if (in > 0) {
                        list.insert(in);
                } else if (in < 0) {
                        double d = in * -1;
                        if (list.remove(d)) {
                                cout << d << " deleted" << endl;
                        } else {
                                cout << d << " not found" << endl;
                        }
                }
                list.output();
                cout << "$> ";
                if (!in) {
                        break;
                }
        }
}