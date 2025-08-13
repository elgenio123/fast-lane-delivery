<?php

namespace App\Enums;

enum DeliveryStatusEnum : string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}
