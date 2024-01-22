<?php

defined('BASEPATH') or exit('No direct script access allowed');

class EquipmentModel extends CI_Model
{

	public $table = 'equipment';

	public function getAll()
	{
		$query = $this->db->select('*') 
			->order_by('date_purchased', 'desc')
			->get($this->table);
		return $query->result();
	}
 
	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


	public function bulk_delete($data)
	{
		$this->db->where_in('id', $data);
		return $this->db->delete($this->table);
	}
}