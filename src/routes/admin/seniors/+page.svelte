<script lang="ts">
    const handleLogout = async () => {
        document.cookie = "seniorId=; path=/";
        document.cookie = "seniorName=; path=/";
        window.location.href = '/';
    }
</script>

<head>
    <title>
        Admin Console
    </title>
</head>

<body class="flex flex-col w-[100vw] h-[100vh]">
    <div class="navbar bg-base-300 flex-wrap">
        <div class="flex-1">
            <div class="mr-[3rem]">
              <a class="btn btn-ghost text-xl" href="/admin">NaCl - Interview Exam Scoring System</a>
            </div>
    
            <div class="breadcrumbs text-sm">
                <ul>
                  <li><a href="/admin">Admin Console</a></li>
                  <li class="font-bold">Senior</li>
                </ul>
            </div>
        </div>
</body>