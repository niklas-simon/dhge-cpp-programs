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

static const int pixels = 640;
static const int length = 3;
static const wxSize wxsize = wxSize(pixels, pixels);
static const int tile_len = pixels / length;

/*
1 - row
2 - col
3 - diag1
4 - diag2
-1 - draw
*/
int checkWon(int tiles[length][length], int turn, int lastX, int lastY)
{
        bool won = true;
        // row
        for (int i = 0; i < length; i++) {
                if (tiles[i][lastY] != turn) {
                        won = false;
                        break;
                }
        }
        if (won)
                return 1;
        won = true;
        // col
        for (int i = 0; i < length; i++) {
                if (tiles[lastX][i] != turn) {
                        won = false;
                        break;
                }
        }
        if (won)
                return 2;
        if (lastX == lastY) {
                won = true;
                // is on diag 1
                for (int i = 0; i < length; i++) {
                        if (tiles[i][i] != turn) {
                                won = false;
                                break;
                        }
                }
                if (won)
                        return 3;
        }
        if (lastX == length - lastY - 1) {
                won = true;
                // is on diag 2
                for (int i = 0; i < length; i++) {
                        if (tiles[length - i - 1][i] != turn) {
                                won = false;
                                break;
                        }
                }
                if (won)
                        return 4;
        }
        won = true;
        for (int i = 0; i < length; i++) {
                for (int j = 0; j < length; j++) {
                        if (!tiles[i][j]) {
                                won = false;
                        }
                }
        }
        if (won)
                return -1;
        return 0;
}

int sumMove(int tiles[length][length], int turn, int me)
{
        int sum = 0;
        for (int i = 0; i < length; i++) {
                for (int j = 0; j < length; j++) {
                        if (!tiles[i][j]) {
                                tiles[i][j] = turn;
                                if (checkWon(tiles, turn, i, j) > 0) {
                                        if (turn == me) {
                                                sum++;
                                        } else {
                                                sum--;
                                        }
                                } else {
                                        sum += sumMove(tiles, !(turn - 1) + 1,
                                                       me);
                                }
                                tiles[i][j] = 0;
                        }
                }
        }
        return sum;
}

typedef struct Move {
        int x;
        int y;
} Move;

Move bestMove(int tiles[length][length], int turn)
{
        Move max_move = { -1, -1 };
        int max = INT32_MIN;
        for (int i = 0; i < length; i++) {
                for (int j = 0; j < length; j++) {
                        if (!tiles[i][j]) {
                                tiles[i][j] = turn;
                                if (checkWon(tiles, turn, i, j) > 0) {
                                        // won -> just make that move
                                        return { i, j };
                                } else {
                                        int sum = sumMove(
                                                tiles, !(turn - 1) + 1, turn);
                                        if (sum > max) {
                                                max_move = { i, j };
                                                max = sum;
                                        }
                                }
                                tiles[i][j] = 0;
                        }
                }
        }
        return max_move;
}

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
                clear();
        }
        void OnClick(wxMouseEvent &e)
        {
                if (!turn) {
                        return;
                }
                wxClientDC dc = wxClientDC(this);
                wxPoint p = e.GetLogicalPosition(dc);
                lastX = p.x * length / pixels;
                lastY = p.y * length / pixels;
                if (tiles[lastX][lastY]) {
                        return;
                }
                tiles[lastX][lastY] = turn;
                won = checkWon(tiles, tiles[lastX][lastY], lastX, lastY);
                if (won) {
                        turn = 0;
                } else if (turn == 1) {
                        turn = 2;
                } else {
                        turn = 1;
                }
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
                for (int i = 0; i < length; i++) {
                        for (int j = 0; j < length; j++) {
                                tiles[i][j] = 0;
                        }
                }
                bot = (rand() % 2) + 1;
                turn = 1;
                won = 0;
                draw(dc);
        }
        void draw(wxDC &dc)
        {
                if (bot == turn) {
                        // turn is bot -> make move
                        auto m = bestMove(tiles, turn);
                        lastX = m.x;
                        lastY = m.y;
                        tiles[lastX][lastY] = turn;
                        won = checkWon(tiles, tiles[lastX][lastY], lastX,
                                       lastY);
                        if (won) {
                                turn = 0;
                        } else if (turn == 1) {
                                turn = 2;
                        } else {
                                turn = 1;
                        }
                }
                dc.Clear();
                dc.SetBrush(*wxTRANSPARENT_BRUSH);
                // draw board
                for (int i = 0; i < length; i++) {
                        if (i) {
                                dc.SetPen(*wxBLACK_PEN);
                                dc.DrawLine(i * tile_len, 0, i * tile_len,
                                            pixels - 1);
                                dc.DrawLine(0, i * tile_len, pixels - 1,
                                            i * tile_len);
                        }
                }
                // draw marks
                for (int i = 0; i < length; i++) {
                        for (int j = 0; j < length; j++) {
                                switch (tiles[i][j]) {
                                case 1:
                                        dc.SetPen(*wxRED_PEN);
                                        dc.DrawLine(i * tile_len + 20,
                                                    j * tile_len + 20,
                                                    (i + 1) * tile_len - 20,
                                                    (j + 1) * tile_len - 20);
                                        dc.DrawLine((i + 1) * tile_len - 20,
                                                    j * tile_len + 20,
                                                    i * tile_len + 20,
                                                    (j + 1) * tile_len - 20);
                                        break;
                                case 2:
                                        dc.SetPen(*wxBLUE_PEN);
                                        dc.DrawCircle(
                                                i * tile_len + tile_len / 2,
                                                j * tile_len + tile_len / 2,
                                                tile_len / 2 - 20);
                                        break;
                                }
                        }
                }
                // draw winstate
                if (won > 0) {
                        // somebody won something
                        wxPen pen = *wxBLUE_PEN;
                        if (tiles[lastX][lastY] == 1) {
                                // player 1
                                pen = *wxRED_PEN;
                        }
                        pen.SetWidth(5);
                        dc.SetPen(pen);
                        switch (won) {
                        case 1:
                                // row
                                dc.DrawLine(30, lastY * tile_len + tile_len / 2,
                                            pixels - 30,
                                            lastY * tile_len + tile_len / 2);
                                break;
                        case 2:
                                // col
                                dc.DrawLine(lastX * tile_len + tile_len / 2, 30,
                                            lastX * tile_len + tile_len / 2,
                                            pixels - 30);
                                break;
                        case 3:
                                // diag 1
                                dc.DrawLine(30, 30, pixels - 30, pixels - 30);
                                break;
                        case 4:
                                // diag 2
                                dc.DrawLine(pixels - 30, 30, 30, pixels - 30);
                        }
                }
        }

    private:
        int tiles[length][length];
        int turn = 1;
        int won = 0;
        int bot = 0;
        int lastX = 0;
        int lastY = 0;
};

class MyFrame : public wxFrame {
    public:
        MyFrame()
                : wxFrame(nullptr, -1, "window")
                , puzzle(new MyWindow(this))
        {
                wxButton *shuffle = new wxButton(this, CLEAR, "&New Game");
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
        MyFrame *frame = new MyFrame();
        frame->Show(true);
        return true;
}