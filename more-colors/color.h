#ifndef __COLOR
#define __COLOR 1

class Color {

    public:
        Color(int _r = 0, int _g = 0, int _b = 0) :
            r(_r), g(_g), b(_b) {}
        Color(double h, double s, double v);
        static Color &random();
        int getR() const { return r; }
        int getG() const { return g; }
        int getB() const { return b; }
        void darken(int n = 5);

    private:
        int r, g, b;
};

#endif