// Travelling Salesman mittels Backtracking, grafisch
//
// Aufruf: travel count
//
// Klaus Kusche, 2020

#include "sdlinterf.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Groesse des "Landes" in x- und y-Richtung, in Pixeln
// Rundherum lassen wir 10 Pixel Rand
#define RAND 10
#define BREITE (SDL_X_SIZE - 2 * RAND)
#define HOEHE (SDL_Y_SIZE - 2 * RAND)

// fuer die Grafik-Ausgabe: Farb-Komponenten fuer Staedte und die Linien
#define STADT_R 255
#define STADT_G 255
#define STADT_B 255
#define ROUTE_R 255
#define ROUTE_G 255
#define ROUTE_B 0
#define VERB_R 0
#define VERB_G 0
#define VERB_B 255

// Pixel-Koordinaten einer Stadt
typedef struct {
        int x, y;
} koord_t;

// Maximale Anzahl der Staedte
// (angelegte Groesse der Arrays)
#define MAX_ANZ 100

// Mindest-Anzahl der Verbindungen pro Stadt
// Regelt, wie "dicht" der Graph wird
// Sehr hohe Zahl, z.B. 100 ==> Full Graph (alle moeglichen Verbindungen)
// Sehr kleine Zahl, z.B. 3 ==> Oft keine Rundreise moeglich
#define MIN_VERB 5

// Tatsaechliche Anzahl der Staedte
// (tatsaechlich benutzte Elemente in den Arrays)
int count;

// Koordinaten der i-ten Stadt
koord_t koord[MAX_ANZ];

// Entfernungs-Matrix: Entfernung von i-ter zu j-ter Stadt
// HUGE_VAL (aus math.h) = "unendlich" = keine Verbindung
// Die Matrix ist symmetrisch:
// Es gilt fuer alle Elemente distance[von][nach] == distance[nach][von]
double distance[MAX_ANZ][MAX_ANZ];

// Reihenfolge der Staedte in der Route:
// Index i der Elemente = Nummer der Stadt
// Wert der Elemente = Nummer des Schrittes, in dem diese Stadt besucht wurde:
// Mit dem wievielten Schritt wurde diese Stadt erreicht?
// Wert -1 steht fuer "Stadt ist noch nicht besucht"
//
// ... bei der aktuellen Route?
int curr_solution[MAX_ANZ];
// ... bei der bisher optimalen Route?
int opt_solution[MAX_ANZ];

// Laenge der bisher besten Route
// Solange HUGE_VAL: Bisher keine Route gefunden, opt_solution noch undefiniert
double optimal = HUGE_VAL;

void search(int schritt, int stadt, double summe);
void erzeuge_karte(void);
void zeichne_lsg(void);

// Die rekursive Loesungsfunktion:
// Du stehst nach Schritt Nummer "schritt" in der Stadt Nummer "stadt"
// Deine bisherige Fahrtstrecke ist "summe" lang
// Probiere alle Moeglichkeiten fuer den naechsten Schritt
// (= die naechste Stadt ausgehend von Stadt Nummer "stadt")
void search(int index, int city, double sum)
{
        curr_solution[city] = index;
        if (index >= count - 1) {
                sum += distance[city][0];
                if (sum < optimal) {
                        for (int i = 0; i < count; i++) {
                                opt_solution[i] = curr_solution[i];
                        }
                        optimal = sum;
                }
        } else {
                for (int i = 0; i < count; i++) {
                        if (curr_solution[i] == -1) {
                                if (sum + distance[city][i] < optimal) {
                                        search(index + 1, i,
                                               sum + distance[city][i]);
                                }
                        }
                }
        }
        curr_solution[city] = -1;
}

// Befuelle die Stadt- und Verbindungs-Arrays
// Zeichne die Staedte und Verbindungen
void erzeuge_karte(void)
{
        // Staedte erzeugen
        for (koord_t *a = koord; a < koord + count; ++a) {
                int x = rand() % BREITE + RAND;
                int y = rand() % HOEHE + RAND;
                sdlDrawLine(x - 2, y - 2, x + 2, y + 2, STADT_R, STADT_G,
                            STADT_B);
                sdlDrawLine(x - 2, y + 2, x + 2, y - 2, STADT_R, STADT_G,
                            STADT_B);
                a->x = x;
                a->y = y;
        }
        sdlUpdate();

        // Zuerst einmal alle Verbindungen auf unendlich setzen
        for (int i = 0; i < count; ++i) {
                for (int j = 0; j < count; ++j) {
                        distance[i][j] = HUGE_VAL;
                }
        }

        // Wie viele Verbindungen soll jede Stadt mindestens bekommen
        // Das koennen nicht mehr sein, als es andere Staedte gibt!
        int verb_soll = (MIN_VERB < (count - 1)) ? MIN_VERB : (count - 1);

        // Verbindungen erzeugen, Stadt fuer Stadt
        for (int i = 0; i < count; ++i) {
                // Erster Schritt:
                // Zaehle die schon vorhandenen Verbindungen,
                // berechne die Laenge der noch nicht vorhandenen in einem Hilfs-Array
                double hilfs[count];
                int verb_anz = 0;
                for (int j = 0; j < count; ++j) {
                        if (i == j) {
                                // Verbindung zu sich selbst ausschliessen!
                                hilfs[j] = HUGE_VAL;
                                continue;
                        }
                        if (distance[i][j] == HUGE_VAL) {
                                double dx = koord[i].x - koord[j].x;
                                double dy = koord[i].y - koord[j].y;
                                hilfs[j] = sqrt(dx * dx + dy * dy);
                        } else {
                                ++verb_anz;
                                hilfs[j] = HUGE_VAL;
                        }
                }

                // Zweiter Schritt:
                // Fuege neue Verbindungen hinzu, bis die gewuenschte Anzahl erreicht ist
                for (; verb_anz < verb_soll; ++verb_anz) {
                        // Suche die kuerzeste Verbindung im Hilfs-Array und deren Stadt k
                        double min = HUGE_VAL;
                        int k = -1;
                        for (int j = 0; j < count; ++j) {
                                if (hilfs[j] < min) {
                                        min = hilfs[j];
                                        k = j;
                                }
                        }
                        // Trage Verbindung i <--> k in beide Richtungen ein
                        distance[i][k] = distance[k][i] = min;
                        // ... zeichne sie
                        sdlDrawLine(koord[i].x, koord[i].y, koord[k].x,
                                    koord[k].y, VERB_R, VERB_G, VERB_B);
                        // ... und loesche sie aus dem Hilfs-Array
                        hilfs[k] = HUGE_VAL;
                }
        }

        sdlUpdate();
}

// Zeichne die Loesung und berechne zur Pruefung ihre Laenge
void zeichne_lsg(void)
{
        double summe = 0;
        int alt, neu; // Alte und neue Stadt eines Schrittes

        alt = 0; // Ausgangspunkt = Stadt 0
        for (int schritt = 1; schritt < count; ++schritt) {
                // suche die Stadt fuer diesen Schritt in der Loesung
                for (neu = 0;; ++neu) {
                        if (neu >= count) {
                                printf("Mir fehlt Schritt Nummer %d!\n",
                                       schritt);
                                exit(EXIT_FAILURE);
                        }
                        if (opt_solution[neu] == schritt)
                                break;
                }
                // Verbindung von der vorigen Stadt ausgeben und aufsummieren
                sdlDrawLine(koord[alt].x, koord[alt].y, koord[neu].x,
                            koord[neu].y, ROUTE_R, ROUTE_G, ROUTE_B);
                summe += distance[alt][neu];
                // die aktuelle Stadt ist im naechsten Schritt die vorige Stadt
                alt = neu;
        }

        // gib den Weg zurueck zur ersten Stadt aus, er gehoert auch zur Gesamtlaenge
        sdlDrawLine(koord[alt].x, koord[alt].y, koord[0].x, koord[0].y, ROUTE_R,
                    ROUTE_G, ROUTE_B);
        summe += distance[alt][0];

        sdlUpdate();

        // stimmt die Laenge ueberein?
        if (summe != optimal) {
                printf("Die Laenge stimmt nicht (ist: %g / laut Loesung: %g)!\n",
                       summe, optimal);
        } else {
                printf("Gesamtlaenge fuer %d Staedte %g\n", count, summe);
        }
}

int main(int argc, const char *argv[])
{
        if ((argc != 2) || ((count = atoi(argv[1])) < 3) || (count > MAX_ANZ)) {
                fprintf(stderr, "Usage: %s city_count  (= 3...%d)\n", argv[0],
                        MAX_ANZ);
                exit(EXIT_FAILURE);
        }

        srand(time(NULL));

        sdlInit();

        // Initialisiere und zeichne die Staedte und Verbindungen
        erzeuge_karte();

        // setze die aktuelle Loesung auf "noch keine Stadt besucht"
        for (int i = 0; i < count; ++i) {
                curr_solution[i] = -1;
        }

        // unsere Suche beginnt immer bei Stadt 0, sie ist auch Schritt 0
        search(0, 0, 0);

        if (optimal == HUGE_VAL) {
                printf("Keine Loesung gefunden!\n");
        } else {
                zeichne_lsg();
        }

        // periodisches sdlMilliSleep, damit periodisch auf Close-Events geprueft wird
        for (;;) {
                sdlMilliSleep(100);
        }

        sdlExit();

        exit(EXIT_SUCCESS);
}