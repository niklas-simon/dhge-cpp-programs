
#include <cstdlib>
#include <time.h>
#include <iostream>

#include "sdlinterf.h"
#include "color.h"
#include "rect.h"

static const int count = 40;
static const int sleep = 100;

using namespace std;

int randPM(int n) {
    int r = rand() % n;
    if (!r) {
        return randPM(n);
    }
    return (rand() % 2 == 0) ? r : -r;
}

int randPos(int range, int dist) {
    return dist + (rand() % (range - 2*dist));
}

int main(void)
{
    srand(time(nullptr));
    sdlInit(); 

    Rect *rect[count];
    rect[0] = new Rect(Color(255, 255, 0), SDL_X_SIZE / 2, SDL_Y_SIZE / 2, 0, 0, SDL_X_SIZE / 5, SDL_Y_SIZE / 5);
    sdlUpdate();
    sdlMilliSleep(sleep);
    
    for (int i = 1; i < count; i++) {
        rect[i] = new Rect(rect[i - 1]);
        rect[i]->setPos(
            randPos(SDL_X_SIZE, rect[0]->getWidth() / 2),
            randPos(SDL_Y_SIZE, rect[0]->getHeight() / 2)
        );
        sdlUpdate();
        sdlMilliSleep(sleep);
    }

    rect[count - 1]->setPos(SDL_X_SIZE / 5, SDL_Y_SIZE / 5);
    sdlUpdate();
    sdlMilliSleep(sleep);
    for (int i = count - 2; i >= 0; i--) {
        rect[i]->moveOnTop(*rect[i + 1]);
        sdlUpdate();
        sdlMilliSleep(sleep);
    }

    sdlExit();
    return 0;
}