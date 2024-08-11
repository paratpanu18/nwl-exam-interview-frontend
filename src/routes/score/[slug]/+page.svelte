<script lang="ts">
    import { onMount } from 'svelte';
    import { getCookie } from '../../../utils/cookie';

	export let data: any;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const juniorId = data.props.slug;
    const seniorName = getCookie('seniorName');
    const seniorId = getCookie('seniorId');
    let juniorScore = [];
    let juniorName = '';

    onMount(() => {

        // Fetch junior score
        fetch(`${BASE_URL}/senior/get_assigned_score/${seniorId}/${juniorId}`)
            .then(response => response.json())
            .then(data => {
                juniorScore = data.scores;
                console.log(juniorScore);
            })
            .catch(error => {
                console.error('Error fetching junior score:', error);
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

      <div class="overflow-x-auto flex justify-center">
        <table class="table flex mt-[2rem] w-[90vw]">
          <!-- head -->
          <thead>
            <tr class="text-[1rem]">
              <th class="w-[2rem]"></th>
              <th class="text-left w-[40%]">Topic</th>
              <th class="w-[60%]">Score</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
</body>