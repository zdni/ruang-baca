<?php

namespace App\Http\Controllers;

use App\Models\DocumentCategory;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;

class DocumentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $categories = DocumentCategory::all();
            return response()->json([
                'status' => true,
                'message' => 'LIST_CATEGORY',
                'data' => $categories
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

            $category = DocumentCategory::create($request->all());
    
            return response()->json([
                'status' => true,
                'message' => "SUCCESS_CREATE_CATEGORY",
                'data' => $category
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
     * @param  \App\Models\DocumentCategory  $documentCategory
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $category = DocumentCategory::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => "CATEGORY_FOUND",
                'data' => $category
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
     * @param  \App\Models\DocumentCategory  $documentCategory
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

            $category = DocumentCategory::findOrFail($id);
            $filter = [
                'category' => [
                    'id' => (string)$category->id,
                    'name' => $category->name
                ] 
            ];
                
            $category->name = $request->name;
            $category->save();

            $updateDoc = [
                '$set' => [
                    'category.name' => $request->name
                ]
            ];

            Redis::publish('rbtumasterdatachannel', json_encode([
                'filter' => $filter,
                'updateDoc' => $updateDoc,
                'token' => $request->header('Authorization')
            ]));

            return response()->json([
                'status' => true,
                'message' => "CATEGORY_UPDATE_SUCCESS",
                'data' => $category
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
     * @param  \App\Models\DocumentCategory  $documentCategory
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

        // check if data has used

        try {
            $category = DocumentCategory::findOrFail($id);
            $category->delete();
            
            return response()->json([
                'status' => true,
                'message' => "CATEGORY_DELETE_SUCCESS",
                'data' => $category
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
