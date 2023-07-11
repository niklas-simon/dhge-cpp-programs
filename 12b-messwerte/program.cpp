#include <iostream>
#include <fstream>
#include <cstring>

using namespace std;

class Fraction {
    public:
        Fraction(int numerator = 0, int denominator = 1)
                : numerator(numerator)
                , denominator(denominator)
        {
                optimize();
        }
        Fraction(const char *str)
        {
                const char *seperator = strchr(str, '/');
                numerator = atoi(str);
                if (!seperator) {
                        denominator = 1;
                        return;
                }
                denominator = atoi(++seperator);
                optimize();
        }

        Fraction operator+(const Fraction &f) const
        {
                return Fraction(numerator * f.denominator +
                                        f.numerator * denominator,
                                denominator * f.denominator);
        }
        Fraction &operator+=(const Fraction &f)
        {
                numerator =
                        numerator * f.denominator + f.numerator * denominator;
                denominator = denominator * f.denominator;
                optimize();
                return *this;
        }
        Fraction operator-(const Fraction &f) const
        {
                return Fraction(numerator * f.denominator -
                                        f.numerator * denominator,
                                denominator * f.denominator);
        }
        Fraction operator*(const Fraction &f) const
        {
                return Fraction(numerator * f.numerator,
                                denominator * f.denominator);
        }
        Fraction operator/(const Fraction &f) const
        {
                return Fraction(numerator * f.denominator,
                                denominator * f.numerator);
        }
        Fraction *optimize()
        {
                for (int i = 2; i < denominator / 2; i++) {
                        while (denominator % i == 0 && numerator % i == 0) {
                                numerator /= i;
                                denominator /= i;
                        }
                }
                return this;
        }
        explicit operator double() const
        {
                if (!denominator) {
                        cerr << "Division durch 0" << endl;
                        exit(EXIT_FAILURE);
                }
                return (double)numerator / denominator;
        }
        friend ostream &operator<<(ostream &file, const Fraction &fraction);
        friend istream &operator>>(istream &file, Fraction &fraction);

    private:
        int numerator, denominator;
};

ostream &operator<<(ostream &file, const Fraction &fraction)
{
        file << fraction.numerator;
        if (fraction.denominator != 1) {
                file << "/" << fraction.denominator;
        }
        return file;
}

istream &operator>>(istream &file, Fraction &fraction)
{
        string in;
        file >> in;
        fraction = Fraction(in.c_str());
        return file;
}

template <typename T> class Values;

template <typename T> ostream &operator<<(ostream &stream, Values<T> &v);

template <typename T> class Values {
    private:
        int length;
        T *values;
        Values(Values<T> &o);
        Values(int length)
                : length(length)
                , values(new T[length])
        {
        }

    public:
        Values()
                : length(0)
                , values(nullptr)
        {
        }
        ~Values()
        {
                delete[] values;
        }
        int getLength()
        {
                return length;
        }
        int operator~() const
        {
                return length;
        }
        bool operator!() const
        {
                return length == 0;
        }
        const T operator[](int i) const
        {
                return values[i];
        }
        operator T();
        Values &operator=(Values<T> &v);
        Values &operator+=(T value);
        Values &operator+=(Values<T> &v);
        friend ostream &operator<< <T>(ostream &stream, Values<T> &v);
};

template <typename T>
Values<T>::Values(Values<T> &o)
        : length(o.length)
        , values(new T[length])
{
        for (int i = 0; i < length; i++) {
                values[i] = o.values[i];
        }
}

template <typename T> Values<T> &Values<T>::operator+=(T value)
{
        T *res = new T[length + 1];
        for (int i = 0; i < length; i++) {
                res[i] = values[i];
        }
        res[length] = value;
        delete[] values;
        values = res;
        length++;
        return *this;
}

template <typename T> Values<T> &Values<T>::operator+=(Values<T> &v)
{
        T *res = new T[length + v.length];
        for (int i = 0; i < length; i++) {
                res[i] = values[i];
        }
        for (int i = 0; i < v.length; i++) {
                res[length + i] = v.values[i];
        }
        delete[] values;
        values = res;
        length += v.length;
        return *this;
}

template <typename T> Values<T>::operator T()
{
        if (!length)
                return 0;
        T sum = 0;
        for (int i = 0; i < length; i++) {
                sum += values[i];
        }
        return sum / length;
}

template <typename T> Values<T> &Values<T>::operator=(Values<T> &v)
{
        if (&v == this) {
                return *this;
        }
        if (length != v.length) {
                delete[] values;
                length = v.length;
                values = new T[length];
        }
        for (int i = 0; i < length; i++) {
                values[i] = v.values[i];
        }
        return *this;
}

template <typename T> ostream &operator<<(ostream &stream, Values<T> &v)
{
        for (int i = 0; i < v.length; i++) {
                if (i) {
                        stream << " ";
                }
                stream << v.values[i];
        }
        return stream;
}

int main(int argc, char **argv)
{
        Values<Fraction> v = Values<Fraction>();
        for (int i = 1; i < argc; i++) {
                ifstream in = ifstream(argv[i]);
                if (!in) {
                        cerr << argv[0] << ": failed to open " << argv[i]
                             << endl;
                        continue;
                }
                Values<Fraction> v1 = Values<Fraction>();
                Fraction value;
                while (in >> value) {
                        v1 += value;
                }
                cout << argv[i] << ": ";
                if (!v1) {
                        cout << "empty";
                } else {
                        cout << v1;
                }
                cout << endl
                     << "    length: " << v1.getLength()
                     << " average: " << (Fraction)v1 << endl;
                v += v1;
        }
        cout << "first: " << v[0] << " last: " << v[v.getLength() - 1]
             << " average: " << (Fraction)v << " length: " << v.getLength()
             << endl;
}