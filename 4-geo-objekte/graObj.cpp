#include "graObj.h"
#include <iostream>
#include <algorithm>

using namespace std;

GraObj::GraObj(const Color &_color, int _posX, int _posY, int _speedX, int _speedY, int _width, int _height)
    : color(_color), posX(_posX), posY(_posY), speedX(_speedX), speedY(_speedY), width(_width), height(_height) {
    draw();
}
GraObj::~GraObj() { undraw(); }
GraObj::GraObj(GraObj *rect) :
    color(Color(
        max(rect->getColor().getR() - 5, 0),
        max(rect->getColor().getG() - 5, 0),
        max(rect->getColor().getB() - 5, 0)
    )), 
    posX(rect->getPosX()), 
    posY(rect->getPosY()), 
    speedX(rect->getSpeedX()), 
    speedY(rect->getSpeedY()), 
    width(max(rect->getWidth() - 3, 0)),
    height(max(rect->getHeight() - 3, 0)) {
    draw();
}

Color GraObj::getColor() const { return color; }
int GraObj::getPosX() const { return posX; }
int GraObj::getPosY() const { return posY; }
int GraObj::getSpeedX() const { return speedX; }
int GraObj::getSpeedY() const { return speedY; }

int GraObj::getWidth() const { return width; }
int GraObj::getHeight() const { return height; }

void GraObj::setColor(const Color &_color) {
    color = _color;
    draw();                                   
}

void GraObj::setSpeed(int _speedX, int _speedY) {
    speedX = _speedX; speedY = _speedY;
}

void GraObj::setSize(int _width, int _height) {
    undraw();
    width = _width;
    height = _height;
    draw();
}

void GraObj::scale(int percX, int percY) {
    undraw();
    width = percX * width / 100;
    height = percY * height / 100;
    draw();
}
    
void GraObj::setPos(int x, int y) {
    undraw();    
    posX = x;      
    posY = y;
    draw();    
}

void GraObj::move(int dx, int dy) {
    undraw();
    posX += dx;
    posY += dy;
    draw();
}

bool GraObj::fly(bool bounce) {
    bool ret = true;
    if (((speedX > 0) && (posX >= SDL_X_SIZE - speedX - (width / 2))) ||
        ((speedX < 0) && (posX < -speedX + (width / 2)))) {
        if (bounce) {
            speedX = -speedX;
            ret = false;
        } else {
            return false;
        }
    }
    if (((speedY > 0) && (posY >= SDL_Y_SIZE - speedY - (height / 2))) ||
        ((speedY < 0) && (posY < -speedY + (height / 2)))) {
        if (bounce) {
            speedY = -speedY;
            ret = false;
        } else {
            return false;
        }
    }

    move(speedX, speedY);
    return ret;
}

void GraObj::moveOnTop(GraObj &rect) {
    undraw();
    setPos(rect.getPosX(), rect.getPosY());
    draw();
}