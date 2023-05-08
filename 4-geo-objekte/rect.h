#ifndef __RECT
#define __RECT 1

#include "color.h"
#include "sdlinterf.h"
#include "graObj.h"

class Rect : GraObj {
    public:
        Rect(const Color &_color, int _posX, int _posY, int _speedX, int _speedY, int _width, int _height);
        Rect(Rect *rect);
        void setPos(int x, int y);
        int getWidth();
        int getHeight();
        void moveOnTop(Rect &rect);
        void draw();
        void undraw();
};

#endif