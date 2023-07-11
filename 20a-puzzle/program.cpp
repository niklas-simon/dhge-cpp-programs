// Start of wxWidgets "File Explorer" Program
#include <ctime>
#include <iostream>
#include <wx/bitmap.h>
#include <wx/imagpng.h>
#include <wx/button.h>
#include <wx/sizer.h>
#include <wx/dcclient.h>
#include <wx/wx.h>
#include <wx/gdicmn.h>

using namespace std;

class MyApp : public wxApp {
    public:
        bool OnInit() override;
};

wxIMPLEMENT_APP(MyApp);

enum BtnEvents { EXIT, CLEAR };

wxBitmap picture = wxBitmap();
static const int pixels = 640;
static const int length = 4;
static const wxSize wxsize = wxSize(pixels, pixels);
static const int tile_len = pixels / length;

class MyWindow : public wxWindow {
    public:
        MyWindow(wxWindow *parent)
                : wxWindow(parent, -1, wxDefaultPosition, wxsize,
                           wxBORDER_SIMPLE)
        {
                for (int i = 0; i < length; i++) {
                        for (int j = 0; j < length; j++) {
                                tiles[i][j] = i * length + j;
                        }
                }
                Bind(wxEVT_PAINT, &MyWindow::OnPaint, this);
                Bind(wxEVT_LEFT_UP, &MyWindow::OnClick, this);
        }
        void OnClick(wxMouseEvent &e)
        {
                wxClientDC dc = wxClientDC(this);
                wxPoint p = e.GetLogicalPosition(dc);
                int x = p.x * length / pixels;
                int y = p.y * length / pixels;
                if (x > 0 && !tiles[x - 1][y]) {
                        tiles[x - 1][y] = tiles[x][y];
                } else if (x < length - 1 && !tiles[x + 1][y]) {
                        tiles[x + 1][y] = tiles[x][y];
                } else if (y > 0 && !tiles[x][y - 1]) {
                        tiles[x][y - 1] = tiles[x][y];
                } else if (y < length - 1 && !tiles[x][y + 1]) {
                        tiles[x][y + 1] = tiles[x][y];
                } else {
                        return;
                }
                tiles[x][y] = 0;
                draw(dc);
        }
        void OnPaint(wxPaintEvent &e)
        {
                wxPaintDC dc = wxPaintDC(this);
                draw(dc);
        }
        void clear()
        {
                wxClientDC dc = wxClientDC(this);
                int x, y;
                bool found = false;
                for (int i = 0; i < length; i++) {
                        for (int j = 0; j < length; j++) {
                                if (!tiles[i][j]) {
                                        x = i;
                                        y = j;
                                        found = true;
                                        break;
                                }
                        }
                        if (found) {
                                break;
                        }
                }
                if (!found) {
                        return;
                }
                for (int i = 0; i < 1000; i++) {
                        int newx, newy;
                        if (x > 0 && rand() % 4 == 0) {
                                newx = x - 1;
                                newy = y;
                        } else if (x < length - 1 && rand() % 4 == 0) {
                                newx = x + 1;
                                newy = y;
                        } else if (y > 0 && rand() % 4 == 0) {
                                newx = x;
                                newy = y - 1;
                        } else if (y < length - 1 && rand() % 4 == 0) {
                                newx = x;
                                newy = y + 1;
                        } else {
                                continue;
                        }
                        tiles[x][y] = tiles[newx][newy];
                        tiles[newx][newy] = 0;
                        x = newx;
                        y = newy;
                }
                draw(dc);
        }
        void draw(wxDC &dc)
        {
                wxMemoryDC mdc = wxMemoryDC();
                mdc.SelectObject(picture);
                dc.Clear();
                for (int i = 0; i < length; i++) {
                        for (int j = 0; j < length; j++) {
                                if (!tiles[i][j]) {
                                        continue;
                                }
                                int srcx = tiles[i][j] % length;
                                int srcy = tiles[i][j] / length;
                                dc.Blit(i * tile_len, j * tile_len, tile_len,
                                        tile_len, &mdc, srcx * tile_len,
                                        srcy * tile_len);
                        }
                }
        }

    private:
        int tiles[length][length];
};

class MyFrame : public wxFrame {
    public:
        MyFrame()
                : wxFrame(nullptr, -1, "window")
                , puzzle(new MyWindow(this))
        {
                wxButton *shuffle = new wxButton(this, CLEAR, "&Shuffle");
                wxButton *btnExit = new wxButton(this, EXIT, "&Exit");
                wxBoxSizer *container = new wxBoxSizer(wxVERTICAL);
                wxBoxSizer *buttons = new wxBoxSizer(wxHORIZONTAL);
                container->Add(puzzle, 1);
                container->Add(buttons, 0);
                buttons->Add(shuffle, 0);
                buttons->Add(btnExit, 0);
                SetSizerAndFit(container);
                Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnExit, this,
                     EXIT);
                Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnShuffle, this,
                     CLEAR);
        }
        void OnShuffle(wxCommandEvent &e)
        {
                puzzle->clear();
        }
        void OnExit(wxCommandEvent &e)
        {
                Close(true);
        }

    private:
        MyWindow *puzzle;
};

bool MyApp::OnInit()
{
        srand(time(nullptr));
        wxImage::AddHandler(new wxPNGHandler());
        if (!picture.LoadFile("img.png", wxBITMAP_TYPE_PNG)) {
                cerr << "failed to load image into bitmap" << endl;
                return false;
        }
        MyFrame *frame = new MyFrame();
        frame->Show(true);
        return true;
}