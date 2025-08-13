<?php

namespace App\Enums;

enum PaymentMethodEnum : string
{
    case CASH = 'cash';
    case CARD = 'card';
    case MOBILE_MONEY = 'mobile_money';
}
