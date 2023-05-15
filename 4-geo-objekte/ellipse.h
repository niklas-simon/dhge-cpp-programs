#ifndef __ELLIPSE
#define __ELLIPSE 1

#include "color.h"
#include "graObj.h"
#include "sdlinterf.h"

class Ellipse : public GraObj {
    public:
        Ellipse(const Color &_color, int _posX, int _posY, int _speedX, int _speedY, int _width, int _height);
        Ellipse(Ellipse *rect);
        ~Ellipse();
        void draw();
        void undraw();
        Ellipse *clone();
};

#endif