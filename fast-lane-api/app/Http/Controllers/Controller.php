<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Fast Lane Delivery API",
 *      description="API Documentation for Fast Lane Delivery and Guesthouse Booking service",
 *      @OA\Contact(
 *          email="admin@fastlanedelivery.com"
 *      )
 * )
 *
 * @OA\SecurityScheme(
 *     type="http",
 *     description="Login with email and password to get the authentication token",
 *     name="Token based Based",
 *     in="header",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="bearerAuth",
 * )
 */

abstract class Controller
{
    //
}
