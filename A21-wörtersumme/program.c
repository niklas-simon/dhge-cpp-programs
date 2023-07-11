// Loesen von Textsummen-Denksportaufgaben mittels Backtracking (Angabe)
//
// Aufruf: textsumme operand1 operand2 summe
//
// Klaus Kusche

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Maximale Laenge der Woerter
#define MAX_WORTLEN 32

// die in der Aufgabe vorkommenden Buchstaben (max. 10, siehe buch_anz)
char buchst[10];

// deren Anzahl
int buch_anz = 0;

// die zum i-ten Buchstaben in buchst gehoerige Ziffer
// fuer noch nicht belegte Buchstaben ist ziffer[i] gleich -1
// ziffer[10] ist 0 (fuer die fuehrenden Leerzeichen in den Worten),
// das spart ein paar if
int ziffer[11];

// kleinster Wert fuer den i-ten Buchstaben
// 1 fuer Buchstaben, die am Anfang eines Wortes stehen (duerfen nicht 0 werden),
// 0 fuer alle anderen
int anfang[10];

// ist die Ziffer i schon verwendet?
// (damit wir nicht jedesmal "ziffer" komplett durchsuchen muessen)
bool belegt[10];

// die Eingabe-Woerter in interner Darstellung:
// * Buchstaben werden ersetzt durch ihren Index in "buchst" und "ziffer"
//   ==> ziffer[op1[i]] liefert die Ziffer,
//       die fuer den i-ten Buchstaben des ersten Wortes eingesetzt wurde,
//       oder -1, wenn dem i-ten Buchstaben noch keine Ziffer zugeordnet wurde,
//       oder 0, wenn der i-te Buchstabe ein fuehrendes Leerzeichen ist.
// * alle Woerter gleichlang (wort_len Elemente)
// * rechtsbuendig, vorne aufgefuellt mit 10 (fuer den Zugriff auf ziffer[10])
short int op1[MAX_WORTLEN];
short int op2[MAX_WORTLEN];
short int sum[MAX_WORTLEN];

// Anzahl der Werte in op1, op2 und sum = Laenge des laengsten Eingabe-Wortes
int wort_len;

// fuer Fehlermeldungen
const char *prog_name;

int buchstabe(char c);
void eingabe(int argc, const char *argv[]);
bool sinnvoll(void);
bool loesung(int pos);
void print_wort(const short int wort[]);
void ausgabe(void);

int main(int argc, const char *argv[])
{
        prog_name = argv[0];

        eingabe(argc, argv);

        if (!loesung(0)) {
                printf("Keine Loesung!\n");
        }

        exit(EXIT_SUCCESS);
}

// liefert den Index von c in "buchst"
// prueft, ob c gueltig ist
// haengt ihn an "buchst" an, wenn er neu ist
int buchstabe(char c)
{
        int i;

        if (!isalpha(c)) {
                fprintf(stderr, "%s: Bitte nur Buchstaben eingeben! (%c?)\n",
                        prog_name, c);
                exit(EXIT_FAILURE);
        }

        for (i = 0; i < buch_anz; ++i) {
                if (buchst[i] == tolower(c)) {
                        return i;
                }
        }

        if (buch_anz == 10) {
                fprintf(stderr,
                        "%s: Die Eingabe darf maximal 10 verschiedene Buchstaben enthalten\n",
                        prog_name);
                exit(EXIT_FAILURE);
        }

        buchst[buch_anz] = tolower(c);
        return buch_anz++;
}

void eingabe(int argc, const char *argv[])
{
        int l1, l2, l3, i;

        if (argc != 4) {
                fprintf(stderr, "Aufruf: %s operand1 operand2 summe\n",
                        prog_name);
                exit(EXIT_FAILURE);
        }

        for (i = 0; i < 10; ++i) {
                belegt[i] = false;
                ziffer[i] = -1;
                anfang[i] = 0;
        }
        ziffer[10] = 0;

        l1 = strlen(argv[1]);
        l2 = strlen(argv[2]);
        l3 = strlen(argv[3]);

        wort_len = l1;
        if (l2 > wort_len)
                wort_len = l2;
        if (l3 > wort_len)
                wort_len = l3;
        if (wort_len > MAX_WORTLEN) {
                fprintf(stderr, "%s: Maximale Wortlaenge %d\n", prog_name,
                        MAX_WORTLEN);
                exit(EXIT_FAILURE);
        }
        if ((l1 == 0) || (l2 == 0) || (l3 == 0)) {
                fprintf(stderr, "%s: Bitte keine leeren Worte\n", prog_name);
                exit(EXIT_FAILURE);
        }

        // man kommt am schnellsten zu Ergebnissen,
        // wenn man die Zeichen der Eingabeworte
        // in buchst spaltenweise von hinten nach vorne speichert!
        // ==> Backtracking loest hinterste Spalte zuerst, dann zweit-hinterste, ...
        for (i = wort_len - 1; i >= 0; --i) {
                op1[i] = (i < wort_len - l1) ?
                                 10 :
                                 buchstabe(argv[1][i - (wort_len - l1)]);
                op2[i] = (i < wort_len - l2) ?
                                 10 :
                                 buchstabe(argv[2][i - (wort_len - l2)]);
                sum[i] = (i < wort_len - l3) ?
                                 10 :
                                 buchstabe(argv[3][i - (wort_len - l3)]);
        }

        // die vordersten Buchstaben jedes Wortes duerfen nicht mit 0 belegt werden
        anfang[buchstabe(argv[1][0])] = 1;
        anfang[buchstabe(argv[2][0])] = 1;
        anfang[buchstabe(argv[3][0])] = 1;
}

// koennen die bisher in "ziffer" gespeicherten Ziffern noch eine Loesung ergeben?
// "false" wenn jetzt schon ein Rechenfehler in der Loesung ist, "true" sonst
// einfachere Variante: Prueft nur bis zur ersten Spalte,
// die noch unbekannte Werte enthaelt
bool sinnvoll(void)
{
        int carry = 0;
        for (int i = wort_len - 1; i >= 0; i--) {
                //printf("sinvoll: index %d - ", i);
                if (ziffer[op1[i]] == -1 || ziffer[op2[i]] == -1 ||
                    ziffer[sum[i]] == -1) {
                        //printf("not all digits are defined: %d %d %d\n", ziffer[op1[i]], ziffer[op2[i]], ziffer[sum[i]]);
                        return true;
                }
                int res = ziffer[op1[i]] + ziffer[op2[i]] + carry;
                carry = res / 10;
                res %= 10;
                //printf("%d + %d = %d carry %d -> must be %d -> %s\n", ziffer[op1[i]], ziffer[op2[i]], res, carry, ziffer[sum[i]], res != ziffer[sum[i]] ? "false" : "true");
                if (res != ziffer[sum[i]]) {
                        return false;
                }
        }
}

// loese ab dem Buchstaben mit Index "pos" in den Arrays buchst und ziffer
// wenn pos schon buch_anz ist (alle Buchstaben belegt): ausgabe() aufrufen!
// jede Ebene der Rekursion loest *einen* Buchstaben, naemlich buchst[pos]
// d.h. belegt das Element ziffer[pos] mit der zu buchst[pos] gehoerenden Ziffer
//      und markiert die gewaehlte Ziffer im Array belegt als belegt
// Returnwert: true ... Loesung gefunden, false ... Keine Loesung
//             (brauchen wir fuer die Ausgabe "Keine Loesung!" im main)
bool loesung(int index)
{
        bool res = false;
        if (index >= buch_anz) {
                ausgabe();
                res = true;
        } else {
                for (int n = anfang[index]; n < 10; n++) {
                        if (!belegt[n]) {
                                ziffer[index] = n;
                                belegt[n] = true;

                                if (sinnvoll()) {
                                        if (loesung(index + 1)) {
                                                res = true;
                                        }
                                }

                                ziffer[index] = -1;
                                belegt[n] = false;
                        }
                }
        }
        return res;
}

// gib die dem Wort (op1, op2, sum) entsprechende Ziffernfolge aus
void print_wort(const short int wort[])
{
        int i;

        for (i = 0; i < wort_len; ++i) {
                if (wort[i] == 10)
                        putchar(' ');
                else
                        putchar('0' + ziffer[wort[i]]);
        }
        putchar('\n');
}

void ausgabe(void)
{
        int i;

        for (i = 0; i < buch_anz; ++i) {
                printf("%c=%d%s", buchst[i], ziffer[i],
                       (i == buch_anz - 1) ? "\n" : ", ");
        }
        print_wort(op1);
        print_wort(op2);
        print_wort(sum);
        putchar('\n');
}