// Cross-Reference-Liste, mit Hashtable
//
// Aufruf: xref-hash file ...
//
// Klaus Kusche, 2002

#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

// Größe der Hashtable
#define HASHPRIME 10007
// #define HASHPRIME 1000003
//  ganz schlecht!
// #define HASHPRIME 8192

// Max. Länge einer Input-Zeile
#define LINELEN 16384

// Welche Buchstaben sind Anfang eines Wortes?
#define iswordbeg(c) (isalnum(c) || ((c) == '\''))

// Welche Buchstaben gehören zu einem Wort?
#define isinword(c) (isalnum(c) || ((c) == '\''))

// Typ eines Eintrags der Positionsliste
typedef struct _pos_entry {
        const char *filename;
        int line;
        int col;
        struct _pos_entry *next;
} pos_entry;

// Typ eines Eintrags der Wortliste
typedef struct _word_entry {
        char *word;
        pos_entry *pos_list;
        struct _word_entry *left, *right;
} word_entry;

// Die Hashfunktion: Berechnet aus einem Wort den Index in die Hashtable
unsigned int hash(const char *text);
// Liefert einen Pointer auf n mit malloc angeforderte Bytes, mit Fehlerprüfung
void *mymalloc(size_t n);
// Liefert einen Pointer auf eine strdup-Kopie von s, mit Fehlerprüfung
char *strsave(const char *s);
// Liefert einen Pointer auf einen neu angelegten Positionsknoten
pos_entry *new_pos(const char *filename, int linenr, int colnr);
// Liefert einen Pointer auf einen neu angelegten Wortknoten
word_entry *new_word(const char *word, pos_entry *pos);
// Hängt die Position pos *hinten* an die Positionsliste von word an
void add_pos(pos_entry *pos, word_entry *word);
// Speichert eine neue Position des (neuen oder bekannten) Wortes word
void save_word(const char *filename, int linenr, int colnr, const char *word);
// Ermittelt und speichert alle Worte in der Zeile line
void read_line(const char *filename, int linenr, char *line);
// Liest und verarbeitet den angegebenen File zeilenweise
void read_file(const char *filename);
// Gibt alle Positionen der Positionsliste des Wortes word aus
void list_pos(const word_entry *word);
// Sucht das angegebene Wort word im Hashspeicher, gibt seine Positionen aus
void process_word(const char *word);
// Liest und verarbeitet den Input vom Terminal (ein Wort pro Zeile!)
void process_input(void);
// Gibt Statistiken über die Hash-Verteilung aus
void statistics(void);

// Die Hashtable: Enthält die Head-Pointer der Wortlisten
word_entry *root;

// Der Programmname (für Fehlermeldungen)
const char *progname;

// Die Hashfunktion: Berechnet aus einem Wort den Index in die Hashtable
// Verwendet eine 7-Bit-Rotation und Xor pro Zeichen
// und liefert diese Zahl mod Arraygröße
unsigned int hash(const char *text) {
    unsigned int h = 0;
    const char *p;
    for (p = text; *p != '\0'; p++) {
        h = (h >> 25) ^ (h << 7) ^ *p;
    }
    return h % HASHPRIME;
}

// Liefert einen Pointer auf n mit malloc angeforderte Bytes, mit Fehlerprüfung
void *mymalloc(size_t n) {
    void *p;

    if ((p = malloc(n)) == NULL) {
        fprintf(stderr, "%s: Out of memory\n", progname);
        exit(EXIT_FAILURE);
    }

    return p;
}

// Liefert einen Pointer auf eine mit strdup angelegte Kopie von s,
// mit Fehlerprüfung
char *strsave(const char *s) {
    char *p;

    if ((p = strdup(s)) == NULL) {
        fprintf(stderr, "%s: Out of memory\n", progname);
        exit(EXIT_FAILURE);
    }

    return p;
}

// Liefert einen Pointer auf einen neu angelegten Positionsknoten
// Die Argumente enthalten die im Knoten einzutragende Position
// Die Verkettung des neuen Knotens wird auf NULL gesetzt
pos_entry *new_pos(const char *filename, int linenr, int colnr) {
    void *p;
    if ((p = malloc(sizeof(pos_entry))) == NULL) {
        fprintf(stderr, "%s: Out of memory\n", progname);
        exit(EXIT_FAILURE);
    }
    pos_entry *pos = (pos_entry *)p;
    *pos = (pos_entry){filename, linenr, colnr, NULL};
    return pos;
}

// Liefert einen Pointer auf einen neu angelegten Wortknoten
// word ist das im Knoten einzutragende Wort, pos dessen erste Position,
// und next ist als Verkettung auf den nächsten Wortknoten einzutragen
// Achtung: word darf nicht direkt gespeichert werden
// (weil es auf den internen Zeilenpuffer von read_file zeigt
// und daher beim Lesen der nächsten Zeile überschrieben wird),
// sondern es muss eine dynamisch erzeugte *Kopie* im Knoten gespeichert werden!
word_entry *new_word(const char *word, pos_entry *pos) {
    void *p;
    if ((p = malloc(sizeof(word_entry))) == NULL) {
        fprintf(stderr, "%s: Out of memory\n", progname);
        exit(EXIT_FAILURE);
    }
    word_entry *entry = (word_entry *)p;
    *entry = (word_entry){strsave(word), pos, NULL, NULL};
    return entry;
}

// Hängt die Position pos *hinten* an die (nichtleere!) Positionsliste
// des Wortknotens wort an
void add_pos(pos_entry *pos, word_entry *word) {
    pos_entry *p;
    for (p = word->pos_list; p->next; p = p->next) {
    }
    p->next = pos;
}

// Es wird mit new_pos ein frischer Positionseintrag
//   (filename/linenr/colnr) angelegt
// Dann wird das Wort word im Hash-Speicher gesucht
// Gibt es das Wort noch nicht, wird mittels new_word
// ein neuer Worteintrag erzeugt (mit dem neuen Pos-Eintrag)
// und *vorne* an die richtige Hashliste angehängt
// Gibt es das Wort schon,
// wird an dessen Positionsliste mittels add_pos der neue Pos-Eintrag angehängt
void save_word(const char *filename, int linenr, int colnr, const char *word) {
    pos_entry *pos = new_pos(filename, linenr, colnr);
    word_entry **p = &root;
    for (; *p && strcmp((*p)->word, word) != 0; p = strcmp((*p)->word, word) < 0 ? &((*p)->right) : &((*p)->left)) {}
    if (*p) {
        add_pos(pos, *p);
    } else {
        *p = new_word(word, pos);
    }
}

// Ermittelt und speichert alle Worte in der Zeile line
// Achtung: line wird dabei modifiziert!
// filename und linenr sind die Position der Zeile
void read_line(const char *filename, int linenr, char *line) {
    char *line_end; // Zeiger auf das \0 am Zeilenende
    char *word_beg; // Zeiger auf den ersten Char des nächsten Wortes
    char *word_end; // Zeiger auf den ersten Char hinter dem Wort
    int colnr;      // Spalte

    line_end = strchr(line, '\0');
    for (word_beg = line;; word_beg = word_end) { // Ein Durchlauf pro Wort
        // Suche den ersten Buchstaben des nächsten Wortes
        for (; !iswordbeg(*word_beg); ++word_beg) {
            if (word_beg == line_end) { // Am Zeilenende, nichts gefunden:
                return;                 // Die Zeile ist fertig verarbeitet
            }
        }

        // Suche den ersten Buchstaben hinter dem Wort
        for (word_end = word_beg + 1; isinword(*word_end); ++word_end) {
        }

        // Mach aus dem Wort einen einzelnen String: Schreib \0 ans Ende (Pfui!)
        *word_end = '\0';
        // Spalte = Entfernung vom Zeilenanfang (ab 1, nicht ab 0)
        colnr = (word_beg - line) + 1;
        // Speichere das Wort und seine Position
        save_word(filename, linenr, colnr, word_beg);
    }
}

// Liest und verarbeitet den angegebenen File zeilenweise
// Bricht bei zu langen Zeilen mit Fehler ab!
void read_file(const char *filename) {
    FILE *f;
    char line[LINELEN + 2];
    int linenr;

    if ((f = fopen(filename, "r")) == NULL) {
        fprintf(stderr, "%s: Can't open %s: %s\n", progname, filename,
                strerror(errno));
        exit(EXIT_FAILURE);
    }

    for (linenr = 1; fgets(line, sizeof(line), f); ++linenr) {
        if ((strlen(line) == sizeof(line) - 1) &&
            (line[sizeof(line) - 2] != '\n')) {
            fprintf(stderr, "%s: Line too long on %s\n", progname, filename);
            exit(EXIT_FAILURE);
        }
        read_line(filename, linenr, line);
    }

    if (ferror(f)) {
        fprintf(stderr, "%s: Can't read %s: %s\n", progname, filename,
                strerror(errno));
        exit(EXIT_FAILURE);
    }
    if (fclose(f) != 0) {
        fprintf(stderr, "%s: Can't close %s: %s\n", progname, filename,
                strerror(errno));
        exit(EXIT_FAILURE);
    }
}

// Gibt alle Positionen der Positionsliste des Wortes word aus
// Alle Positionen aus einem File werden in einer Zeile ausgegeben
// (mit dem Filenamen einmal am Zeilenanfang)
// Kommt eine Position aus einem neuen File, wird eine neue Zeile begonnen
void list_pos(const word_entry *word) {
    pos_entry *p;
    const char *last_filename = NULL;
    for (p = word->pos_list; p; p = p->next) {
        if (!last_filename || strcmp(last_filename, p->filename) != 0) {
            if (last_filename) {
                printf("\n");
            }
            printf("%s:", p->filename);
            last_filename = p->filename;
        }
        printf(" %i:%i", p->line, p->col);
    }
    printf("\n");
}

// Sucht das angegebene Wort word im Hashspeicher
// Gibt das Wort und seine Positionen (mittels list_pos)
// oder "nicht gefunden" aus
void process_word(const char *word) {
    word_entry *p = root;
    for(; p && strcmp(p->word, word) != 0; p = strcmp(p->word, word) < 0 ? p->right : p->left) {}
    if (p) {
        list_pos(p);
    } else {
        printf("nicht gefunden\n");
    }
}

// Liest und verarbeitet den Input vom Terminal (ein Wort pro Zeile!)
void process_input(void) {
    char line[LINELEN + 2];
    char *p;

    while (fgets(line, sizeof(line), stdin)) {
        if ((p = strchr(line, '\n')) == NULL) {
            fprintf(stderr, "%s: Line too long on stdin\n", progname);
            exit(EXIT_FAILURE);
        }
        *p = '\0'; // '\n' entfernen
        process_word(line);
    }

    if (ferror(stdin)) {
        fprintf(stderr, "%s: Can't read stdin: %s\n", progname, strerror(errno));
        exit(EXIT_FAILURE);
    }
}

void get_depth(word_entry *knot, int layer, int *max_depth, int *sum_depth, int *leaf_count) {
    if (!knot->left && !knot->right) {
        // Blatt
        if (*max_depth < (layer + 1)) {
            *max_depth = layer + 1;
        }
        *sum_depth += layer + 1;
        *leaf_count += 1;
    } else {
        if (knot->left) {
            get_depth(knot->left, layer + 1, max_depth, sum_depth, leaf_count);
        }
        if (knot->right) {
            get_depth(knot->right, layer + 1, max_depth, sum_depth, leaf_count);
        }
    }
}

void words_per_layer(word_entry *knot, int layer, int *per_layer) {
    per_layer[layer]++;
    if (knot->left) {
        words_per_layer(knot->left, layer + 1, per_layer);
    }
    if (knot->right) {
        words_per_layer(knot->right, layer + 1, per_layer);
    }
}

void print(word_entry *knot) {
    if (!knot) return;
    print(knot->left);
    printf("%s, ", knot->word);
    print(knot->right);
}

// Gibt Statistiken über die Hash-Verteilung aus
void statistics(void) {
    int max_depth = 0;
    int sum_depth = 0;
    int leaf_count = 0;
    get_depth(root, 0, &max_depth, &sum_depth, &leaf_count);
    int per_layer[max_depth];
    for (int i = 0; i < max_depth; i++)
        per_layer[i] = 0;
    words_per_layer(root, 0, per_layer);
    int sum = 0;
    for (int i = 0; i < max_depth; i++) {
        sum += per_layer[i];
        printf("layer %i: %i words\n", i, per_layer[i]);
    }
    printf("sum: %i words\n", sum);
    printf("depth: maximum: %i, average: %f\n", max_depth, (double)sum_depth / leaf_count);
    int i = 0;
    for (; pow(2, i + 1) - 1 < sum; i++) {
    }
    double avg = i + (sum - pow(2, i) + 1) / pow(2, i);
    printf("if optimal, this tree would have an average depth of %f\n", avg);

    //printf("sorted:\n");
    //print(root);
    //printf("\n");
}

// Liest und speichert alle Worte aus allen als Argument angegebenen Files
// Liest Worte vom Terminal und gibt deren gespeicherte Position aus
int main(int argc, const char *argv[]) {
    int i;

    progname = argv[0];

    //// Files einlesen und speichern
    if (argc == 1) {
        fprintf(stderr, "Usage: %s file ...\n", argv[0]);
        exit(EXIT_FAILURE);
    }
    for (i = 1; i < argc; ++i) {
        read_file(argv[i]);
    }

    // Statistik ausgeben
    statistics();

    //// Wörter einlesen und suchen
    process_input();

    exit(EXIT_SUCCESS);
}