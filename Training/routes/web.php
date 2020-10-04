<?php

$router->group(['prefix'=>'list'], function () use ($router){
    $router->get('admins','ListController@showAdmin');

    $router->get('normal','ListController@showNormal');
});

$router->group(['prefix'=>'api'],function () use ($router){
    $router->post('register','AuthController@register');

    $router->post('login','AuthController@login');

    $router->post('users/resetPassword', 'AuthController@reset');

    $router->get('users/{id}', 'UserController@show');

    $router->post('forgotPassword/{token}','AuthController@forgot');

    $router->post('checkEmail','AuthController@checkEmail');

    $router->get('verify/{token}','MailController@verify');

    $router->get('admin/users','AdminController@show');

    $router->post('admin/users/create','AdminController@create');

    $router->post('users/createPassword/{token}','AuthController@createPassword');

    $router->get('admin/users/delete/{userId}','AdminController@destroy');
});