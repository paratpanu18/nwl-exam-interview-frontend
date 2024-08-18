<script lang="ts">
    import { onMount } from 'svelte';
    import { getCookie } from '../../utils/cookie';
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    interface Criteria {
        id: string;
        name: string;
    }

    interface Junior {
        id: string;
        name: string;
        nickname: string;
        student_id: string;
        academic_year: string;
        scores: any[];
    }

    let seniorName: string | null = '';
    let seniorId: string | null = '';
    let all_criteria: Criteria[] = [];
    let juniors: Junior[] = [];

    onMount(() => {
        seniorId = getCookie('seniorId');
        seniorName = getCookie('seniorName');
        if (!seniorId || !seniorName) {
            window.location.href = '/';
        }

        // Fetch all criteria
        fetch(`${BASE_URL}/criteriaType`)
            .then(response => response.json())
            .then(data => {
                all_criteria = data.items;
            })
            .catch(error => {
                console.error('Error fetching criteria:', error);
            });


        // Fetch all juniors
        fetch(`${BASE_URL}/senior/get_assigned_score/${seniorId}`)
            .then(response => response.json())
            .then(data => {
                juniors = data.juniors;
                console.log(juniors);
            })
            .catch(error => {
                console.error('Error fetching juniors:', error);
            });
    });

    const handleLogout = async () => {
        document.cookie = "seniorId=; path=/";
        document.cookie = "seniorName=; path=/";
        window.location.href = '/';
    }


</script>

<head>
    <title>
        NaCl - Interview Exam Scoring System
    </title>
</head>

<body>
    <div class="navbar bg-base-300 flex-wrap">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl" href="/home">NaCl - Interview Exam Scoring System</a>
        </div>
        <div class="flex-none">
            <p class="mr-[1rem]">
                Welcome, <span class="font-bold text-green-400">{seniorName}</span>
            </p>
            <button class="btn btn-outline btn-error" on:click={handleLogout}>Logout</button>
        </div>
      </div>

      <div class="flex overflow-x-auto w-[100vw] justify-center mt-[2rem]">
        <table class="table-md w-[97vw]">
          <!-- head -->
          <thead>
            <tr>
              <th class="w-[1%]"></th>
              <th class="w-[15%] truncate text-left">Name</th>
              <th class="w-[7%] truncate text-left">Nickname</th>
              <th class="w-[7%] truncate text-left">Student ID</th>
              <th class="w-[5%] truncate">Year</th>
              {#each all_criteria as criteria}
                <th class="truncate flex-1 hover:text-clip">{criteria.name}</th>
              {/each}
              <th></th>
          </thead>
          <tbody>
            {#each juniors as junior, i}
                <tr>
                    <td>{i + 1}</td>
                    <td class="truncate text-left">{junior.name}</td>
                    <td class="truncate text-left">{junior.nickname}</td>
                    <td class="truncate text-left">{junior.student_id}</td>
                    <td class="truncate text-center">{junior.academic_year}</td>
                    {#each junior.scores as score}
                        <td class="truncate text-center">{score.score}</td>
                    {/each}
                    <td class="text-center">
                        <a href="/score/{junior.id}" class="btn btn-sm btn-outline btn-success">Add score</a>
                    </td>
                </tr>
            {/each}
          </tbody>
        </table>
      </div>
</body>