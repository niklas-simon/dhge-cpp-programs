#include "ellipse.h"
#include <algorithm>
#include <iostream>

using namespace std;

Ellipse::Ellipse(const Color &_color, int _posX, int _posY, int _speedX,
                 int _speedY, int _width, int _height)
        : GraObj(_color, _posX, _posY, _speedX, _speedY, _width, _height)
{
        draw();
}

Ellipse::Ellipse(Ellipse *rect)
        : GraObj(rect)
{
        draw();
}

Ellipse::~Ellipse()
{
        undraw();
}

void Ellipse::draw()
{
        if (posX - width / 2 < 0 || posY - height / 2 < 0 ||
            posX + width / 2 >= SDL_X_SIZE || posY + height / 2 >= SDL_Y_SIZE) {
                return;
        }
        sdlDrawCirc(posX, posY, width / 2, height / 2, color.getR(),
                    color.getG(), color.getB());
}

void Ellipse::undraw()
{
        if (posX - width / 2 < 0 || posY - height / 2 < 0 ||
            posX + width / 2 >= SDL_X_SIZE || posY + height / 2 >= SDL_Y_SIZE) {
                return;
        }
        sdlDrawCirc(posX, posY, width / 2, height / 2, 0, 0, 0);
}

Ellipse *Ellipse::clone()
{
        return new Ellipse(*this);
}