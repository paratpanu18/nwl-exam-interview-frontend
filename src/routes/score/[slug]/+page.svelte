<script lang="ts">
    import { onMount } from 'svelte';
    import { getCookie } from '../../../utils/cookie';

  interface ScoreRecord {
    id: string;
    criteria_id: string;
    criteria_name: string;
    score: number;
    comment: string;
  }

  interface Criteria {
    id: string;
    name: string;
  }


	export let data: any;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const juniorId = data.props.slug;
    const seniorName = getCookie('seniorName');
    const seniorId = getCookie('seniorId');
    let juniorScore: ScoreRecord[] = [];
    let all_criteria: Criteria[] = [];

    onMount(() => {

        // Fetch junior score
        fetch(`${BASE_URL}/senior/get_assigned_score/${seniorId}/${juniorId}`)
            .then(response => response.json())
            .then(data => {
                juniorScore = data.scores ?? [];
            })
            .catch(error => {
                console.error('Error fetching junior score:', error);
            });

        // Fetch all criterias
        fetch(`${BASE_URL}/criteriaType`)
            .then(response => response.json())
            .then(data => {
                all_criteria = data.items;
            })
            .catch(error => {
                console.error('Error fetching all criterias:', error);
            });
    });

    const handleLogout = async () => {
        document.cookie = "seniorId=; path=/";
        document.cookie = "seniorName=; path=/";
        window.location.href = '/';
    }

    const handleSave = async () => {
        const scores = Array.from(document.querySelectorAll('.select'));
        const comments = document.querySelectorAll('.input');

        // Check if all scores are filled
        if (scores.some(element => element.value === "")) {
            alert('Please fill all scores');
            return;
        }

        scores.forEach((score, i) => {
          let req_body = {
            junior_id: juniorId,
            senior_id: seniorId,
            criteria_id: all_criteria[i].id,
            score: score.value,
            comment: comments[i].value
          }

          let method = juniorScore.length > 0 ? 'PUT' : 'POST';

          fetch(`${BASE_URL}/score`, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(req_body)
          })
        });

        document.location.reload();
    }

</script>

<head>
    <title>
        NaCl - Interview Exam Scoring System
    </title>
</head>

<body class="flex flex-col w-full h-full">
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

      <!-- <div class="flex justify-center w-full h-[20vh] mb-[2rem]">
        <div class="flex flex-around justify-center items-center mt-[2rem] w-[90%] h-full bg-base-300 rounded-lg items-center">
          <div class="w-full text-center">{juniorNickname}</div>
          <div class="w-full text-center">{juniorName}</div>
          <div class="w-full text-center">{juniorAcademicYear}</div>
        </div>
      </div> -->


    <div class="overflow-x-auto flex justify-center">
      <table class="table flex mt-[2rem] w-[90vw]">
        <!-- head -->
        <thead>
          <tr class="text-[1rem] w-full">
            <th class="w-[2rem]"></th>
            <th class="text-left w-[40%]">Topic</th>
            <th class="w-[60%]">Score</th>
          </tr>
        </thead>
        <tbody>
          {#each all_criteria as criteria, i}
            <tr>
              <td>{i+1}</td>
              <td class="">
                {criteria.name}
              </td>
              <td class="flex flex-row">
                {#if juniorScore.length > 0}
                  {#each juniorScore as score}
                    {#if score.criteria_id === criteria.id}
                      <select class="select w-[20%] mr-[1rem]">
                        {#each [1,2,3,4,5,6,7,8,9,10] as scoreChoice}
                          <option value={scoreChoice} selected={scoreChoice === score.score}>{scoreChoice}</option>
                        {/each}
                      </select>
                      <input type="text" placeholder="Comment..." class="input input-bordered w-full" value="{score.comment}" />
                    {/if}
                  {/each}
                {:else}
                  <!-- Default case when juniorScore is empty -->
                  <select class="select w-[20%] mr-[1rem]">
                    <option value="" disabled selected>Select score</option>
                    {#each [1,2,3,4,5,6,7,8,9,10] as scoreChoice}
                      <option value={scoreChoice}>{scoreChoice}</option>
                    {/each}
                  </select>
                  <input type="text" placeholder="Comment..." class="input input-bordered w-[80%]" value="" />
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="flex justify-center mt-[2rem] w-[100vw]">
      <button class="btn btn-success btn-outline w-[90%]" on:click={handleSave}>Save</button>
    </div>
</body>