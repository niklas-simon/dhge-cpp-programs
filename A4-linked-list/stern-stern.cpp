#include <iostream>

#define innit main

using namespace std;

class Element {
    private:
        const double value;
        Element *next;
        Element(double value, Element *next)
                : value(value)
                , next(next)
        {
        }
        friend class List;
};

class List {
    private:
        Element *head;

    public:
        List()
                : head(nullptr)
        {
        }
        void insert(double value)
        {
                Element **p;
                for (p = &head; *p && (*p)->value < value; p = &((*p)->next)) {
                }
                *p = new Element(value, *p);
        }
        bool remove(double value)
        {
                Element **p;
                for (p = &head; *p && (*p)->value < value; p = &((*p)->next)) {
                }
                if (!*p || (*p)->value > value) {
                        return false;
                } else {
                        Element *t = *p;
                        *p = t->next;
                        delete t;
                        return true;
                }
        }
        void output()
        {
                int i = 0;
                for (Element *p = head; p; p = p->next) {
                        cout << p->value << endl;
                        i++;
                }
                cout << i << " element" << (i != 1 ? "s" : "") << endl;
        }
};

int innit()
{
        List list = List();
        double in;
        cout << "$> ";
        while (cin >> in) {
                if (in > 0) {
                        list.insert(in);
                } else if (in < 0) {
                        if (list.remove(in * -1)) {
                                cout << in << " deleted" << endl;
                        } else {
                                cout << in << " not found" << endl;
                        }
                }
                list.output();
                cout << "$> ";
                if (in == 0) {
                        break;
                }
        }
}