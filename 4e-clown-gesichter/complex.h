#ifndef _COMPLEX
#define _COMPLEX 1

#include <vector>
#include "graObj.h"

using namespace std;

class Comp : public GraObj {
    public:
        Comp(int x, int y, int sx, int sy);
        Comp(Comp *c);
        ~Comp();
        Comp *clone();
        void add(GraObj *o);
        void draw();
        void undraw();
        void setPos(int x, int y);
        void move(int dx, int dy);
        void setSize(int _width, int _height);
        void scale(int percX, int percY);

    protected:
        void recalcSize();

    private:
        vector<GraObj *> sub;
};

#endif