#ifndef __RECT
#define __RECT 1

#include "color.h"
#include "graObj.h"
#include "sdlinterf.h"

class Rect : public GraObj {
    public:
        Rect(const Color &_color, int _posX, int _posY, int _speedX,
             int _speedY, int _width, int _height);
        Rect(Rect *rect);
        ~Rect();
        void draw();
        void undraw();
        Rect *clone();
};

#endif