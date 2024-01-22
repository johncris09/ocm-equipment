<?php
defined('BASEPATH') or exit('No direct script access allowed');

$route['default_controller']   = 'welcome';
$route['404_override']         = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo']             = 'api/ApiDemoController/index';
 
  // User
$route['user']                        = 'User/index';
$route['login']                       = 'User/login';
$route['user/find/(:any)']            = 'User/find/$1';
$route['user/update/(:any)']          = 'User/update/$1';
$route['user/change_password/(:any)'] = 'User/change_password/$1';
$route['user/delete/(:any)']          = 'User/delete/$1';
  

// Equipment
$route['equipment/get_all']       = 'Equipment/get_all';
$route['equipment/insert']        = 'Equipment/insert';
$route['equipment/find/(:any)']   = 'Equipment/find/$1';
$route['equipment/details/(:any)']   = 'Equipment/details/$1';
$route['equipment/update/(:any)'] = 'Equipment/update/$1';
$route['equipment/delete/(:any)'] = 'Equipment/delete/$1';
$route['equipment/bulk_delete/']  = 'Equipment/bulk_delete/';

// Spare Part
$route['spare_part']       = 'SparePart';
$route['spare_part/insert']        = 'SparePart/insert';
$route['spare_part/find/(:any)']   = 'SparePart/find/$1';
$route['spare_part/update/(:any)'] = 'SparePart/update/$1';
$route['spare_part/delete/(:any)'] = 'SparePart/delete/$1';
$route['spare_part/bulk_delete/']  = 'SparePart/bulk_delete/';

 