#include <iostream>
#include <fstream>

using namespace std;

class Values {
    private:
        int length;
        double *values;
        Values(Values &o);
        Values(int length)
                : length(length)
                , values(new double[length])
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
        const double operator[](int i) const
        {
                return values[i];
        }
        operator double();
        Values &operator=(Values &v);
        Values &operator+=(double value);
        Values &operator+=(Values &v);
        friend ostream &operator<<(ostream &stream, Values &v);
};

Values::Values(Values &o)
        : length(o.length)
        , values(new double[length])
{
        for (int i = 0; i < length; i++) {
                values[i] = o.values[i];
        }
}

Values &Values::operator+=(double value)
{
        double *res = new double[length + 1];
        for (int i = 0; i < length; i++) {
                res[i] = values[i];
        }
        res[length] = value;
        delete[] values;
        values = res;
        length++;
        return *this;
}

Values &Values::operator+=(Values &v)
{
        double *res = new double[length + v.length];
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

Values::operator double()
{
        if (!length)
                return 0;
        double sum = 0;
        for (int i = 0; i < length; i++) {
                sum += values[i];
        }
        return sum / length;
}

Values &Values::operator=(Values &v)
{
        if (&v == this) {
                return *this;
        }
        if (length != v.length) {
                delete[] values;
                length = v.length;
                values = new double[length];
        }
        for (int i = 0; i < length; i++) {
                values[i] = v.values[i];
        }
        return *this;
}

ostream &operator<<(ostream &stream, Values &v)
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
        Values v = Values();
        for (int i = 1; i < argc; i++) {
                ifstream in = ifstream(argv[i]);
                if (!in) {
                        cerr << argv[0] << ": failed to open " << argv[i]
                             << endl;
                        continue;
                }
                Values v1 = Values();
                double value;
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
                     << " average: " << (double)v1 << endl;
                v += v1;
        }
        cout << "first: " << v[0] << " last: " << v[v.getLength() - 1]
             << " average: " << (double)v << " length: " << v.getLength()
             << endl;
}