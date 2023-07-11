#ifndef __GRAOBJ
#define __GRAOBJ 1

#include "color.h"
#include "sdlinterf.h"
#include <set>

class GraObj;

class Criteria {
    public:
        bool operator()(GraObj *a, GraObj *b);
};

class GraObj {
    public:
        GraObj(const Color &_color, int _posX, int _posY, int _speedX,
               int _speedY, int _width, int _height, int z_index = 0);
        GraObj(GraObj *obj);
        ~GraObj();

        Color getColor() const;
        int getPosX() const;
        int getPosY() const;
        int getSpeedX() const;
        int getSpeedY() const;

        int getWidth() const;
        int getHeight() const;

        void setColor(const Color &_color);

        void setSpeed(int _speedX, int _speedY);

        void setSize(int _width, int _height);

        void scale(int percX, int percY);

        void setPos(int x, int y);

        void move(int dx, int dy);

        bool fly(bool bounce = false);

        virtual void draw() = 0;

        virtual void undraw() = 0;

        void moveOnTop(GraObj &rect);

        virtual GraObj *clone() = 0;

        static void drawAll();

    protected:
        Color color;
        int posX, posY;
        int speedX, speedY;
        int width, height;

    private:
        int z_index, id;
        static set<GraObj *, Criteria> list;
        static int id_counter;
        friend class Criteria;
};

#endif