<?php

namespace App\Http\Controllers;

use App\Models\StockLocation;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;

class StockLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $locations = StockLocation::all();
            return response()->json([
                'status' => true,
                'message' => 'LIST_LOCATION',
                'data' => $locations
            ], Response::HTTP_OK);
        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $response = Http::withHeaders([ 'Authorization' => $request->header('Authorization') ])
        ->acceptJson()
        ->post('http://localhost:4902/api/auth/validate-token')->json();
        if($response['status'] == false) {
            return response()->json($response);
        }

        try {
            $validator = Validator::make($request->all(), [ 'name' => 'required' ]);
            if($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors(),
                    'data' => null
                ]);
            }

            $location = StockLocation::create($request->all());
    
            return response()->json([
                'status' => true,
                'message' => "SUCCESS_CREATE_LOCATION",
                'data' => $location
            ], Response::HTTP_OK);
        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\StockLocation  $stockLocation
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $location = StockLocation::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => "LOCATION_FOUND",
                'data' => $location
            ], Response::HTTP_OK);
        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\StockLocation  $stockLocation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $response = Http::withHeaders([ 'Authorization' => $request->header('Authorization') ])
        ->acceptJson()
        ->post('http://localhost:4902/api/auth/validate-token')->json();
        if($response['status'] == false) {
            return response()->json($response);
        }

        try {
            $validator = Validator::make($request->all(), [ 'name' => 'required' ]);
            if($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors(),
                    'data' => null
                ]);
            }

            $location = StockLocation::findOrFail($id);
            $filter = [
                'location' => [
                    'id' => (string)$location->id,
                    'name' => $location->name
                ] 
            ];
                
            
            
            $location->name = $request->name;
            $location->save();

            $updateDoc = [
                '$set' => [
                    'location.name' => $request->name
                ]
            ];

            Redis::publish('rbtumasterdatachannel', json_encode([
                'filter' => $filter,
                'updateDoc' => $updateDoc,
                'token' => $request->header('Authorization')
            ]));

            return response()->json([
                'status' => true,
                'message' => "LOCATION_UPDATE_SUCCESS",
                'data' => $location
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\StockLocation  $stockLocation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $response = Http::withHeaders([ 'Authorization' => $request->header('Authorization') ])
        ->acceptJson()
        ->post('http://localhost:4902/api/auth/validate-token')->json();
        if($response['status'] == false) {
            return response()->json($response);
        }

        try {
            $location = StockLocation::findOrFail($id);
            $location->delete();
            
            return response()->json([
                'status' => true,
                'message' => "LOCATION_DELETE_SUCCESS",
                'data' => $location
            ], Response::HTTP_OK);
        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
