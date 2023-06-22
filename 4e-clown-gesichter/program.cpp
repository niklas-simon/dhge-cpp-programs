
#include <cstdlib>
#include <iostream>
#include <time.h>
#include <vector>

#include "color.h"
#include "complex.h"
#include "ellipse.h"
#include "rect.h"
#include "sdlinterf.h"

static const int count = 50;
static const int length = 50;
static const int sleep = 0;

using namespace std;

int randPM(int n) {
    int r = rand() % n;
    if (!r) {
        return randPM(n);
    }
    return (rand() % 2 == 0) ? r : -r;
}

int randPos(int range, int dist) { return dist + (rand() % (range - 2 * dist)); }

// Mittelpunkt des ursprünglichen zusammengesetzten Objektes
const int face_x = SDL_X_SIZE / 2;
const int face_y = SDL_Y_SIZE / 2;
const vector<GraObj *> parts = {
    new Ellipse(Color(255, 255, 0), face_x, face_y, 0, 0, 160, 200),
    new Ellipse(Color(200, 100, 0), face_x, face_y, 0, 0, 20, 60),
    new Ellipse(Color(0, 0, 0), face_x - 40, face_y - 20, 0, 0, 50, 50),
    new Ellipse(Color(0, 0, 0), face_x + 40, face_y - 20, 0, 0, 50, 50),
    new Ellipse(Color(255, 0, 255), face_x - 38, face_y - 16, 0, 0, 20, 30),
    new Ellipse(Color(255, 0, 255), face_x + 38, face_y - 16, 0, 0, 20, 30),
    new Ellipse(Color(255, 0, 0), face_x, face_y + 50, 0, 0, 80, 20),
    new Ellipse(Color(255, 200, 0), face_x - 90, face_y - 10, 0, 0, 20, 80),
    new Ellipse(Color(255, 200, 0), face_x + 90, face_y - 10, 0, 0, 20, 80)};

int main(void) {
    srand(time(nullptr));
    sdlInit();
    sdlSetBlack();

    Comp *c = new Comp(face_x, face_y, 3, 3);
    for (auto p : parts) {
        c->add(p);
    }
    c->draw();
    sdlUpdate();

    for (;;) {
        c->fly();
        sdlMilliSleep(10);
    }

    sdlExit();
    return 0;
}