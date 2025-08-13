<?php

namespace App\Enums;

enum UserEnum : string
{
    case CUSTOMER = 'customer';
    case DRIVER = 'driver';
    case HOST = 'host';
    case ADMIN = 'admin';
}
