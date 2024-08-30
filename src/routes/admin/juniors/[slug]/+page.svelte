<script lang="ts">
import { onMount } from 'svelte';

	export let data: any;
    let juniorStudentId = data.props.slug;
    let juniorData: string = '';
    let criterias = {};
    let criteriasKeys = [];

    onMount(async () => {
        // Fetch junior score
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/junior/score/${juniorStudentId}`)
            .then(response => response.json())
            .then(data => {
                juniorData = data;
                criterias = data.criteria;
                criteriasKeys = Object.keys(criterias);
            })
            .catch(error => {
                console.error('Error fetching junior score:', error);
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

    <div class="flex flex-col h-full w-full justify-center items-center">
        <div class="flex mt-[2rem] w-[90%] h-[20%] bg-base-300 rounded-lg items-center justify-center">
            <div class="w-[70%] flex flex-col flex-around gap-4 ml-[5rem]">
                <h2 class="font-bold text-green-400 text-[2rem] ml-[1rem]">น้อง{juniorData.nickname}</h2>
                <p class="text-[1rem] ml-[1rem]">{juniorData.name} | <span>ชั้นปีที่ </span>{juniorData.academic_year}</p>
            </div>
            <div class="w-[30%] flex flex-col items-center justify-center">
                <p>Average Score</p>
                <p class="font-bold text-[2rem]">{juniorData.total_avg_score ? juniorData.total_avg_score.toFixed(2) : "0.0"}</p>
            </div>
        </div>
        
        <div class="flex flex-col w-[90%] h-[70%] mt-[2rem]">
            <div class="mb-[2rem] h-[70%]">
                {#each criteriasKeys as key, index}   
                    <div class="flex flex-row mt-[4rem]">
                        <div class="flex-1 text-2xl font-bold">
                            <p>{index+1}. {key}</p>
                        </div>
                        <div class="text-2xl font-bold">
                            <p>{criterias[key]["avg_score"] != "-" ? criterias[key]["avg_score"].toFixed(2) : "0.0"}</p>
                        </div>
                    </div>
                    <hr class="block border-white my-[2rem]">
    
                    <div class="flex flex-row flex-wrap justify-start gap-x-[1rem] gap-y-[2rem]">
                    {#if Object.entries(criterias[key]["comments"]).length > 0}
                        {#each Object.entries(criterias[key]["comments"]) as [user, comment]}
                            <div class="card bg-base-200 w-[30%] shadow-xl">
                                <div class="card-body">
                                    <h2 class="card-title">{user}</h2>
                                    <p>{comment}</p>
                                </div>
                            </div>          
                        {/each}
                    {:else}
                        <div class="card bg-base-200 w-[100%] shadow-xl">
                            <div class="card-body">
                                <h2 class="card-title">No comments</h2>
                            </div>
                        </div>
    
                    {/if}
                    </div>
    
                {/each}
            </div>
            </div>
    </div>


</body>