#include <iostream>
#include <map>

using namespace std;

char *getNextNonSpace(char *text)
{
        while (*text == ' ' || *text == '\n' || *text == '\t' ||
               *text == '\r') {
                text++;
        }
        return text;
}

class JsonProperty {
    public:
        JsonProperty(char *_value)
        {
                value = _value;
        }

    private:
        string value;
};

class JsonObject {
    public:
        JsonObject(char *text)
        {
                text = getNextNonSpace(text);
                if (*text != '{') {
                        return;
                }
                text = getNextNonSpace(++text);
        }

    private:
        map<char *, JsonProperty> entries;
};

char *getText()
{
        int size = 1024;
        char *text = (char *)malloc(size * sizeof(char));
        char c = getc(stdin);
        int i;
        for (i = 0; c != EOF; i++, c = getc(stdin)) {
                if (i >= size) {
                        size *= 2;
                        text = (char *)realloc(text, size * sizeof(char));
                }
                text[i] = c;
        }
        text[i] = '\0';
        return text;
}

int main(const int argc, const char **argv)
{
        char *text = getText();
}