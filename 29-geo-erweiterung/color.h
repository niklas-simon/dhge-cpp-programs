#ifndef __COLOR
#define __COLOR 1

#include <iostream>

static const int colorStep = 10;

using namespace std;

class Color {
    public:
        Color(int _r, int _g, int _b)
                : r(_r)
                , g(_g)
                , b(_b)
        {
        }
        Color()
                : r(makeColorVal(0))
                , g(makeColorVal(1))
                , b(makeColorVal(2))
        {
                colorCount += colorStep;
        }
        static Color &random();
        int getR() const
        {
                return r;
        }
        int getG() const
        {
                return g;
        }
        int getB() const
        {
                return b;
        }
        void darken(int n = 5);

    private:
        int r, g, b;
        static int colorCount;

        int makeColorVal(int rgbNum);
};

#endif