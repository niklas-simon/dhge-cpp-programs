#include <iostream>
#include <string>
#include <time.h>

using namespace std;

class Ticket {
    public:
        Ticket(string customer)
                : customer(customer)
        {
                id = count++;
        }
        virtual int winRank() = 0;

    protected:
        int id;
        string customer;

    private:
        inline static int count;
};

const static int digits = 7;
const static int maxNumber = 9999999;
class NumberTicket : public Ticket {
    public:
        NumberTicket(string customer, int number)
                : Ticket(customer)
                , number(number)
        {
        }
        static void drawNumber()
        {
                currentNumber = rand() % (maxNumber + 1);
        }
        int winRank()
        {
                int won = 0;
                for (int i = 0, n = number, c = currentNumber; i < digits;
                     i++, n /= 10, c /= 10) {
                        if (n % 10 == c % 10)
                                won++;
                }
                return won;
        }

    protected:
        int number;
        inline static int currentNumber;
};

class NumberTicketStats : public NumberTicket {
    public:
        NumberTicketStats(string customer, int number)
                : NumberTicket(customer, number)
        {
                for (int i = 0; i < digits; i++)
                        wonStat[i] = 0;
        }
        ~NumberTicketStats()
        {
                cout << "id: " << id << " customer: " << customer
                     << " number: " << number << endl;
                cout << "calls: " << winRankCalls << endl;
                for (int i = 0; i < digits; i++) {
                        cout << i << ": " << wonStat[i] << endl;
                }
        }
        int winRank()
        {
                int res = NumberTicket::winRank();
                winRankCalls++;
                wonStat[res]++;
                return res;
        }

    private:
        int winRankCalls = 0;
        int wonStat[digits];
};

int main(int argc, char **argv)
{
        srand(time(NULL));

        NumberTicketStats *tickets[2];
        tickets[0] = new NumberTicketStats("Franz", 1234567);
        tickets[1] = new NumberTicketStats("Xaver", 6666666);

        for (int _ = 0; _ < 1000000; _++) {
                NumberTicket::drawNumber();
                for (int i = 0; i < 2; i++) {
                        tickets[i]->winRank();
                }
        }
        for (int i = 0; i < 2; i++) {
                delete tickets[i];
        }
}