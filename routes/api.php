<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DocumentCategoryController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\StockLocationController;
use App\Http\Controllers\ResSpecializationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('document/categories', DocumentCategoryController::class);
Route::apiResource('document/types', DocumentTypeController::class);
Route::apiResource('locations', StockLocationController::class);
Route::apiResource('specializations', ResSpecializationController::class);