<script lang="ts">
    import { onMount } from 'svelte';

	export let data: any;
    let juniorStudentId = data.props.slug;
    let juniorData: string = '';
    let juniorComment = [];

    onMount(() => {
        // Fetch junior score
        fetch(`${import.meta.env.VITE_API_BASE_URL}/junior/score/${juniorStudentId}`)
            .then(response => response.json())
            .then(data => {
                juniorData = data;
                console.log(juniorData);
            })
            .catch(error => {
                console.error('Error fetching junior score:', error);
            });

        // Fetch junior comment
        fetch(`${import.meta.env.VITE_API_BASE_URL}/junior/comment/${juniorStudentId}`)
            .then(response => response.json())
            .then(data => {
                juniorComment = data.criterias;
            })
            .catch(error => {
                console.error('Error fetching junior comment:', error);
            });

    });

    const handleLogout = async () => {
        document.cookie = "adminId=; path=/";
        document.cookie = "adminName=; path=/";
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
                    <li><a href="/admin">Juniors</a></li>
                    <li class="font-bold">{juniorStudentId}</li>
                </ul>
            </div>
        </div>

        <div class="flex">
            <p class="mr-[2rem]">
                Welcome, <span class="font-bold text-green-400">Admin</span>
            </p>
            <button class="btn btn-outline btn-error" on:click={handleLogout}>Logout</button>
        </div>
    </div>

    <div class="flex h-full w-full justify-center">
        <div class="flex mt-[2rem] w-[90%] h-[20%] bg-base-300 rounded-lg items-center">
            <div class="w-[70%] flex flex-col flex-around gap-4 ml-[5rem]">
                <h2 class="font-bold text-green-400 text-[2rem] ml-[1rem]">น้อง{juniorData.nickname}</h2>
                <p class="text-[1rem] ml-[1rem]">{juniorData.name} | <span>ชั้นปีที่ </span>{juniorData.academic_year}</p>
            </div>
            <div class="w-[30%] flex flex-col items-center justify-center">
                <p>Average Score</p>
                <p class="font-bold text-[2rem]">{juniorData.total_avg_score ?? ""}</p>
            </div>
        </div>
    </div>

    <div>
        {#each all_criteria as criteria}

        {/each}
    </div>


</body>