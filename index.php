<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>

<body>
    <div>
        <h1>Login</h1>
        <form method="post">
            Username: <input type="text" name="username" placeholder="username" required><br>
            Password: <input type="password" name="pwd" placeholder="password" required><br>
            <input type="submit" name="Login">
        </form>
    </div>
</body>
</html>
<?php
    if(isset($_POST['Login'])){
        $username = $_POST['username'];
        $pwd = $_POST['pwd'];
        if($username == 'Yash' && $pwd == '1234'){
            echo "Logged in";
        } else {
            echo "Invalid Credentials";
        }
    }

?>