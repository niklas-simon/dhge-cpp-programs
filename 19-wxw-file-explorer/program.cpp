// Start of wxWidgets "File Explorer" Program
#include <wx/wx.h>
#include <wx/dirctrl.h>
#include <wx/splitter.h>
#include <wx/textctrl.h>
#include <wx/treectrl.h>
#include <wx/button.h>
#include <wx/msgdlg.h>

class MyApp : public wxApp {
    public:
        bool OnInit() override;
};

wxIMPLEMENT_APP(MyApp);

enum BtnEvents {
    EXIT,
    ONLY_TREE,
    ONLY_TEXT,
    BOTH,
    SAVE
};

class MyFrame : public wxFrame {
    public:
        MyFrame();

    private:
        void OnDblClick(wxTreeEvent &event);
        void OnExit(wxCommandEvent &event);
        void OnOnlyTree(wxCommandEvent &event);
        void OnOnlyText(wxCommandEvent &event);
        void OnBoth(wxCommandEvent &event);
        void OnSave(wxCommandEvent &event);
        void Save(bool force);
        wxSplitterWindow *splitter;
        wxGenericDirCtrl *directory;
        wxTextCtrl *text;
        wxString file = "";
};

bool MyApp::OnInit() {
    MyFrame *frame = new MyFrame();
    frame->Show(true);
    return true;
}

MyFrame::MyFrame() :
    wxFrame(nullptr, wxID_ANY, "File-Explorer"),
    splitter(new wxSplitterWindow(this, -1, wxDefaultPosition, wxSize(800, 600))),
    directory(new wxGenericDirCtrl(splitter, -1)),
    text(new wxTextCtrl(splitter, -1, "", wxDefaultPosition, wxDefaultSize, wxTE_READONLY | wxTE_MULTILINE | wxHSCROLL | wxTE_PROCESS_TAB)) {

    wxButton *exit = new wxButton(this, EXIT, "&Exit");
    wxButton *onlyTree = new wxButton(this, ONLY_TREE, "T&ree Only");
    wxButton *onlyText = new wxButton(this, ONLY_TEXT, "Te&xt Only");
    wxButton *both = new wxButton(this, BOTH, "Tree &and Text");
    wxButton *save = new wxButton(this, SAVE, "Save");

    wxBoxSizer *horizontal = new wxBoxSizer(wxHORIZONTAL);
    horizontal->Add(exit, 1);
    horizontal->Add(onlyTree, 1);
    horizontal->Add(onlyText, 1);
    horizontal->Add(both, 1);
    horizontal->Add(save, 1);

    wxBoxSizer *vertical = new wxBoxSizer(wxVERTICAL);
    vertical->Add(splitter, 1);
    vertical->Add(horizontal, 0);
    vertical->SetMinSize(600, 800);

    splitter->SplitVertically(directory, text, 150);
    splitter->SetMinimumPaneSize(100);

    SetSizerAndFit(vertical);

    directory->SetPath(wxGetCwd());

    text->SetEditable(true);

    Bind(wxEVT_COMMAND_TREE_ITEM_ACTIVATED, &MyFrame::OnDblClick, this);
    Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnExit, this, EXIT);
    Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnOnlyTree, this, ONLY_TREE);
    Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnOnlyText, this, ONLY_TEXT);
    Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnBoth, this, BOTH);
    Bind(wxEVT_COMMAND_BUTTON_CLICKED, &MyFrame::OnSave, this, SAVE);
}

void MyFrame::Save(bool force) {
    if (text->IsModified() && !file.empty()) {
        if (!force) {
            wxMessageDialog dlg = wxMessageDialog(this, "Do you want to save changes made to currently open file?", "Warning", wxYES_NO | wxCENTRE);
            if (dlg.ShowModal() == wxID_NO) {
                return;
            }
        }
        text->SaveFile(file);
    }
}

void MyFrame::OnDblClick(wxTreeEvent &event) {
    Save(false);
    file = directory->GetFilePath();
    if (!file.empty()) {
        text->LoadFile(file);
    }
}

void MyFrame::OnExit(wxCommandEvent &event) {
    Close(true);
}

void MyFrame::OnOnlyTree(wxCommandEvent &event) {
    if (splitter->IsSplit()) {
        splitter->Unsplit(text);
    } else if (splitter->GetWindow1() == text) {
        splitter->SplitVertically(directory, text);
        splitter->Unsplit(text);
    }
}

void MyFrame::OnOnlyText(wxCommandEvent &event) {
    if (splitter->IsSplit()) {
        splitter->Unsplit(directory);
    } else if (splitter->GetWindow1() == directory) {
        splitter->SplitVertically(directory, text);
        splitter->Unsplit(directory);
    }
}

void MyFrame::OnBoth(wxCommandEvent &event) {
    if (!splitter->IsSplit()) {
        splitter->SplitVertically(directory, text);
    }
}

void MyFrame::OnSave(wxCommandEvent &event) {
    Save(true);
}