#include "rect.h"
#include <algorithm>
#include <iostream>

using namespace std;

Rect::Rect(const Color &_color, int _posX, int _posY, int _speedX, int _speedY, int _width, int _height, int z_index) :
    GraObj(_color, _posX, _posY, _speedX, _speedY, _width, _height, z_index) {}

Rect::Rect(Rect *rect) :
    GraObj(rect) {}

void Rect::draw() {
    if (
        posX - width / 2 < 0 ||
        posY - height / 2 < 0 ||
        posX + width / 2 >= SDL_X_SIZE ||
        posY + height / 2 >= SDL_Y_SIZE) {
        return;
    }
    sdlDrawRect(posX, posY, width / 2, height / 2, color.getR(), color.getG(), color.getB());
}

void Rect::undraw() {
    if (
        posX - width / 2 < 0 ||
        posY - height / 2 < 0 ||
        posX + width / 2 >= SDL_X_SIZE ||
        posY + height / 2 >= SDL_Y_SIZE) {
        return;
    }
    sdlDrawRect(posX, posY, width / 2, height / 2, 0, 0, 0);
}

Rect *Rect::clone() {
    return new Rect(this);
}