#include "sdlinterf.h"
#include <iostream>
#include <math.h>

using namespace std;

enum TouchPoint {
    TOP = 1,
    BOTTOM = 2,
    LEFT = 4,
    RIGHT = 8
};

class Point {
    public:
        double x;
        double y;
        Point(double x, double y) :
            x(x), y(y) {}
};

class Vector : public Point {
    public:
        double a;
        double l;
        Vector() :
            Point(0, 0), a(0), l(0) {}
        Vector(Point p) :
            Point(p.x, p.y) {
            l = sqrt(x * x + y * y);
            a = sin(y / l);
        }
        Vector(double a, double l) :
            Point(acos(a) * l, asin(a) * l), a(a), l(l) {}
};

class Rect {
    public:
        Point start;
        Point end;
        Rect(Point start, Point end) :
            start(start), end(end) {}
        int leaves(const Rect &rect) {
            int res = 0;
            if (rect.start.x > start.x) {
                res |= LEFT;
            }
            if (rect.start.y > start.y) {
                res |= TOP;
            }
            if (rect.end.x <= end.x) {
                res |= RIGHT;
            }
            if (rect.end.y <= end.y) {
                res |= BOTTOM;
            }
            return res;
        }
        bool touches(const Rect &rect) {
            int res = 0;
            if (rect.start.x < end.x && rect.end.x > end.x && rect.start.y < end.y && rect.end.y > start.y) {
                res |= LEFT;
            }
            if (rect.start.y < end.y && rect.end.y > end.y && rect.start.x < end.x && rect.end.x > start.x) {
                res |= TOP;
            }
            if (rect.end.x > start.x && rect.start.x < start.x && rect.start.y < end.y && rect.end.y > start.y) {
                res |= RIGHT;
            }
            if (rect.end.y > start.y && rect.start.y < start.y && rect.start.x < end.x && rect.end.x > start.x) {
                res |= BOTTOM;
            }
            return res;
        }
};

class Color {
    public:
        int r, g, b;
        Color(int r = 0, int g = 0, int b = 0) :
            r(r), g(g), b(b) {}
};

class Object {
    public:
        Point pos;
        Color color;
        Object(Point pos, Color color) :
            pos(pos), color(color) {}
        virtual void draw() = 0;
        virtual void move(int multi = 1) = 0;
};

class Ball : public Object {
    public:
        int r;
        Vector v;
        Ball(Point pos, Color color, int r, Vector v = Vector()) :
            Object(pos, color), r(r), v(v) {}
        Rect getRect() {
            return Rect(Point(pos.x - r, pos.y - r), Point(pos.x + r, pos.y + r));
        }
        void collide(const Rect &rect, bool isInner = false) {
            move();
            int res = 0;
            if (isInner) {
                res = getRect().leaves(rect);
            } else {
                res = getRect().touches(rect);
            }
            move(-1);
            if (res > 0) {
                cout << "res: left " << (res & LEFT) << " right " << (res & RIGHT) << " top " << (res & TOP) << " bottom " << (res & BOTTOM) << endl;
                if ((res & LEFT) > 0 || (res & RIGHT) > 0) {
                    v.x *= -1;
                }
                if ((res & TOP) > 0 || (res & BOTTOM) > 0) {
                    v.y *= -1;
                }
                v = Vector(Point(v.x, v.y));
            }
        }
        void move(int multi = 1) {
            pos = Point(pos.x + v.x * multi, pos.y + v.y * multi);
        }
        void draw() {
            sdlDrawCirc(pos.x, pos.y, r, r, color.r, color.g, color.b);
        }
};

class Wall : public Object {
    public:
        Point size;
        Wall(Point pos, Color color, Point size) :
            Object(pos, color), size(size) {}
        void move(int multi = 1) {}
        Rect getRect() {
            return Rect(Point(pos.x - size.x / 2, pos.y - size.y / 2), Point(pos.x + size.x / 2, pos.y + size.y / 2));
        }
        void draw() {
            sdlDrawRect(pos.x, pos.y, size.x / 2, size.y / 2, color.r, color.g, color.b);
        }
};

static const Rect window = Rect(Point(0, 0), Point(SDL_X_SIZE - 1, SDL_Y_SIZE - 1));

int main() {
    sdlInit();

    Wall *walls[2] = {
        new Wall(Point(SDL_X_SIZE / 5, SDL_Y_SIZE / 2), Color(255, 255, 255), Point(50, 300)),
        new Wall(Point(SDL_X_SIZE / 5 * 4, SDL_Y_SIZE / 2), Color(255, 255, 255), Point(50, 300))};
    Ball *ball = new Ball(Point(SDL_X_SIZE / 2, SDL_Y_SIZE / 2), Color(255, 255, 255), 20, Vector(Point(2, 0)));
    Object *objects[3];
    objects[0] = walls[0];
    objects[1] = walls[1];
    objects[2] = ball;

    for (;;) {
        sdlSetBlack();
        for (int i = 0; i < 2; i++) {
            ball->collide(walls[i]->getRect());
        }
        ball->collide(window, true);
        ball->move();
        for (int i = 0; i < 3; i++) {
            objects[i]->draw();
        }
        sdlUpdate();
    }

    for (;;)
        sdlMilliSleep(10);

    sdlExit();
    return 0;
}