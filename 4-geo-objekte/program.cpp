
#include <cstdlib>
#include <iostream>
#include <time.h>

#include "color.h"
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

int main(void) {
    srand(time(nullptr));
    sdlInit();
    sdlSetFullscreen();

    GraObj *rect[count * length];
    for (int i = 0; i < count * length; i++) {
        if (i % length == 0) {
            if (rand() % 2 == 0) {
                rect[i] = new Rect(Color().random(), SDL_X_SIZE / 2, SDL_Y_SIZE / 2, randPM(7), randPM(7), 10, 10);
            } else {
                rect[i] = new Ellipse(Color().random(), SDL_X_SIZE / 2, SDL_Y_SIZE / 2, randPM(7), randPM(7), 13, 13);
            }
        } else {
            rect[i] = rect[i - 1]->clone();
            rect[i]->move(rect[i]->getSpeedX() * 3, rect[i]->getSpeedY() * 3);
        }
    }

    for (;;) {
        for (int i = 0; i < count * length; i++) {
            rect[i]->fly(true);
        }
        sdlUpdate();
        sdlMilliSleep(sleep);
    }

    sdlMilliSleep(1000000);

    sdlExit();
    return 0;
}