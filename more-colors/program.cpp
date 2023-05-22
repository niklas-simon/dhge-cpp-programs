#include <color.h>
#include <iostream>
#include <map>
#include <math.h>
#include <sdlinterf.h>
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
            sdlDrawCirc(x, y, 5, 5, c.getR(), c.getG(), c.getB());
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
            sdlDrawLine(origin.getX(), origin.getY(), (origin + direction).getX(), (origin + direction).getY(), c.getR(), c.getG(), c.getB());
        }
};

int main(int argc, char **argv) {
    srand(time(NULL));

    sdlInit();
    sdlSetBlack();

    int count = 3;
    Vector *points[count];
    /* for (int i = 0; i < count; i++) {
        points[i] = new Vector(rand() % (SDL_X_SIZE / 2) + SDL_X_SIZE / 4, rand() % (SDL_Y_SIZE / 2) + SDL_Y_SIZE / 4);
        //points[i] = new Vector((i + 1) * SDL_X_SIZE / (count + 1), SDL_Y_SIZE / 2);
    } */

    points[0] = new Vector(SDL_X_SIZE / 5, SDL_Y_SIZE / 5);
    points[1] = new Vector(4 * SDL_X_SIZE / 5, SDL_Y_SIZE / 5);
    points[2] = new Vector(SDL_X_SIZE / 2, 4 * SDL_Y_SIZE / 5);

    Line *borders[count];
    for (int i = 0; i < count; i++) {
        for (int j = i + 1; j < count; j++) {
            Vector toMiddle = (*points[j] - *points[i]) / 2;
            Vector orthogonal = Vector(toMiddle.getY(), -toMiddle.getX());
            Vector middle = *points[i] + toMiddle;
            borders[i + j - 1] = new Line(middle, orthogonal);
        }
    }

    int colors[count];
    for (int x = 0; x < SDL_X_SIZE; x++) {
        for (int y = 0; y < SDL_Y_SIZE; y++) {
            Vector v = Vector(x, y);
            // for each color
            for (int i = 0; i < count; i++) {
                int dist = (v - *points[i]).getL();
                colors[i] = 255 * 300 / (dist == 0 ? 1 : dist);
                if (colors[i] > 255)
                    colors[i] = 255;
            }
            sdlDrawPoint(x, y, colors[0], colors[1], colors[2]);
        }
    }

    sdlUpdate();

    for (;;)
        sdlMilliSleep(10);
    sdlExit();
}