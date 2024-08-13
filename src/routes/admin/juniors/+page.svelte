<script lang="ts">
    import { onMount } from 'svelte';

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    let searchQuery = '';
    let isConfirmModalOpen = false;

    let newJunior = {
        student_id: '',
        name: '',
        nickname: '',
        academic_year: ''
    };

    let selectedJuniorId = '';

    $: filteredJuniors = juniors.filter(junior => 
        junior.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        junior.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        junior.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        junior.academic_year.toLowerCase().includes(searchQuery.toLowerCase())
    );

    interface Junior {
        id: string;
        student_id: string;
        name: string;
        nickname: string;
        academic_year: string;
    }

    let juniors: Junior[] = [];
    onMount(() => {

        if (sessionStorage.getItem('sessionSecret') != import.meta.env.VITE_SESSION_SECRET) {
            window.location.href = '/admin';
        }

        fetch(`${BASE_URL}/juniors`)
            .then(response => response.json())
            .then(data => {
                juniors = data.items;
            })
            .catch(error => {
                console.error('Error fetching juniors:', error);
            });
    });

    const addJunior = async () => {
        try {
            const response = await fetch(`${BASE_URL}/junior`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newJunior)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add junior');
            }
            window.location.reload();
        } catch (error) {
            alert(error);
        }
    };

    const removeJunior = async () => {

        if (!selectedJuniorId) {
            alert('No junior selected');
            return;
        }

        if (!confirm('Are you sure you want to remove this junior?')) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/junior/${selectedJuniorId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove junior');
            }
            window.location.reload();
        } catch (error) {
            alert(error);
        }
    };

    function updateJunior(id: string, name: string, nickname: string, student_id: string, academic_year: string) {
        return async () => {
            const req_body = {
                name: name,
                nickname: nickname,
                student_id: student_id,
                academic_year: academic_year
            };
            try {
                const response = await fetch(`${BASE_URL}/junior/${student_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(req_body)
                    
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update junior');
                }
                window.location.reload();
            } catch (error) {
                alert(error);
            }
        };
    }


    const handleLogout = () => {
        // Clear the session storage
        sessionStorage.removeItem('passwordCorrect');
        window.location.href = '/admin';
    };
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
                    <li class="font-bold">Juniors</li>
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

    <!-- <div class="flex items-center">
        <div>
            <input 
                type="text" 
                bind:value={searchQuery} 
                placeholder="Search..." 
                class="input input-bordered w-full ml-[1rem]"
            />
        </div>
    </div> -->
    <div class="flex overflow-x-auto w-full justify-center mt-[1rem]">
        <table class="table w-[90%]">
          <!-- head -->
          <thead>
            <tr>
              <td>#</td>
              <td class="w-[15%]">Student ID</td>
              <td class="w-[30%]">Name</td>
              <td class="w-[15%]">Nickname</td>
              <td class="w-[15%]">Year</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr class="">
                <td></td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered w-full"
                    bind:value={newJunior.student_id}
                />
                </td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered w-full" 
                    bind:value={newJunior.name}
                />
                </td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered w-full" 
                    bind:value={newJunior.nickname}
                />
                </td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered w-full max-w-[30%] text-center" 
                    bind:value={newJunior.academic_year}
                />
                </td>
                <td>
                    <button class="btn btn-success btn-outline mr-[1rem]" on:click={addJunior} >Add</button>
                </td>
            </tr>

            {#each filteredJuniors as junior, i}
            <tr class="hover:bg-base-200">
                <td>{i + 1}</td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered w-full" 
                    bind:value={junior.student_id}
                /></td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered w-full" 
                    bind:value={junior.name}
                /></td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered w-full max-w-xs" 
                    bind:value={junior.nickname}
                /></td>
                <td><input 
                    type="text" 
                    placeholder="Type here" 
                    class="input input-bordered max-w-[30%] text-center" 
                    bind:value={junior.academic_year}
                /></td>
                <td>
                    <button class="btn btn-success btn-outline mr-[1rem]" on:click={updateJunior(
                        junior.id, 
                        junior.name, 
                        junior.nickname, 
                        junior.student_id, 
                        junior.academic_year
                    )}>Update</button>
                    <button class="btn btn-error btn-outline" on:click={() => {isConfirmModalOpen = true; selectedJuniorId = junior.student_id}}>Remove</button>
                </td>
            </tr>
        {/each}

          </tbody>
        </table>

        {#if isConfirmModalOpen}
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
                    <h3 class="text-base font-semibold leading-6 text-red-500" id="modal-title">You are about to do most stupid thing ever</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">Remove a junior will also remove all score record given by every senior and there is no way to bring it back. </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" on:click={removeJunior}>Delete anyway</button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" on:click={() => {isConfirmModalOpen = false; selectedJuniorId = ''}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        </div>
    {/if}



</body>