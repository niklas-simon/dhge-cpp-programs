# dhge-programs

All them programs made in Highschool

command to compile with SDL-lib:
g++ .\program.cpp .\sdlinterf.c -L..\libs\lib -I..\libs\include\ -static -lmingw32 -lSDL2main -lSDL2 -lm -ldinput8 -ldxguid -ldxerr8 -luser32 -lgdi32 -lwinmm -limm32 -lole32 -loleaut32 -lshell32 -lversion -luuid -static-libgcc -lhid -lsetupapi

for linux:
g++ $(sdl2-config --cflags) program.cpp sdlinterf.c $(sdl2-config --libs)

for wxWidgets
g++ program.cpp `wx-config --cxxflags --libs`