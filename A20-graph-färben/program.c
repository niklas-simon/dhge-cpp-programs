#define COUNT 20
#define LINK_RATIO .5
#define MAX_TRIES 20
#define innit main
#define _USE_MATH_DEFINES 1

#include <stdbool.h>
#include <time.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "sdlinterf.h"

bool matrix[COUNT][COUNT];
int colors[COUNT];

bool solve(int city, int color_count)
{
        if (city >= COUNT) {
                return true;
        }
        // for each color
        for (int color = 1; color <= color_count; color++) {
                // see if one of the nearby cities has that color
                bool found = false;
                for (int i = 0; i < COUNT; i++) {
                        if (matrix[city][i]) {
                                // city is nearby
                                if (colors[i] == color) {
                                        // nearby city has color
                                        found = true;
                                        break;
                                }
                        }
                }
                if (!found) {
                        // no nearby city has color -> set it
                        colors[city] = color;
                        if (solve(city + 1, color_count)) {
                                // solution was found
                                return true;
                        }
                        // reset color
                        colors[city] = 0;
                }
        }
        return false;
}

typedef struct {
        double r; // a fraction between 0 and 1
        double g; // a fraction between 0 and 1
        double b; // a fraction between 0 and 1
} rgb;

typedef struct {
        double h; // angle in degrees
        double s; // a fraction between 0 and 1
        double v; // a fraction between 0 and 1
} hsv;

static rgb hsv2rgb(hsv in);

rgb hsv2rgb(hsv in)
{
        double hh, p, q, t, ff;
        long i;
        rgb out;

        if (in.s <= 0.0) { // < is bogus, just shuts up warnings
                out.r = in.v;
                out.g = in.v;
                out.b = in.v;
                return out;
        }
        hh = in.h;
        if (hh >= 360.0)
                hh = 0.0;
        hh /= 60.0;
        i = (long)hh;
        ff = hh - i;
        p = in.v * (1.0 - in.s);
        q = in.v * (1.0 - (in.s * ff));
        t = in.v * (1.0 - (in.s * (1.0 - ff)));

        switch (i) {
        case 0:
                out.r = in.v;
                out.g = t;
                out.b = p;
                break;
        case 1:
                out.r = q;
                out.g = in.v;
                out.b = p;
                break;
        case 2:
                out.r = p;
                out.g = in.v;
                out.b = t;
                break;

        case 3:
                out.r = p;
                out.g = q;
                out.b = in.v;
                break;
        case 4:
                out.r = t;
                out.g = p;
                out.b = in.v;
                break;
        case 5:
        default:
                out.r = in.v;
                out.g = p;
                out.b = q;
                break;
        }
        return out;
}

typedef struct Point {
        int x, y;
} Point;

typedef struct City {
        Point pos;
        Point direction;
        double hue;
} City;

Point coords(int city)
{
        double deg = 2 * M_PI / COUNT;
        double len =
                (SDL_X_SIZE < SDL_Y_SIZE ? SDL_X_SIZE : SDL_Y_SIZE) * 1 / 3;
        double angle = deg * city;
        int x = cos(angle) * len;
        int y = sin(angle) * len;
        return (Point){ SDL_X_SIZE / 2 + x, SDL_Y_SIZE / 2 + y };
}

double hue(int color, int color_count)
{
        return 360.0 * color / color_count;
}

#define STEPS 200

void draw(City *cities)
{
        sdlSetFullscreen();
        sdlSetBlack();
        for (int i = 0; i < COUNT; i++) {
                City c1 = cities[i];
                double hue1 = c1.hue;
                rgb color = hsv2rgb((hsv){ hue1, 1, 1 });
                for (int j = 0; j < COUNT; j++) {
                        if (matrix[i][j]) {
                                City c2 = cities[j];
                                double hue2 = c2.hue;
                                if (abs(hue2 - hue1) > 180) {
                                        if (hue2 < hue1) {
                                                hue2 += 360;
                                        } else {
                                                hue1 += 360;
                                        }
                                }
                                double dist_x = c2.pos.x - c1.pos.x;
                                double dist_y = c2.pos.y - c1.pos.y;
                                double dist_hue = hue2 - hue1;
                                for (int k = 0; k < STEPS - 1; k++) {
                                        double h = hue1 + dist_hue * k / STEPS;
                                        while (h > 360)
                                                h -= 360;
                                        rgb c = hsv2rgb((hsv){ h, 1, 1 });
                                        sdlDrawLine(
                                                c1.pos.x + dist_x * k / STEPS,
                                                c1.pos.y + dist_y * k / STEPS,
                                                c1.pos.x + dist_x * (k + 1) /
                                                                   STEPS,
                                                c1.pos.y + dist_y * (k + 1) /
                                                                   STEPS,
                                                c.r * 255, c.g * 255,
                                                c.b * 255);
                                }
                        }
                }
                sdlDrawCirc(c1.pos.x, c1.pos.y, 5, 5, color.r * 255,
                            color.g * 255, color.b * 255);
        }
        sdlUpdate();
}

Point distance(Point p1, Point p2)
{
        return (Point){ p2.x - p1.x, p2.y - p1.y };
}

double length(Point p)
{
        return sqrt(p.x * p.x + p.y * p.y);
}

void step(City *cities, double force)
{
        for (int i = 0; i < COUNT; i++) {
                for (int j = 0; j < COUNT; j++) {
                        Point d = distance(cities[i].pos, cities[j].pos);
                        double l = length(d);
                        if (l < 100) {
                                cities[i].direction.x -= .5 * (cities[j].pos.x -
                                                               cities[i].pos.x);
                                cities[i].direction.y -= .5 * (cities[j].pos.y -
                                                               cities[i].pos.y);
                        } else if (matrix[i][j]) {
                                cities[i].direction.x +=
                                        force *
                                        (cities[j].pos.x - cities[i].pos.x);
                                cities[i].direction.y +=
                                        force *
                                        (cities[j].pos.y - cities[i].pos.y);
                        } else if (l < 200) {
                                cities[i].direction.x -=
                                        2 * force *
                                        (cities[j].pos.x - cities[i].pos.x);
                                cities[i].direction.y -=
                                        2 * force *
                                        (cities[j].pos.y - cities[i].pos.y);
                        }
                }
        }
        for (int i = 0; i < COUNT; i++) {
                cities[i].pos.x += cities[i].direction.x;
                cities[i].pos.y += cities[i].direction.y;
                cities[i].direction.x = 0;
                cities[i].direction.y = 0;
        }
}

void fit(City *cities)
{
        Point m = (Point){ SDL_X_SIZE / 2, SDL_Y_SIZE / 2 };
        double max = length(distance(m, SDL_X_SIZE < SDL_Y_SIZE ?
                                                (Point){ SDL_X_SIZE, m.y } :
                                                (Point){ m.x, SDL_Y_SIZE }));
        for (int i = 0; i < COUNT; i++) {
                Point d = distance(m, cities[i].pos);
                cities[i].direction.x = d.x * .1;
                cities[i].direction.y = d.y * .1;
        }
        for (;;) {
                for (int i = 0; i < COUNT; i++) {
                        Point p = (Point){
                                cities[i].pos.x + cities[i].direction.x,
                                cities[i].pos.y + cities[i].direction.y
                        };
                        if (p.x < 10 || p.y < 10 || p.x >= SDL_X_SIZE - 10 ||
                            p.y >= SDL_Y_SIZE - 10) {
                                return;
                        }
                        cities[i].pos = p;
                }
        }
}

void visualize(int color_count)
{
        sdlInit();
        sdlSetBlack();
        City cities[COUNT];
        for (int i = 0; i < COUNT; i++) {
                cities[i] = (City){ coords(i), (Point){ 0, 0 },
                                    hue(colors[i], color_count) };
        }
        for (double force = .2; force > 0.01; force *= .95) {
                step(cities, force);
        }
        fit(cities);
        draw(cities);
        for (;;) {
                sdlMilliSleep(20);
        }
}

int innit(int argc, char **argv)
{
        srand(time(NULL));
        for (int i = 1; i < COUNT; i++) {
                for (int j = 0; j < i; j++) {
                        matrix[i][j] = rand() % (int)(1.0 / LINK_RATIO) == 0;
                        matrix[j][i] = matrix[i][j];
                }
        }

        for (int i = 0; i < COUNT; i++) {
                for (int j = 0; j < COUNT; j++) {
                        printf("%d ", matrix[i][j]);
                }
                printf("\n");
        }

        for (int i = 0; i < COUNT; i++) {
                colors[i] = 0;
        }

        for (int i = 1; i < MAX_TRIES; i++) {
                if (solve(0, i)) {
                        printf("found solution with %d colors:\n", i);
                        for (int j = 0; j < COUNT; j++) {
                                printf("%d ", colors[j]);
                        }
                        printf("\n");
                        visualize(i);
                        exit(EXIT_SUCCESS);
                }
        }
        printf("no solution was found. tried for up to %d colors.\n",
               MAX_TRIES);
        exit(EXIT_SUCCESS);
}