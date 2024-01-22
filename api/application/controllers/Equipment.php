<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Equipment extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('EquipmentModel');
		$this->load->model('SparePartModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new EquipmentModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($model->get_active_course()));
		$result = $model->getAll();
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$model = new EquipmentModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'plate_number' => $requestData['plate_number'],
			'date_purchased' => $requestData['date_purchased'],
			'vehicle_type' => $requestData['vehicle_type'],
		);

		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Equipment Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create equipment.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$model = new EquipmentModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}
	public function details_get($id)
	{
		$model = new SparePartModel;
		$result = $model->details($id);

		$this->response($result, RestController::HTTP_OK);

	}
	public function update_put($id)
	{


		$model = new EquipmentModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'plate_number' => $requestData['plate_number'],
			'date_purchased' => $requestData['date_purchased'],
			'vehicle_type' => $requestData['vehicle_type'],
		);


		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Equipment Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update equipment.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new EquipmentModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Equipment Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete equipment.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$model = new EquipmentModel;
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
				'message' => 'Course Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete course.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}