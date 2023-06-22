#include "graObj.h"
#include <algorithm>
#include <iostream>

using namespace std;

GraObj::GraObj(const Color &_color, int _posX, int _posY, int _speedX, int _speedY, int _width, int _height, int z_index) :
    color(_color), posX(_posX), posY(_posY), speedX(_speedX), speedY(_speedY), width(_width), height(_height), z_index(z_index) {
    list.emplace(this);
    id = id_counter++;
}

GraObj::GraObj(GraObj *rect) :
    color(Color()),
    posX(rect->getPosX()), posY(rect->getPosY()),
    speedX(rect->getSpeedX()), speedY(rect->getSpeedY()),
    width(rect->getWidth()), height(rect->getHeight()),
    z_index(rect->z_index) {
    list.emplace(this);
    id = id_counter++;
}

GraObj::~GraObj() {
    list.erase(this);
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
}

void GraObj::setSpeed(int _speedX, int _speedY) {
    speedX = _speedX;
    speedY = _speedY;
}

void GraObj::setSize(int _width, int _height) {
    width = _width;
    height = _height;
}

void GraObj::scale(int percX, int percY) {
    width = percX * width / 100;
    height = percY * height / 100;
}

void GraObj::setPos(int x, int y) {
    posX = x;
    posY = y;
}

void GraObj::move(int dx, int dy) {
    posX += dx;
    posY += dy;
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

void GraObj::drawAll() {
    for_each(list.begin(), list.end(), [](GraObj *g) { g->undraw(); });
    for_each(list.begin(), list.end(), [](GraObj *g) { g->draw(); });
}

set<GraObj *, Criteria> GraObj::list;
int GraObj::id_counter = 0;

bool Criteria::operator()(GraObj *a, GraObj *b) {
    return a->z_index < b->z_index || (a->z_index == b->z_index && a->id < b->id);
}