#include <cctype>
#include <cmath>
#include <iostream>
#include <map>
#include <string>

using namespace std;

class Node {
    private:
        string word;
        int count;
        Node *left, *right;
        friend class Tree;

    public:
        Node(string word) :
            word(word), count(1), left(nullptr), right(nullptr) {}
        Node(string word, int count, Node *left, Node *right) :
            word(word), count(count), left(left), right(right) {}
        Node(Node &n) = delete;
        Node &operator=(Node &n) = delete;
        string getWord() { return word; }
        int getCount() { return count; }
        friend ostream &operator<<(ostream &s, Node &node);
        friend ostream &operator<<(ostream &s, Node *node);
};

ostream &operator<<(ostream &s, Node &node) {
    s << node.word << ": " << node.count << endl;
    return s;
}
ostream &operator<<(ostream &s, Node *node) {
    if (!node)
        return s;
    s << node->left << *node << node->right;
    return s;
}

class Tree {
    private:
        Node *root;
        void _destroy(Node *n) {
            if (!n)
                return;
            _destroy(n->right);
            _destroy(n->left);
            delete n;
        }
        void _print(Node *n, bool is_top, string indent) {
            if (!n)
                return;
            if (indent.length() > 70) {
                cout << indent << (is_top ? "/" : "\\") << "-> ..." << endl;
                return;
            }
            _print(n->left, true, indent + (is_top ? "    " : "|   "));
            if (indent.empty()) {
                cout << "-->" << *n;
            } else {
                cout << indent << (is_top ? "/" : "\\") << "->" << *n;
            }
            if (is_top && !indent.empty()) {
                _print(n->right, false, indent + "|   ");
            } else {
                _print(n->right, false, indent + "    ");
            }
        }
        int _size(Node *n) {
            if (!n)
                return 0;
            return 1 + _size(n->left) + _size(n->right);
        }
        int _depth(Node *n, int max = 0, int curr = 0) {
            if (!n)
                return curr > max ? curr : max;
            int dl = _depth(n->left, max, curr + 1);
            int dr = _depth(n->right, max, curr + 1);
            return dl > dr ? dl : dr;
        }
        void _nodes_per_layer(Node *n, int *nodes, int layer = 0) {
            if (!n)
                return;
            nodes[layer]++;
            _nodes_per_layer(n->left, nodes, layer + 1);
            _nodes_per_layer(n->right, nodes, layer + 1);
        }
        Node *_copy(Node *n) {
            if (!n)
                return nullptr;
            return new Node(n->word, n->count, _copy(n->left), _copy(n->right));
        }

    public:
        Tree() :
            root(nullptr) {}
        Tree(Tree &n) :
            root(_copy(n.root)) {}
        Tree &operator=(Tree &n) = delete;
        ~Tree() {
            _destroy(root);
        }
        void count(string word) {
            Node **p;
            for (p = &root; *p && (*p)->word != word; p = word < (*p)->word ? &((*p)->left) : &((*p)->right)) {
            }
            if (*p) {
                (*p)->count++;
            } else {
                *p = new Node(word);
            }
        }
        void print() {
            _print(root, true, "");
        }
        int size() {
            return _size(root);
        }
        void stats() {
            int s = size();
            int d = _depth(root);

            int nodes[d];
            for (int i = 0; i < d; i++)
                nodes[i] = 0;
            _nodes_per_layer(root, nodes);
            for (int i = 0; i < d; i++) {
                cout << i + 1 << ": " << nodes[i] << " (" << (double)nodes[i] * 100 / s << "%)" << endl;
            }

            double sum = 0;
            double sum2 = 0;
            if (s > 0) {
                for (int i = 0; i < d; i++) {
                    sum += nodes[i] * (i + 1);
                }
                sum /= s;

                int tmp = s;
                int td;
                for (td = 0; s > pow(2, td); td++) {
                }
                for (int i = 0; tmp > pow(2, i); tmp -= pow(2, i)) {
                    sum2 += pow(2, i) * (td - i);
                }
                sum2 += tmp;
                sum2 /= s;
            }
            cout << "size: " << s << " depth: max: " << d << " average: " << sum << " optimal: " << sum2 << endl;
        }
        Node *first() {
            if (!root)
                return nullptr;
            Node *p;
            for (p = root; p->left; p = p->left) {
            }
            return p;
        }
        Node *next(string word) {
            Node *last = nullptr;
            Node *p = root;
            for (;;) {
                if (!p) {
                    return last;
                } else if (p->word > word) {
                    last = p;
                    p = p->left;
                } else {
                    p = p->right;
                }
            }
        }
        int remove(string word) {
            Node **p = &root;
            for (;;) {
                if (!*p) {
                    return 0;
                } else if (word < (*p)->word) {
                    p = &((*p)->left);
                } else if (word > (*p)->word) {
                    p = &((*p)->right);
                } else {
                    break;
                }
            }
            Node *n = *p;
            int count = n->count;
            if (n->left && n->right) {
                Node *successor = n->left;
                Node *parent = n;
                for (; successor->right; successor = successor->right) {
                    parent = successor;
                }
                n->word = successor->word;
                n->count = successor->count;
                if (parent == n) {
                    n->left = successor->left;
                } else {
                    parent->right = successor->left;
                }
                delete successor;
            } else {
                if (n->left) {
                    *p = n->left;
                } else {
                    *p = n->right;
                }
                delete n;
            }
            return count;
        }
        friend ostream &operator<<(ostream &s, Tree &tree);
};

ostream &operator<<(ostream &s, Tree &tree) {
    s << tree.root;
    return s;
}

template <typename T, typename U>
ostream &operator<<(ostream &s, const pair<T, U> &p) {
    s << p.first << ": " << p.second << endl;
    return s;
}

template <typename T, typename U>
ostream &operator<<(ostream &s, const map<T, U> &m) {
    for (auto p : m) {
        s << p;
    }
    return s;
}

bool read(string *out) {
    out->clear();
    for (char c = cin.get(); cin.good(); c = cin.get()) {
        if (isalpha(c) || (!out->empty() && c == '\'')) {
            *out += c;
        } else if (!out->empty()) {
            return true;
        }
    }
    return !out->empty();
}

int main(int argc, char **argv) {
    map<string, int> tree;
    for (string out; read(&out);) {
        auto i = tree.find(out);
        if (i != tree.end()) {
            i->second++;
        } else {
            tree.insert(pair<string, int>(out, 1));
        }
    }
    map<string, int> tree2 = tree;
    for (auto &i : tree2) {
        if (i.second == 1) {
            tree2.erase(i.first);
        }
    }
    cout << tree;
    cout << "---------------------------" << endl;
    cout << tree2;
}