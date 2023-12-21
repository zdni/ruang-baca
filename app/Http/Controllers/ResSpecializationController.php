<?php

namespace App\Http\Controllers;

use App\Models\ResSpecialization;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;

class ResSpecializationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $specializations = ResSpecialization::all();
            return response()->json([
                'status' => true,
                'message' => 'LIST_SPECIALIZATION',
                'data' => $specializations
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

            $specialization = ResSpecialization::create($request->all());
    
            return response()->json([
                'status' => true,
                'message' => "SUCCESS_CREATE_SPECIALIZATION",
                'data' => $specialization
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
     * @param  \App\Models\ResSpecialization  $resSpecialization
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $specialization = ResSpecialization::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => "SPECIALIZATION_FOUND",
                'data' => $specialization
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
     * @param  \App\Models\ResSpecialization  $resSpecialization
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

            $specialization = ResSpecialization::findOrFail($id);
            $filter = [
                'specialization' => [
                    'id' => (string)$specialization->id,
                    'name' => $specialization->name
                ] 
            ];
                
            
            
            $specialization->name = $request->name;
            $specialization->save();

            $updateDoc = [
                '$set' => [
                    'specialization.name' => $request->name
                ]
            ];

            Redis::publish('rbtumasterdatachannel', json_encode([
                'filter' => $filter,
                'updateDoc' => $updateDoc,
                'token' => $request->header('Authorization')
            ]));

            return response()->json([
                'status' => true,
                'message' => "SPECIALIZATION_UPDATE_SUCCESS",
                'data' => $specialization
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
     * @param  \App\Models\ResSpecialization  $resSpecialization
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
            $specialization = ResSpecialization::findOrFail($id);
            $specialization->delete();
            
            return response()->json([
                'status' => true,
                'message' => "SPECIALIZATION_DELETE_SUCCESS",
                'data' => $specialization
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
