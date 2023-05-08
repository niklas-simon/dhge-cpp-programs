#include "color.h"
#include <math.h>

struct RGB
{
	unsigned char R;
	unsigned char G;
	unsigned char B;
};

struct HSV
{
	double H;
	double S;
	double V;
};

struct RGB HSVToRGB(struct HSV hsv) {
	double r = 0, g = 0, b = 0;

	if (hsv.S == 0)
	{
		r = hsv.V;
		g = hsv.V;
		b = hsv.V;
	}
	else
	{
		int i;
		double f, p, q, t;

		if (hsv.H == 360)
			hsv.H = 0;
		else
			hsv.H = hsv.H / 60;

		i = (int)trunc(hsv.H);
		f = hsv.H - i;

		p = hsv.V * (1.0 - hsv.S);
		q = hsv.V * (1.0 - (hsv.S * f));
		t = hsv.V * (1.0 - (hsv.S * (1.0 - f)));

		switch (i)
		{
		case 0:
			r = hsv.V;
			g = t;
			b = p;
			break;

		case 1:
			r = q;
			g = hsv.V;
			b = p;
			break;

		case 2:
			r = p;
			g = hsv.V;
			b = t;
			break;

		case 3:
			r = p;
			g = q;
			b = hsv.V;
			break;

		case 4:
			r = t;
			g = p;
			b = hsv.V;
			break;

		default:
			r = hsv.V;
			g = p;
			b = q;
			break;
		}

	}

	struct RGB rgb;
	rgb.R = r * 255;
	rgb.G = g * 255;
	rgb.B = b * 255;

	return rgb;
}

Color &Color::random() {
    struct RGB rgb = HSVToRGB({(double)rand() * 360 / RAND_MAX, 1, 1});
    Color *color = new Color(rgb.R, rgb.G, rgb.B);
    return *color;
}

void Color::darken(int n) {
	r -= n;
	g -= n;
	b -= n;
	if (r < 0) r = 0;
	if (g < 0) g = 0;
	if (b < 0) b = 0;
}