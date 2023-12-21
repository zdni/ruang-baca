<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $types = DocumentType::all();
            return response()->json([
                'status' => true,
                'message' => 'LIST_TYPE',
                'data' => $types
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

            $type = DocumentType::create($request->all());
    
            return response()->json([
                'status' => true,
                'message' => "SUCCESS_CREATE_TYPE",
                'data' => $type
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
     * @param  \App\Models\DocumentType  $documentType
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $type = DocumentType::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => "TYPE_FOUND",
                'data' => $type
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
     * @param  \App\Models\DocumentType  $documentType
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

            $type = DocumentType::findOrFail($id);
            $filter = [
                'type' => [
                    'id' => (string)$type->id,
                    'name' => $type->name
                ] 
            ];
                
            
            $type->name = $request->name;
            $type->save();

            $updateDoc = [
                '$set' => [
                    'type.name' => $request->name
                ]
            ];

            Redis::publish('rbtumasterdatachannel', json_encode([
                'filter' => $filter,
                'updateDoc' => $updateDoc,
                'token' => $request->header('Authorization')
            ]));

            return response()->json([
                'status' => true,
                'message' => "TYPE_UPDATE_SUCCESS",
                'data' => $type
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
     * @param  \App\Models\DocumentType  $documentType
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
            $type = DocumentType::findOrFail($id);
            $type->delete();
            
            return response()->json([
                'status' => true,
                'message' => "TYPE_DELETE_SUCCESS",
                'data' => $type
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
