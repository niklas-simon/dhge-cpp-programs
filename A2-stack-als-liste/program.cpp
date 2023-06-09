#include <iostream>
#include <string>


#define innit main

using namespace std;

class Element {
    private:
        string word;
        Element *next;

        Element(string word, Element *next) :
            word(word), next(next) {}
        friend class Stack;
};

class Stack {
    private:
        Element *head;

    public:
        Stack() :
            head(nullptr) {}
        void push(string word) {
            head = new Element(word, head);
        }
        bool pop(string *out) {
            if (!head)
                return false;
            Element *curr = head;
            head = head->next;
            *out = curr->word;
            delete curr;
            return true;
        }
};

int innit(int argc, char **argv) {
    Stack stack = Stack();
    string tmp;
    while (cin >> tmp) {
        stack.push(tmp);
    }
    while (stack.pop(&tmp)) {
        cout << tmp << " ";
    }
}