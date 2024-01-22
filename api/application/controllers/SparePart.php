<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SparePart extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SparePartModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new SparePartModel;
		$CryptoHelper = new CryptoHelper; 
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($model->get_active_course()));
		$result =  $model->getAll();
		$this->response($result, RestController::HTTP_OK);
	} 


	public function get_all_get()
	{
		$model = new SparePartModel;
		$CryptoHelper = new CryptoHelper; 
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($model->get_all_course()));
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$model = new SparePartModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'date_purchased' => $requestData['date_purchased'], 
			'spare_part' => $requestData['spare_part'], 
			'amount' => $requestData['amount'], 
			'pr_number' => $requestData['pr_number'], 
			'equipment' => $requestData['equipment'], 

		); 

		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Spare Part Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create spare part.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$model = new SparePartModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$model = new SparePartModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'date_purchased' => $requestData['date_purchased'], 
			'spare_part' => $requestData['spare_part'], 
			'amount' => $requestData['amount'], 
			'pr_number' => $requestData['pr_number'], 
		);

		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Spare Part Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update spare part.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new SparePartModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Spare Part Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete spare part.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$model = new SparePartModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);

		$result = $model->bulk_delete($ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Spare Part Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete spare part.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}