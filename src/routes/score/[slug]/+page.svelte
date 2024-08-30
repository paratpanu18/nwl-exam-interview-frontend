<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { getCookie } from '../../../utils/cookie';

    let isSaved = true;
    let isSavedAlertOpen = false;
    let your_avg_score: number = 0.0;

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

  interface JuniorData {
    name?: string;
    nickname?: string;
    academic_year?: string;
    student_id?: string;
  }

  interface ScoreEntry {
    criteria_id: string;
    score: number;
    comment: string;
  }


	export let data: any;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const juniorId = data.props.slug;
    const seniorName = getCookie('seniorName');
    const seniorId = getCookie('seniorId');
    let juniorScore: ScoreRecord[] = [];
    let all_criteria: Criteria[] = [];
    let juniorData: JuniorData = {};

    onMount(async () => {

        // Fetch junior score
        await fetch(`${BASE_URL}/senior/get_assigned_score/${seniorId}/${juniorId}`)
            .then(response => response.json())
            .then(data => {
                juniorScore = data.scores ?? [];
                juniorData.name = data.junior_name;
                juniorData.nickname = data.junior_nickname;
                juniorData.academic_year = data.junior_academic_year;
                juniorData.student_id = data.junior_student_id;
            })
            .catch(error => {
                console.error('Error fetching junior score:', error);
            });

            if (juniorScore.length > 0) {
                let sum = 0;
                juniorScore.forEach((score) => {
                    sum += score.score;
                });
                your_avg_score = sum / juniorScore.length;
            }
            else {
                your_avg_score = 0.0;
            }

        // Fetch all criterias
        fetch(`${BASE_URL}/criteriaType`)
            .then(response => response.json())
            .then(data => {
                all_criteria = data.items;
            })
            .catch(error => {
                console.error('Error fetching all criterias:', error);
            });

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);
    });

    onDestroy(() => {
      try {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      } catch (error) {
        console.error('Error removing event listener:', error);
      }
    });

    const handleLogout = async () => {
      if (!isSaved) {
        isSavedAlertOpen = true;
        return;
      }
      else {
        document.cookie = "seniorId=; path=/";
        document.cookie = "seniorName=; path=/";
        window.location.href = '/';
      }
    }

    const handleSave = async () => {
        const scores = Array.from(document.querySelectorAll('.select'));
        const comments = document.querySelectorAll('.input');

        // Check if all scores are filled
        if (scores.some(element => element.value === "")) {
            alert('Please fill all scores');
            return;
        }

        let score_set: ScoreEntry[] = []

        scores.forEach((score, i) => {
          let scoreEntry: ScoreEntry = {
            criteria_id: all_criteria[i].id,
            score: score.value,
            comment: comments[i].value
          }

          score_set.push(scoreEntry);
        });

        const requestBody = {
            "senior_id": seniorId,
            "junior_id": juniorId,
            "score_set": score_set
        }

        const method = juniorScore.length > 0 ? 'PUT' : 'POST';
        const endPoint = method === 'POST' ? '/many_score' : '/many_scores';
        await fetch (`${BASE_URL}${endPoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }) 

        isSaved = true;
        document.location.reload();
    }

    const handleChange = () => {
      const scores = Array.from(document.querySelectorAll('.select'));
      let sum = 0;
      let count = 0;
      scores.forEach((score) => {
        if (score.value !== "") {
          sum += parseInt(score.value);
          count += 1;
        }
      });
      count === 0 ? your_avg_score = 0.0 : your_avg_score = sum / count;
      isSaved = false;
    }

    const handleBackToHome = () => {
        if (isSaved) {
            window.location.href = '/home';
        } else {
            isSavedAlertOpen = true;
        }
    }

    const handleBeforeUnload = (event) => {
        if (!isSaved) {
            event.preventDefault();
            event.returnValue = '';
        }
    }

    const handlePopState = (event: PopStateEvent) => {
        if (!isSaved) {
            const confirmation = confirm('You have unsaved changes. Are you sure you want to leave?');
            if (!confirmation) {
                // Push the current state back to cancel the navigation
                history.pushState(null, document.title, window.location.href);
            }
        }
    }

    const handleExit = () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.location.href = '/home';
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
          <button class="btn btn-ghost text-xl" on:click={handleBackToHome}>NaCl - Interview Exam Scoring System</button>
        </div>
        <div class="flex-none">
            <p class="mr-[1rem]">
                Welcome, <span class="font-bold text-green-400">{seniorName}</span>
            </p>
            <button class="btn btn-outline btn-error" on:click={handleLogout}>Logout</button>
        </div>
      </div>

      <div class="flex h-full w-full justify-center">
        <div class="flex mt-[2rem] w-[90%] h-[20%] bg-base-300 rounded-lg items-center py-[1rem]">
            <div class="w-[70%] flex flex-col flex-around gap-4 ml-[5rem]">
                <h2 class="font-bold text-green-400 text-[2rem] ml-[1rem]">น้อง{juniorData.nickname}</h2>
                <p class="text-[1rem] ml-[1rem]">{juniorData.name} | <span>ชั้นปีที่ </span>{juniorData.academic_year}</p>
            </div>
            <div class="w-[30%] flex flex-col items-center justify-center">
                <p>Your average score</p>
                <p class="font-bold text-[2rem]">{your_avg_score % 1 === 0 ? your_avg_score : your_avg_score.toFixed(2)}</p>
            </div>
        </div>
    </div>

    <div class="overflow-x-auto flex justify-center items-center">
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
                      <select class="select w-[20%] mr-[1rem]" on:change={handleChange}>
                        {#each [1,2,3,4,5,6,7,8,9,10] as scoreChoice}
                          <option value={scoreChoice} selected={scoreChoice === score.score}>{scoreChoice}</option>
                        {/each}
                      </select>
                      <input type="text" placeholder="Comment..." class="input input-bordered w-full" value="{score.comment}" on:change={handleChange} />
                    {/if}
                  {/each}
                {:else}
                  <!-- Default case when juniorScore is empty -->
                  <select class="select w-[20%] mr-[1rem]" on:change={handleChange}>
                    <option value="" disabled selected >Select score</option>
                    {#each [1,2,3,4,5,6,7,8,9,10] as scoreChoice}
                      <option value={scoreChoice}>{scoreChoice}</option>
                    {/each}
                  </select>
                  <input type="text" placeholder="Comment..." class="input input-bordered w-[80%]" value="" on:change={handleChange} />
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

    <div class="w-full flex flex-col justify-center items-center mt-[3rem]">
      <h1 class="text-2xl font-bold underline">Question List</h1>

      <div class="collapse collapse-plus bg-base-200 w-[90%] mt-[1rem]">
        <input type="radio" name="my-accordion-3" checked="checked" />
        <div class="collapse-title text-2xl font-bold">General Question / คำถามทั่วไป</div>
        <div class="collapse-content text-l">
          <li>แนะนำตัวให้พี่ ๆ จำเราได้</li>
          <li>ข้อดี ข้อเสีย ของตัวน้องเอง</li>
          <li>ทำไมถึงอยากเข้าแลป</li>
          <li>น้องคาดหวังอะไรกับแลปนี้ ? </li>
          <li>รู้จักพี่ ๆ ในแลปคนไหนบ้าง </li>
          <li>มีเพื่อนมาสัมด้วยไหม ใครบ้าง **(คสพ. น้อง) </li>
          <li>ถ้าน้องติด แต่เพื่อนน้องไม่ติดแล้วน้อง จะยังมาแลปไหม *  </li>
          <li>น้องสามารถทำอะไรให้กับแลปได้บ้าง (หา Graphic)</li>
          <li>นอกจากสายงานด้าน network ถ้าพี่ให้เลือก UI/UX, Front, Back ชอบอะไร</li>
          <li>ในเเก๊งเพื่อนน้องคิดว่าใครควรติดมากที่สุด</li>
          <li>น้องมีวิชาในหลักสูตรหรือหัวข้อที่สนใจเป็นพิเศษไหม </li>
        </div>
      </div>
      
      <div class="collapse collapse-plus bg-base-200 w-[90%] mt-[1rem]">
        <input type="radio" name="my-accordion-3" />
        <div class="collapse-title text-2xl font-bold">Selected Research / หัวข้อที่ค้นคว้ามา</div>
        <div class="collapse-content text-l">
          <li>TCP/IP =  อธิบายการทำงานของ Dns ให้ละเอียดที่สุด </li>
          <li>VM vs Container = Situation + เลือก Vm หรือ container </li>
          <li>Cloud Technology = อธิบาย cloud technology ตามที่น้องไป research มา</li>
        </div>
      </div>

      <div class="collapse collapse-plus bg-base-200 w-[90%] mt-[1rem]">
        <input type="radio" name="my-accordion-3" />
        <div class="collapse-title text-2xl font-bold">Lab Test / สอบภาคปฏิบัติ</div>
        <div class="collapse-content text-l">
          <li>ปี1 = เป็น instruction ssh เเล้วให้น้อง cat file ออกมาให้ดู</li>
          <li>ปี2 = เป็น instruction(ssh username@host -p xxx | ให้เเสดงผลไฟล์เเล้วบอกว่ามันทำอะไรมี permission denied) อันยากของโอ๊ค</li>
          <li>ปี3 = build + run docker</li>
        </div>
      </div>

      <div class="collapse collapse-plus bg-base-200 w-[90%] mt-[1rem]">
        <input type="radio" name="my-accordion-3" />
        <div class="collapse-title text-2xl font-bold">UwU</div>
        <div class="collapse-content text-l">
          <li>น้องจะบริจาคเงินให้แลปได้เท่าไหร่ ( บอกน้องด้วยว่าไม่มีผลต่อคะแนน)</li>
          <li>งานอดิเรกของน้องคืออะไร</li>
          <li>อยู่หอ หรือ อยู่บ้าน</li>
          <li>น้องได้สมัครแลปอื่นไว้ไหม ? ถ้าให้เลือกนับหัวจะเลือกแลปอะไร & มีเพื่อนจากเเลปนั้นมาด้วยบ่ </li>
          <li>จะมานั่งที่แลปบ่อยมั้ย กี่วันจาก 7 วัน</li>
          <li>ถ้าพวกพี่ ๆ เสียงดัง เวลา เล่นเกมดัง น้อง ok บ่ + น้องจะทำยังไง ?</li>
          <li>น้องมีอะไรจะถามพวกพี่มั้ย ? ถามหน่อย </li>
          <li>ต้องบอกน้องด้วยว่าเป็นความลับตลอดไปรู้กันแค่ในห้องสัม</li>
        </div>
      </div>

    </div>

    {#if isSavedAlertOpen}
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!--
          Background backdrop, show/hide based on modal state.
      
          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <!--
              Modal panel, show/hide based on modal state.
      
              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 class="text-base font-semibold leading-6 text-red-500" id="modal-title">You havn't saved the change yet.</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">Are you sure to exit this page, your change won't be saved.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" on:click={handleExit}>Exit</button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" on:click={() => {isSavedAlertOpen = false}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        </div>
    {/if}
</body>