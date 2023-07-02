// Verschiedene Sortierverfahren, grafisch dargestellt
//
// Aufruf: gra-sort
//
// Klaus Kusche, 2011

// für Zufallszahlen
#include <cstdlib>
#include <ctime>

using namespace std;

#include <wx/app.h>
#include <wx/frame.h>
#include <wx/dcclient.h>
#include <wx/statusbr.h>
#include <wx/button.h>
#include <wx/choice.h>
#include <wx/sizer.h>
#include <wx/event.h>

// Anzahl der Elemente im zu sortierenden Array
// == Größe des Grafik-Fensters in Pixel
const int arrSize = 500;
// const int arrSize = 200;

// Alle compUpdInterval Vergleiche wird der Vergleichszähler
// in der Statuszeile aktualisiert
const int compUpdInterval = 5;
// dasselbe für den Vertauschungszähler
const int swapUpdInterval = 1;

// Verzögerung für Quicksort in ms (zum besseren Beobachten)
const int qsDelay = 300;

// Auswahlliste für die Initialisierung des Arrays
const wxString initList[] = {
    "Aufsteigend", "Absteigend", "Durcheinander",
    "Fast sortiert", "Sortiert mit Neuen", "Lauter Gleiche"};
const int initSize = sizeof(initList) / sizeof(initList[0]);
// Auswahlliste für das Sortierverfahren
const wxString sortList[] = {
    "Selection Sort", "Insertion Sort", "Bubblesort",
    "Bi-Bubblesort", "Shellsort", "Heapsort",
    "Quicksort", "Quicksort (verzoegert)",
    "Quicksort (einfaches Part)", "Quicksort (best-of-3 Part)"};
const int sortSize = sizeof(sortList) / sizeof(sortList[0]);

class MyApp : public wxApp {
        virtual bool OnInit();
};

// Klasse für das zu sortierende Array
class Array {
    public:
        // das Array bekommt den wxClientDC des Grafikfensters und die Statuszeile,
        // damit es etwas ausgeben kann
        Array(wxClientDC *graWin, wxStatusBar *stBar);

        // Initialisierungsfunktionen
        // (zeigen das initialisierte Array auch an)
        void ascending();
        void descending();
        void random();
        void nearlysorted();
        void appended();
        void allequal();

        // Sortierfunktionen
        // (aktualisieren auch Grafik und Statuszeile)
        void selSort();
        void insSort();
        void bubbleSort();
        void biBubbleSort();
        void shellSort();
        void heapSort();
        // bei quicksort:
        // ms ist die Verzögerung: Wenn ms größer 0 ist:
        // vor den beiden rekursiven Aufrufen ein wxMilliSleep(ms) machen!
        // simple wählt den einfacheren Partitions-Algorithmus (wenn true)
        // opt wählt die best-of-3-Ermittlung des Partitionswertes
        void quickSort(int ms, bool simple, bool opt);

    private:
        // Vergleiche data[i] und data[j]
        // Ergebnis < 0, == 0 oder > 0, je nachdem, ob data[i] <, == oder > data[j]
        // aktualisiere die Statuszeile
        int Comp(int i, int j);
        // Vertausche data[i] und data[j]
        // aktualisiere die Grafik und die Statuszeile
        void Swap(int i, int j);

        // Zeige das gesamte Array im Grafikfenster an
        void PlotData();
        // Zeichne einen Punkt für data[i] (wenn data[i] > 0)
        // oder lösche ihn weg (wenn data[i] < 0)
        void DrawPoint(int i);
        // Aktualisiere die Vergleichszahl / die Vertauschungszahl
        void UpdateCompCnt(void);
        void UpdateSwapCnt(void);

        // Hilfsfunktion des Heapsort
        void heapify(int left, int right);
        // Rekursive Funktion des Quicksort
        void quick1(int left, int right, int ms, bool simple, bool opt);

        wxClientDC *dc;      // wxClientDC des Grafikfensters (zum Grafik Anzeigen)
        wxStatusBar *status; // Statusbar des Hauptfensters (zum Text Anzeigen)

        int data[arrSize];    // zu sortierendes Array
        int deleted[arrSize]; // markiere in der Grafik zu löschende Punkte
        int compCnt;          // Vergleichszähler
        int swapCnt;          // Vertauschungszähler
};

// Klasse für das Grafik-Subfenster: Abgeleitet vom allgemeinen wxWindow
class Grafik : public wxWindow {
    public:
        Grafik(wxWindow *parent);

        // für Repaint-Events
        void OnPaint(wxPaintEvent &event);
};

// Klasse für das Hauptfenster
class MyFrame : public wxFrame {
    public:
        MyFrame();

        void OnRun(wxCommandEvent &event);
        void OnQuit(wxCommandEvent &event);

    private:
        // das Grafik-Subfenster
        Grafik *grafik;
        // die Statuszeile
        wxStatusBar *status;

        // Auswahl-Pulldown der Initialisierungsfunktion und der Sortierfunktion
        wxChoice *initChoice, *sortChoice;
        // Buttons "Starten" und "Beenden"
        wxButton *Quit, *Run;
};

enum {
    ID_Quit = 1,
    ID_Run
};

IMPLEMENT_APP(MyApp)

bool MyApp::OnInit() {
    srand(time(nullptr));
    MyFrame *frame = new MyFrame();
    frame->Show(true);
    SetTopWindow(frame);
    return true;
}

MyFrame::MyFrame() :
    wxFrame(nullptr, -1, "Sortierverfahren"),
    // neues Board anlegen, bekommt Pointer auf neue Statusbar des Hauptfensters
    grafik(new Grafik(this)),
    status(CreateStatusBar()),
    initChoice(new wxChoice(this, -1, wxDefaultPosition, wxDefaultSize,
                            initSize, initList)),
    sortChoice(new wxChoice(this, -1, wxDefaultPosition, wxDefaultSize,
                            sortSize, sortList)),
    Quit(new wxButton(this, ID_Quit, "E&xit")),
    Run(new wxButton(this, ID_Run, "&Run")) {
    wxBoxSizer *mainsizer = new wxBoxSizer(wxVERTICAL);
    wxBoxSizer *buttonsizer1 = new wxBoxSizer(wxHORIZONTAL);
    wxBoxSizer *buttonsizer2 = new wxBoxSizer(wxHORIZONTAL);

    buttonsizer1->Add(initChoice, 1, wxALL | wxALIGN_CENTER, 5);
    buttonsizer1->Add(sortChoice, 1, wxALL | wxALIGN_CENTER, 5);
    buttonsizer2->Add(Run, 1, wxALL | wxALIGN_CENTER, 5);
    buttonsizer2->Add(Quit, 1, wxALL | wxALIGN_CENTER, 5);
    mainsizer->Add(grafik, 1, wxALL | wxALIGN_CENTER_VERTICAL | wxALIGN_CENTER_HORIZONTAL, 5);
    mainsizer->Add(buttonsizer1, 0, wxEXPAND);
    mainsizer->Add(buttonsizer2, 0, wxEXPAND);
    SetSizerAndFit(mainsizer);

    initChoice->SetSelection(0);
    sortChoice->SetSelection(0);
    status->SetFieldsCount(2);

    Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnQuit, this, ID_Quit);
    Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnRun, this, ID_Run);
}

void MyFrame::OnRun(wxCommandEvent &WXUNUSED(event)) {
    wxClientDC dc(grafik);
    Array a(&dc, status);

    // da Run länger läuft, drehen wir alle GUI-Elemente ab, solange Run läuft
    initChoice->Disable();
    sortChoice->Disable();
    Quit->Disable();
    Run->Disable();

    switch (initChoice->GetSelection()) {
        case 0:
            a.ascending();
            break;
        case 1:
            a.descending();
            break;
        case 2:
            a.random();
            break;
        case 3:
            a.nearlysorted();
            break;
        case 4:
            a.appended();
            break;
        case 5:
            a.allequal();
            break;
        default:
            status->SetStatusText("Internal Error: Invalid Init Function");
            break;
    }

    switch (sortChoice->GetSelection()) {
        case 0:
            a.selSort();
            break;
        case 1:
            a.insSort();
            break;
        case 2:
            a.bubbleSort();
            break;
        case 3:
            a.biBubbleSort();
            break;
        case 4:
            a.shellSort();
            break;
        case 5:
            a.heapSort();
            break;
        case 6:
            a.quickSort(0, false, false);
            break;
        case 7:
            a.quickSort(qsDelay, false, false);
            break;
        case 8:
            a.quickSort(0, true, false);
            break;
        case 9:
            a.quickSort(0, false, true);
            break;
        default:
            status->SetStatusText("Internal Error: Invalid Sort Function");
            break;
    }

    initChoice->Enable();
    sortChoice->Enable();
    Quit->Enable();
    Run->Enable();
}

void MyFrame::OnQuit(wxCommandEvent &WXUNUSED(event)) {
    Close(true);
}

Grafik::Grafik(wxWindow *parent) :
    wxWindow(parent, -1, wxDefaultPosition, wxDefaultSize, wxFULL_REPAINT_ON_RESIZE) {
    SetMinSize(wxSize(arrSize + 2, arrSize + 2));
    SetMaxSize(wxSize(arrSize + 2, arrSize + 2));

    wxClientDC dc(this);
    dc.Clear();

    Bind(wxEVT_PAINT, &Grafik::OnPaint, this);
}

// durch wxEVT_PAINT aufgerufene Repaint-Methode bei Resize usw.
void Grafik::OnPaint(wxPaintEvent &WXUNUSED(event)) {
    wxPaintDC dc(this); // im Repaint muss es ein wxPaintDC statt wxClientDC sein
    dc.Clear();         // da wir keinen Zugriff auf das Array haben,
                        // machen wir das Grafik-Fenster einfach ganz leer
}

Array::Array(wxClientDC *graWin, wxStatusBar *stBar) :
    dc(graWin),
    status(stBar),
    compCnt(0),
    swapCnt(0) {
    dc->SetPen(*wxBLACK_PEN);
    dc->SetBrush(*wxBLACK_BRUSH);
    dc->SetBackground(*wxWHITE_BRUSH);
    dc->Clear();
    UpdateCompCnt();
    UpdateSwapCnt();

    for (int i = 0; i < arrSize; ++i) {
        deleted[i] = false;
    }
}

int Array::Comp(int i, int j) {
    if (++compCnt % compUpdInterval == 0) {
        UpdateCompCnt();
    }

    // Unsere Daten sind zwischen 0 und (arrSize - 1)
    // Beim - tritt daher kein Überlaugf auf.
    return data[i] - data[j];
}

void Array::Swap(int i, int j) {
    int tmp;

    if (++swapCnt % swapUpdInterval == 0) {
        UpdateSwapCnt();
    }

    deleted[i] = true;
    deleted[j] = true;

    DrawPoint(i);
    DrawPoint(j);

    tmp = data[i];
    data[i] = data[j];
    data[j] = tmp;

    deleted[i] = false;
    deleted[j] = false;

    DrawPoint(i);
    DrawPoint(j);
}

void Array::PlotData() {
    dc->Clear();
    for (int i = 0; i < arrSize; ++i) {
        DrawPoint(i);
    }
}

void Array::DrawPoint(int i) {
    // war unsere letzte Zeichenoperation schwarz oder weiß? (ursprünglich schwarz)
    static bool erasing = false;

    if (erasing != deleted[i]) {
        erasing = deleted[i];
        dc->SetPen(erasing ? *wxWHITE_PEN : *wxBLACK_PEN);
        dc->SetBrush(erasing ? *wxWHITE_BRUSH : *wxBLACK_BRUSH);
    }

    // Koordinaten-Ursprung ist oben, nicht unten ==> y umdrehen!
    // data-Werte sind zwischen 0 und (arrSize - 1)
    dc->DrawRectangle(i, (arrSize - 1) - data[i], 3, 3);

    // wenn ein gelöschter Punkt benachbarte Punkte "beschädigt" hat:
    // benachbarte Punkte neu zeichnen!
    // (außer sie sind auch gelöscht)
    if (deleted[i]) {
        if ((i > 1) && !deleted[i - 2] && (abs(data[i - 2] - data[i]) <= 2)) {
            DrawPoint(i - 2);
        }
        if ((i > 0) && !deleted[i - 1] && (abs(data[i - 1] - data[i]) <= 2)) {
            DrawPoint(i - 1);
        }
        if ((i < arrSize - 1) && !deleted[i + 1] && (abs(data[i + 1] - data[i]) <= 2)) {
            DrawPoint(i + 1);
        }
        if ((i < arrSize - 2) && !deleted[i + 2] && (abs(data[i + 2] - data[i]) <= 2)) {
            DrawPoint(i + 2);
        }
    }
}

void Array::UpdateCompCnt(void) {
    wxString txt = "Vergleiche: ";
    txt << compCnt;
    status->SetStatusText(txt, 0);
}

void Array::UpdateSwapCnt(void) {
    wxString txt = "Vertauschungen: ";
    txt << swapCnt;
    status->SetStatusText(txt, 1);
}

void Array::ascending() {
    for (int i = 0; i < arrSize; ++i) {
        data[i] = i;
    }
    PlotData();
}

void Array::descending() {
    for (int i = 0; i < arrSize; ++i) {
        data[i] = (arrSize - 1) - i;
    }
    PlotData();
}

void Array::random() {
    for (int i = 0; i < arrSize; ++i) {
        data[i] = i;
    }
    for (int k = 0; k < arrSize * 10; ++k) {
        int tmp;
        int i = rand() % arrSize;
        int j = rand() % arrSize;
        tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
    }
    PlotData();
}

void Array::nearlysorted() {
    for (int i = 0; i < arrSize; ++i) {
        data[i] = i;
    }
    for (int k = 0; k < arrSize / 5; ++k) {
        int tmp;
        int i = rand() % (arrSize - 20);
        int j = i + rand() % 20;
        tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
    }
    PlotData();
}

void Array::appended() {
    for (int i = 0; i < arrSize; ++i) {
        data[i] = i;
    }
    for (int k = 0; k < arrSize / 20; ++k) {
        int tmp;
        int i = rand() % (arrSize - 1);
        tmp = data[i];
        for (int j = i + 1; j < arrSize; ++j) {
            data[j - 1] = data[j];
        }
        data[arrSize - 1] = tmp;
    }
    PlotData();
}

void Array::allequal() {
    for (int i = 0; i < arrSize; ++i) {
        data[i] = arrSize / 2;
    }
    PlotData();
}

void Array::selSort() {
    for (int i = 0; i < arrSize; i++) {
        int min = i;
        for (int j = i; j < arrSize; j++) {
            if (Comp(j, min) < 0) {
                min = j;
            }
        }
        Swap(i, min);
    }
}

void Array::insSort() {
    ////// Hier fehlt Sortieren durch Einfügen
    UpdateCompCnt();
    UpdateSwapCnt();
}

void Array::bubbleSort() {
    ////// Hier fehlt der Bubblesort
    // (ich habe die verbesserte Variante
    // mit Merken der Position der letzten Vertauschung implementiert,
    // weil sie im Schnitt nur halb so viele Vergleiche macht)
    UpdateCompCnt();
    UpdateSwapCnt();
}

void Array::biBubbleSort() {
    ////// Hier fehlt der bidirektionale Bubblesort (= "Shakersort")
    // (ebenfalls wieder mit Merken der Grenze an beiden Enden)
    UpdateCompCnt();
    UpdateSwapCnt();
}

void Array::shellSort() {
    // Eine gute Abstandsfolge aus der Literatur, 0 ist Ende-Markierung
    int dist[] = {3709, 1195, 385, 124, 40, 13, 4, 1, 0};
    ////// Hier fehlt der Shellsort mit den oben angegebenen Distanzen
    UpdateCompCnt();
    UpdateSwapCnt();
}

// Die übliche Hilfsfunktion für den Heapsort:
// Betrachte a[left]...a[right] als Teil eines Heaps a[0]...a[right]
// a[left+1]...a[right] muss schon ein korrekter Heap sein,
// Die Funktion lässt a[left] an die richtige Stelle im Heap "einsickern"
// Achtung:
// heapify wird mit Array-Indices left und right
// im Bereich 0 ... arrSize - 1 aufgerufen
// Gedanklich (für die Berechnung des Sohn-Index) müssen wir das
// auf den Bereich Index 1 ... arrSize umrechnen (+1)
// und dann wieder zurück (-1)
void Array::heapify(int left, int right) {
    ////// Zu implementieren!
}

void Array::heapSort() {
    ////// Hier fehlt der Heapsort
    UpdateCompCnt();
    UpdateSwapCnt();
}

// Die übliche rekursive Hilfsfunktion für den Quicksort:
// Sortiere die Elemente zwischen left und right (jeweils inklusive)
// ms ist die Verzögerung: Wenn ms größer 0 ist:
// vor den beiden rekursiven Aufrufen ein wxMilliSleep(ms) machen!
// simple wählt den einfacheren Partitions-Algorithmus (wenn true)
// opt wählt das Partitions-Element mit "middle of three"-Methode (wenn true)
void Array::quick1(int left, int right, int ms, bool simple, bool opt) {
    ////// Zu implementieren!
}

void Array::quickSort(int ms, bool simple, bool opt) {
    quick1(0, arrSize - 1, ms, simple, opt);
    UpdateCompCnt();
    UpdateSwapCnt();
}