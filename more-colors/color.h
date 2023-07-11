#ifndef __COLOR
#define __COLOR 1

class Color {
    public:
        Color(int _r = 0, int _g = 0, int _b = 0)
                : r(_r)
                , g(_g)
                , b(_b)
        {
        }
        Color(double h, double s, double v);
        static Color &random();
        Color *normalize();
        int r, g, b;
};

#endif