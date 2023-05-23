#include "color.h"
#include "sdlinterf.h"
#include <iostream>
#include <map>
#include <math.h>
#include <time.h>

using namespace std;

class Vector {
    public:
        Vector(int x, int y) {
            set(x, y);
        }
        Vector(double l, double a) {
            set(l, a);
        }
        void set(int _x, int _y) {
            x = _x;
            y = _y;
            l = sqrt(x * x + y * y);
            a = asin((double)y / l);
        }
        void set(double _l, double _a) {
            l = _l;
            a = _a;
            x = cos(a) * l;
            y = sin(a) * l;
        }
        int getX() { return x; }
        int getY() { return y; }
        double getL() { return l; }
        double getA() { return a; }
        Vector &operator+(Vector &v) {
            Vector *res = new Vector(x + v.x, y + v.y);
            return *res;
        }
        Vector &operator-(Vector &v) {
            Vector *res = new Vector(x - v.x, y - v.y);
            return *res;
        }
        Vector &operator*(double n) {
            Vector *res = new Vector(x * n, y * n);
            return *res;
        }
        double operator*(Vector &v) {
            double res = x * v.getX() + y * v.getY();
            return res;
        }
        Vector &operator/(double n) {
            Vector *res = new Vector((int)(x / n), (int)(y / n));
            return *res;
        }
        double cross(Vector &v) {
            return x * v.getY() - y * v.getX();
        }
        bool isOut() {
            return x < 0 || x >= SDL_X_SIZE || y < 0 || y >= SDL_Y_SIZE;
        }
        void draw(Color c = Color(255, 0, 0)) {
            sdlDrawCirc(x, y, 5, 5, c.r, c.g, c.b);
        }

    private:
        int x;
        int y;
        double l;
        double a;
};

class Line {
    public:
        Line(Vector origin, Vector direction) :
            origin(origin), direction(direction) {}
        Vector origin;
        Vector direction;
        Vector intersection(Line &q) {
            float p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y;
            p0_x = origin.getX();
            p0_y = origin.getY();
            p1_x = (origin + direction).getX();
            p1_y = (origin + direction).getY();
            p2_x = q.origin.getX();
            p2_y = q.origin.getY();
            p3_x = (q.origin + q.direction).getX();
            p3_y = (q.origin + q.direction).getY();
            float s1_x, s1_y, s2_x, s2_y;
            s1_x = p1_x - p0_x;
            s1_y = p1_y - p0_y;
            s2_x = p3_x - p2_x;
            s2_y = p3_y - p2_y;

            float s, t;
            s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
            t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

            int i_x = p0_x + (t * s1_x);
            int i_y = p0_y + (t * s1_y);
            return Vector(i_x, i_y);
        }
        void draw(Color c = Color(255, 255, 255)) {
            sdlDrawLine(origin.getX(), origin.getY(), (origin + direction).getX(), (origin + direction).getY(), c.r, c.g, c.b);
        }
};

struct Point {
        double x;
        double y;
};

int halfX = SDL_X_SIZE / 2;
int halfY = SDL_Y_SIZE / 2;
int scale = SDL_X_SIZE < SDL_Y_SIZE ? SDL_X_SIZE / 3 : SDL_Y_SIZE / 3;

Point getCoordinates(int x, int y) {
    return {(double)(x - halfX) / scale, (double)(y - halfY) / scale};
}

double halfPi = M_PI / 2;
Color pointToColor(int x, int y) {
    Point p = getCoordinates(x, y);
    double res = p.x * p.x + p.y * p.y;
    double l = sqrt(res);
    double a = 0;
    if (res)
        a = asin(p.y / l) + halfPi;
    if (p.x > 0) {
        a = 2 * M_PI - a;
    }
    if (res > 1) {
        res = 1 / pow(res, 1.5);
    }
    double h = a * 180 / M_PI;
    if (h > 180)
        h = 360 - h;
    h *= .66;
    h += 120;
    return Color(h, 1.0, l < 1 ? (res * res) : res);
}

int main(int argc, char **argv) {

    sdlInit();
    sdlSetFullscreen();
    sdlSetBlack();

    for (int x = 0; x < SDL_X_SIZE; x++) {
        for (int y = 0; y < SDL_Y_SIZE; y++) {
            Color c = pointToColor(x, y);
            sdlDrawPoint(x, y, c.r, c.g, c.b);
        }
    }

    sdlUpdate();

    for (;;)
        sdlMilliSleep(10);
    sdlExit();
}