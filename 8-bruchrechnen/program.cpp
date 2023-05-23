// Ganz einfacher Taschenrechner:
// + - * / ^ von links nach rechts ohne Vorrang und ohne Klammern
// (mit x statt * und p statt ^)
//
// Aufruf: taschenr rechnung
// (eine Zahl / ein Rechenzeichen pro Wort, d.h. mit Zwischenräumen!)
//
// Klaus Kusche, 2012

#include <cstring>
#include <iostream>

using namespace std;

class Fraction {
    public:
        Fraction(int numerator = 0, int denominator = 1) :
            numerator(numerator), denominator(denominator) {}
        Fraction(const char *str) {
            const char *seperator = strchr(str, '/');
            numerator = atoi(str);
            if (!seperator) {
                denominator = 1;
                return;
            }
            denominator = atoi(++seperator);
        }

        Fraction operator+(const Fraction &f) const {
            return Fraction(
                numerator * f.denominator + f.numerator * denominator,
                denominator * f.denominator);
        }
        Fraction operator-(const Fraction &f) const {
            return Fraction(
                numerator * f.denominator - f.numerator * denominator,
                denominator * f.denominator);
        }
        Fraction operator*(const Fraction &f) const {
            return Fraction(
                numerator * f.numerator,
                denominator * f.denominator);
        }
        Fraction operator/(const Fraction &f) const {
            return Fraction(
                numerator * f.denominator,
                denominator * f.numerator);
        }
        Fraction *optimize() {
            for (int i = 2; i < denominator / 2; i++) {
                while (denominator % i == 0 && numerator % i == 0) {
                    numerator /= i;
                    denominator /= i;
                }
            }
            return this;
        }
        operator double() const {
            if (!denominator) {
                cerr << "Division durch 0" << endl;
                exit(EXIT_FAILURE);
            }
            return (double)numerator / denominator;
        }
        friend ostream &operator<<(ostream &file, Fraction &fraction);

    private:
        int numerator, denominator;
};

ostream &operator<<(ostream &file, Fraction &fraction) {
    fraction.optimize();
    file << fraction.numerator;
    if (fraction.denominator != 1) {
        file << "/" << fraction.denominator;
    }
    return file;
}

int main(int argc, const char *argv[]) {
    // 1, 3, 5, ... Eingabeworte (+1 für den Programmnamen) sind ok
    // ==> argc muss gerade sein
    if (argc % 2 != 0) {
        cerr << argv[0] << ": Die Anzahl der Eingaben stimmt nicht!" << endl;
        exit(EXIT_FAILURE);
    }

    // Bisheriges Ergebnis = linker Operand für die nächste Rechnung
    // Am Anfang: Erste Zahl
    Fraction result = Fraction(argv[1]);
    // Schleife in Zweierschritten ab dem ersten Rechenzeichen
    // argv[i] ist das Rechenzeichen, argv[i + 1] ist die nächste Zahl
    for (int i = 2; i < argc; i += 2) {
        // nächste Zahl (nach dem Rechenzeichen) = rechter Operand
        Fraction input = Fraction(argv[i + 1]);
        // Rechenzeichen dazwischen anschauen: 1. Zeichen von i-tem Eingabe-Wort
        // switch geht nur mit einzelnen Zeichen, nicht mit ganzen Texten!
        switch (argv[i][0]) {
            case '+':
                result = result + input;
                break;
            case '-':
                result = result - input;
                break;
            case 'x':
                result = result * input;
                break;
            case '/':
                result = result / input;
                break;
            default:
                cerr << argv[0] << ": " << argv[i][0] << ": Kein Rechenzeichen?" << endl;
                exit(EXIT_FAILURE);
        }
    }

    cout << "Ergebnis: " << (double)result << " (" << result << ")" << endl;

    exit(EXIT_SUCCESS);
}