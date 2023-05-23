#include <cstring>
#include <iostream>

using namespace std;

class String {
    public:
        String(int length = 0) :
            cstring(new char[length + 1]) {
            cstring[0] = '\0';
        }
        String(const String &s) :
            cstring(strcpy(new char[strlen(s.cstring) + 1], s.cstring)) {}
        String(const char *s) :
            cstring(strcpy(new char[strlen(s) + 1], s)) {}
        ~String() {
            delete cstring;
        }
        String operator+(const String &s) const {
            String res = String(strlen(cstring) + strlen(s.cstring));
            strcpy(res.cstring, cstring);
            strcat(res.cstring, s.cstring);
            return res;
        }
        void operator+=(const String &s) {
            char *str = new char[strlen(cstring) + strlen(s.cstring) + 1];
            strcpy(str, cstring);
            strcat(str, s.cstring);
            delete cstring;
            cstring = str;
        }
        bool operator<(const String &s) const {
            return strcmp(cstring, s.cstring) < 0;
        }
        bool operator>(const String &s) const {
            return strcmp(cstring, s.cstring) > 0;
        }
        bool operator<=(const String &s) const {
            return strcmp(cstring, s.cstring) <= 0;
        }
        bool operator>=(const String &s) const {
            return strcmp(cstring, s.cstring) >= 0;
        }
        bool operator==(const String &s) const {
            return strcmp(cstring, s.cstring) == 0;
        }
        bool operator!=(const String &s) const {
            return strcmp(cstring, s.cstring) != 0;
        }
        bool operator!() const {
            return cstring[0] == '\0';
        }
        String &operator=(const String &s) {
            if (this == &s) {
                return *this;
            }
            delete cstring;
            cstring = new char[strlen(s.cstring) + 1];
            strcpy(cstring, s.cstring);
            return *this;
        }
        friend ostream &operator<<(ostream &file, String &s);
        char &operator[](const int i) {
            if (i < 0 || i >= strlen(cstring)) {
                char *def = new char;
                *def = '\0';
                return *def;
            }
            return cstring[i];
        }
        operator string() {
            return (string)cstring;
        }

    private:
        char *cstring;
};

ostream &operator<<(ostream &file, String &s) {
    file << s.cstring;
    return file;
}

int main() {
    String nix;
    String a = "Apfel";
    String aa = a;
    String b = "Birnen";
    String bb;
    String k = "Kompott";
    String ab = "ApfelBirnen";
    String res;

    bb = b;
    res = aa + String("") + bb;

    cout << "Ist 'nix' leer? " << (!nix ? "Ja!" : "Nein???") << endl;
    cout << "'" << bb << "' sind " << (!bb ? "auch" : "nicht") << " leer." << endl;
    cout << "'" << a << "' und '" << b << "' sind " << ((a == b) ? "gleich" : "verschieden") << "." << endl;
    cout << "'" << bb << "' sind " << (bb < k ? "kleiner" : "groesser") << " als '" << k << "'" << endl;
    cout << "'" << k << "' ist " << (k < b ? "kleiner" : "groesser") << " als '" << b << "'" << endl;
    cout << "'" << aa << "' plus '" << bb << "' sind '" << res << "'." << endl;
    cout << "Sind es wirklich 'ApfelBirnen'? " << ((ab == res) ? "Ja!" : "Nein???") << endl;

    // ab hier auskommentieren, solange du noch kein += hast
    a += bb;
    a += k;
    cout << "Und jetzt gibt es '" << a << "'." << endl;

    // ab hier auskommentieren, solange Index- und Typumwandlungsoperator fehlen
    cout << "'" << res << "[5]' ist ein '" << res[5] << "'." << endl;
    res[5] = 'H';
    cout << "Und jetzt machen wir ein 'H' daraus: '" << res << "'." << endl;
    cout << "Ausgabe als C++ string: '" << string(res) << "'." << endl;
    cout << "Wird '" << b << "[6]' richtig abgefangen? ";
    b[6] = 'x';
    cout << ((b == bb) ? "Ja!" : "Nein??? ") << endl;

    return 0;
}