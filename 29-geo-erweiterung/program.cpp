
#include <cstdlib>
#include <iostream>
#include <time.h>

#include "color.h"
#include "ellipse.h"
#include "rect.h"
#include "sdlinterf.h"

static const int count = 50;
static const int sleep = 10;

using namespace std;

int randPM(int n)
{
        int r = rand() % n;
        if (!r) {
                return randPM(n);
        }
        return (rand() % 2 == 0) ? r : -r;
}

int randPos(int range, int dist)
{
        return dist + (rand() % (range - 2 * dist));
}

GraObj *random()
{
        if (rand() % 2 == 0) {
                return new Ellipse(Color(), SDL_X_SIZE / 2, SDL_Y_SIZE / 2,
                                   randPM(3), randPM(3), 150, 150, rand());
        } else {
                return new Rect(Color(), SDL_X_SIZE / 2, SDL_Y_SIZE / 2,
                                randPM(3), randPM(3), 150, 150, rand());
        }
}

int main(void)
{
        srand(time(nullptr));
        sdlInit();
        // sdlSetFullscreen();

        GraObj *rect[count];
        for (int i = 0; i < count; i++) {
                rect[i] = random();
        }

        for (;;) {
                for (int i = 0; i < count; i++) {
                        if (!rect[i]->fly()) {
                                delete rect[i];
                                rect[i] = random();
                        }
                }
                sdlSetBlack();
                GraObj::drawAll();
                sdlUpdate();
                sdlMilliSleep(sleep);
        }

        sdlMilliSleep(1000000);

        sdlExit();
        return 0;
}