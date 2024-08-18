<script lang="ts">
    import { onMount } from 'svelte';
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let newSeniorName = '';
    let newSeniorRole = '';

    let isConfirmModalOpen = false;
    let selectedSeniorId = '';

    enum SeniorRole {
        PRIMARY = 'PRIMARY',
        SECONDARY = 'SECONDARY',
    }
    interface Senior {
        id: string;
        name: string;
        type: SeniorRole;
    }

    let seniors: Senior[] = [];

    onMount(async () => {

        if (sessionStorage.getItem('sessionSecret') != import.meta.env.VITE_SESSION_SECRET) {
            window.location.href = '/admin';
        }

        try {
            const response = await fetch(`${BASE_URL}/seniors`);
            if (!response.ok) {
                throw new Error('Failed to fetch seniors');
            }
            const data = await response.json();
            seniors = data.items;
            console.log(seniors);
        } catch (error) {
            console.error('Error fetching seniors:', error);
        }
    });

    const updateSeniorData = async (seniorId: string, seniorName: string, seniorRole: SeniorRole) => {
        try {
            const req_body = {
                "name": seniorName,
                "type": SeniorRole[seniorRole],
            }
            const response = await fetch(`${BASE_URL}/senior/${seniorId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req_body),
            });
            if (!response.ok) {
                throw new Error('Failed to update senior data');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error updating senior data:', error);
        }
    }

    const removeSenior = async () => {
        try {
            const response = await fetch(`${BASE_URL}/senior/${selectedSeniorId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove senior');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error removing senior:', error);
        }
    }

    const handleRemoveSenior = async (seniorId: string) => {
        isConfirmModalOpen = true;
        selectedSeniorId = seniorId;
    }

    async function addSenior() {

        if (!newSeniorName || !newSeniorRole) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const req_body = {
                "name": newSeniorName,
                "type": SeniorRole[newSeniorRole]
            }
            const response = await fetch(`${BASE_URL}/senior`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req_body),
            });
            if (!response.ok) {
                throw new Error('Failed to add senior');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error adding senior:', error);
        }
    }

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

        <div class="flex">
            <p class="mr-[2rem]">
                Welcome, <span class="font-bold text-green-400">Admin</span>
            </p>
            <button class="btn btn-outline btn-error" on:click={handleLogout}>Logout</button>
        </div>
    </div>

    <div class="flex overflow-x-auto w-full justify-center mt-[1rem]">
        <table class="table w-[90%]">
          <!-- head -->
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Role</td>
              <td></td>
            </tr>
          </thead>
          <tbody>

            <tr>
                <td></td>
                <td>
                    <input 
                        type="text" 
                        placeholder="Type here" 
                        class="input input-bordered w-full max-w-xs" 
                        bind:value={newSeniorName}
                    />
                </td>
                <td>
                    <select 
                        class="select select-info w-[80%] border-0"
                        bind:value={newSeniorRole}
                    >
                        <option value="" selected disabled>Select Role</option>
                        <option value={SeniorRole.PRIMARY}>Primary</option>
                        <option value={SeniorRole.SECONDARY} selected>Secondary</option>
                    </select>
                </td>
                <td>
                    <button 
                        class="btn btn-outline btn-success mr-[1rem]"
                        on:click={addSenior}
                    >
                        Add
                    </button>
                </td>
            </tr>

            {#each seniors as senior, index}
            <tr>
                <td>{index + 1}</td>
                <td>
                    <input 
                        type="text" 
                        placeholder="Type here" 
                        class="input input-bordered w-full max-w-xs" 
                        bind:value={senior.name}
                    />
                </td>
                <td>
                    <select 
                        class="select select-info w-[80%] border-0"
                        bind:value={senior.type}
                    >
                        <option value={SeniorRole.PRIMARY}>Primary</option>
                        <option value={SeniorRole.SECONDARY}>Secondary</option>
                    </select>
                </td>
                <td>
                    <button 
                        class="btn btn-outline btn-success mr-[1rem]"
                        on:click={() => updateSeniorData(
                            senior.id,
                            senior.name, 
                            senior.type
                        )}
                    >
                        Update
                    </button>
                    <button 
                        class="btn btn-outline btn-error"
                        on:click={() => handleRemoveSenior(
                            senior.id,
                        )}
                    >
                        Remove
                    </button>
                </td>
            </tr>
        {/each}
        </table>
    </div>


    
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
                    <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete senior account</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">Are you sure to delete this senior account? Every score recorded by this senior will be removed and CANNOT be undone!</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" on:click={removeSenior}>Delete anyway</button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" on:click={() => {isConfirmModalOpen = false; selectedSeniorId = ''}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        </div>
    {/if}



</body>