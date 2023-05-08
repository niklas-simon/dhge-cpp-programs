#include "rect.h"
#include <iostream>
#include <algorithm>

using namespace std;

Rect::Rect(const Color &_color, int _posX, int _posY, int _speedX, int _speedY, int _width, int _height)
    : GraObj(_color, _posX, _posY, _speedX, _speedY, _width, _height) {}

Rect::Rect(Rect *rect) : GraObj(rect) { }

void Rect::draw() {
    sdlDrawRect(posX, posY, width / 2, height / 2, color.getR(), color.getG(), color.getB());
}

void Rect::undraw() {
    sdlDrawRect(posX, posY, width / 2, height / 2, 0, 0, 0);
}

void Rect::moveOnTop(Rect &rect) {
    GraObj::moveOnTop(rect);
}

void Rect::setPos(int x, int y) {
    GraObj::setPos(x, y);
}
int Rect::getWidth() {
    return GraObj::getWidth();
}
int Rect::getHeight() {
    return GraObj::getHeight();
}