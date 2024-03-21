#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <iostream>
#include <fstream>

#include "httplib/httplib.h"
#include "nlohmann/json.hpp"
using json = nlohmann::json;

httplib::Client cli("localhost", 3000);
std::fstream file;

struct User {
    std::string username;
    std::string password;
    std::string hwid;
};

std::string GetHWID()
{
    HW_PROFILE_INFOA info;
    if (!GetCurrentHwProfileA(&info)) return "";
    
    return info.szHwProfileGuid;
}

void GetSavedData()
{
    std::stringstream ss;
    ss << file.rdbuf();
    std::cout << ss.str();
}

bool CreateAccount()
{
    while (true)
    {
        User user{};

        system("cls");
        user.hwid = GetHWID();

        std::cout << "Username: ";
        std::cin >> user.username;

        std::cout << "Password: ";
        std::cin >> user.password;

        json data;
        data["username"] = user.username;
        data["password"] = user.password;
        data["hwid"] = user.hwid;

        if (auto res = cli.Post("/auth/create", data.dump(), "application/json"))
        {
            if (res->status == httplib::StatusCode::Created_201)
            {
                return true;
            }
        }

        system("cls");
        std::cout << "Failed to create account!\n";
        Sleep(1000);
    }
}

bool Login()
{
    while (true)
    {
        User user{};

        system("cls");
        user.hwid = GetHWID();

        std::cout << "Username: ";
        std::cin >> user.username;

        std::cout << "Password: ";
        std::cin >> user.password;

        json data;
        data["username"] = user.username;
        data["password"] = user.password;
        data["hwid"] = user.hwid;

        if (auto res = cli.Post("/auth/login", data.dump(), "application/json"))
        {
            if (res->status == httplib::StatusCode::OK_200)
            {
                return true;
            }
        }

        system("cls");
        std::cout << "Failed to login!\n";
        Sleep(1000);
    }
}

int main()
{
    char* temp;
    size_t size;
    _dupenv_s(&temp, &size, "appdata");
    std::string path = std::string(temp) + "\\auth_data.txt";
    file.open(path, std::fstream::out | std::fstream::app | std::fstream::in);
    
    GetSavedData();

    if (auto res = cli.Get("/"))
    {
        SetConsoleTitleA("Connection Established");
    }
    else 
    {
        std::cout << "Failed to establish communication with server!\n";
        return EXIT_FAILURE;
    }

    while (true)
    {
        system("cls");
        std::string input = "";

        std::cout << "[1] Login\n[2] Create Account\n\n[#]: ";
        std::cin >> input;

        if (input == "1")
        {
            if (Login()) break;
        }
        else if (input == "2")
        {
            if (CreateAccount()) break;
        }
    }

    file.close();
}