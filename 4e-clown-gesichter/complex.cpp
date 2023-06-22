#include "complex.h"
#include "graObj.h"
#include <cmath>
#include <iostream>

Comp::Comp(int x, int y, int sx, int sy) :
    GraObj(Color(), x, y, sx, sy, 0, 0) {}

Comp::Comp(Comp *c) :
    GraObj(c) {
    for (auto i : c->sub) {
        sub.push_back(i->clone());
    }
}

Comp::~Comp() {
    for (auto i : sub) {
        delete i;
    }
}

Comp *Comp::clone() {
    return new Comp(this);
}

void Comp::recalcSize() {
    int maxX = 0, maxY = 0;
    for (auto i : sub) {
        int x = i->getWidth() + abs(posX - i->getPosX());
        int y = i->getHeight() + abs(posY - i->getPosY());
        if (x > maxX)
            maxX = x;
        if (y > maxY)
            maxY = y;
    }
}

void Comp::add(GraObj *o) {
    sub.push_back(o->clone());
    recalcSize();
}

void Comp::setPos(int x, int y) {
    move(posX - x, posY - y);
}

void Comp::move(int dx, int dy) {
    cout << "moving " << dx << " " << dy << endl;
    undraw();
    posX += dx;
    posY += dy;
    for (auto i : sub)
        i->move(dx, dy);
    draw();
}

void Comp::setSize(int _width, int _height) {
    scale((double)_width * 100 / width, (double)_height * 100 / height);
}

void Comp::scale(int percX, int percY) {
    undraw();
    for (auto i : sub) {
        i->scale(percX, percY);
        i->setPos((i->getPosX() - posX) * percX / 100 + posX, (i->getPosY() - posY) * percY / 100 + posY);
    }
    recalcSize();
    draw();
}

void Comp::draw() {
    cout << "drawing complex shape with size " << sub.size() << endl;
    for (auto i : sub)
        i->draw();
}
void Comp::undraw() {
    for (auto i : sub)
        i->undraw();
}