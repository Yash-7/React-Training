<?php

$router->group(['prefix' => 'list'], function () use ($router) {
    $router->get('admins', 'ListController@showAdmin');

    $router->get('normal', 'ListController@showNormal');
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('register', 'AuthController@register');

    $router->post('login', 'AuthController@login');

    $router->post('users/resetPassword', 'AuthController@reset');

    $router->get('users/{id}', 'UserController@show');

    $router->post('forgotPassword/{token}', 'AuthController@forgot');

    $router->post('checkEmail', 'AuthController@checkEmail');

    $router->get('verify/{token}', 'MailController@verify');

    $router->get('admin/users', 'AdminController@show');

    $router->post('admin/users/create', 'AdminController@create');

    $router->post('users/createPassword/{token}', 'AuthController@createPassword');

    $router->get('admin/users/delete/{userId}', 'AdminController@destroy');

    $router->post('admin/users/filter', 'AdminController@filter');

    $router->get('email', 'AuthController@emailTest');

    $router->group(['prefix' => 'tasks'], function () use ($router) {
        $router->post('create', 'TaskController@createTask');

        $router->get('delete/{id}', 'TaskController@deleteTask');

        $router->post('update/task/{id}', 'TaskController@updateTask');

        $router->post('update/status/{id}', 'TaskController@updateStatus');

        $router->get('all', 'TaskController@getAllTasks');

        $router->get('assigned', 'TaskController@getAssignedTasks');

        $router->get('todo', 'TaskController@getTodoTasks');

        $router->post('filter/{type}/{id}', 'TaskController@filter');

        $router->get('data', 'TaskController@data');
    });
});
