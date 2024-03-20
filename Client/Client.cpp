#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <iostream>

#include "httplib/httplib.h"
#include "nlohmann/json.hpp"
using json = nlohmann::json;

std::string getHWID()
{
    HW_PROFILE_INFOA info;
    if (!GetCurrentHwProfileA(&info)) return "";
    
    return info.szHwProfileGuid;
}

int main()
{
    httplib::Client cli("localhost", 3000);

   

    if (auto res = cli.Get("/"))
    {
        std::cout << "Established connection with server!\n";
    }
    else 
    {
        std::cout << "Failed to establish communication with server!\n";
        return EXIT_FAILURE;
    }
}