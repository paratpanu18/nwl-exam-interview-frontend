
<script lang="ts">
    import { onMount } from 'svelte';

    let password = '';
    let errorMessage = '';
    let sessionSecret = '';

    interface Criteria {
        id: string;
        name: string;
    }

    interface JuniorScore {
        id: string;
        student_id: string;
        name: string;
        nickname: string;
        academic_year: string;
        score: any[];
        total_avg_score: number;
    }

    let all_criteria: Criteria[] = [];
    let juniors: JuniorScore[] = [];

    // Check if the user is already authenticated when the component is mounted
    onMount(() => {
        sessionSecret = sessionStorage.getItem('sessionSecret') || '';

        // Fetch all criteria
        fetch(`${import.meta.env.VITE_API_BASE_URL}/criteriaType`)
            .then(response => response.json())
            .then(data => {
                all_criteria = data.items;
            })
            .catch(error => {
                console.error('Error fetching criteria:', error);
            });

        // Fetch all juniors
        fetch(`${import.meta.env.VITE_API_BASE_URL}/junior/score`)
            .then(response => response.json())
            .then(data => {
                juniors = data.items;
            })
            .catch(error => {
                console.error('Error fetching juniors:', error);
            });

    });

    const checkPassword = () => {
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
            // Store the password in the session storage
            sessionStorage.setItem('sessionSecret', import.meta.env.VITE_SESSION_SECRET);
            window.location.href = '/admin';
        } else {
            errorMessage = 'Incorrect password';
        }
    };

    const handleLogout = () => {
        // Clear the session storage
        sessionStorage.removeItem('sessionSecret');
        window.location.href = '/';
    };
</script>


<head>
    <title>
        Admin Console
    </title>
</head>

{#if sessionSecret != import.meta.env.VITE_SESSION_SECRET}
<div class="flex items-center justify-center h-[100vh]">
    <div class="flex justify-center items-center bg-opacity-75 w-[30vw] min-h-[30vh]">
        <div class="bg-white p-6 rounded-md w-full flex flex-col items-center">
            <h1 class="text-lg text-black font-bold mb-4 text-center">Admin Console</h1>
            <input
                type="password"
                bind:value={password}
                placeholder="Enter password"
                class="border p-2 w-full bg-white"
                on:keydown={(e) => { if (e.key === 'Enter') checkPassword() }}
            />
            <div class="flex-grow"></div>
            {#if errorMessage}
                <p class="text-red-500 mt-2 text-center">{errorMessage}</p>
            {/if}
            <button on:click={checkPassword} class="btn btn-success btn-outline mt-4 w-full">Login</button>
        </div>
    </div>
</div>

{:else}


<body class="flex flex-col w-[100vw] h-[100vh]">
    <div class="navbar bg-base-300 flex-wrap">
        <div class="flex-1">
            <div class="mr-[3rem]">
              <a class="btn btn-ghost text-xl" href="/admin">NaCl - Interview Exam Scoring System</a>
            </div>
    
            <div class="breadcrumbs text-sm">
                <ul>
                  <li class="font-bold">Admin Console</li>
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
    
    <div class="m-[2rem] w-full flex items-center flex-wrap">
        <p class="font-bold mr-[2rem]">Admin Tools</p>
        <a href="/admin/seniors" class="flex mr-[1%]">
            <button class="btn btn-outline btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>              
                Add / Remove / Edit Senior
            </button>
        </a>

        <a href="/admin/juniors" class="flex mr-[1%]">
            <button class="btn btn-outline btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  
                Add / Remove / Edit Junior
            </button>
        </a>

        <a href="/admin/criteriaTypes" class="flex mr-[1%]">
            <button class="btn btn-outline btn-success mr-[1%]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                  
                Add / Remove / Edit Criteria Type
            </button>
        </a>
    </div>

    <div class="flex overflow-x-auto w-full justify-center mt-[1rem]">
        <table class="table w-[90%]">
          <!-- head -->
          <thead>
            <tr>
              <td>#</td>
              <td>Student ID</td>
              <td>Name</td>
              <td>Nickname</td>
              <td class="text-center">Year</td>
                {#each all_criteria as criteria}
                    <td class="text-center">{criteria.name}</td>
                {/each}
               <td class="text-center text-green-500 font-bold">Average</td>
            </tr>
          </thead>
          <tbody>
            {#each juniors as junior, i}
                <tr class="hover:bg-base-300 hover:cursor-pointer" on:click={() => window.location.href = `/admin/juniors/${junior.student_id}`}>
                    <td>{i + 1}</td>
                    <td>{junior.student_id}</td>
                    <td>{junior.name}</td>
                    <td>{junior.nickname}</td>
                    <td class="text-center">{junior.academic_year}</td>
                    {#each Object.values(junior.score) as score}
                        <td class="text-center">{score}</td>
                    {/each}
                    <td class="text-center text-green-500">{junior.total_avg_score ? junior.total_avg_score.toFixed(2) : ""}</td>
                </tr>
            {/each}

          </tbody>
        </table>

    
</body>
{/if}