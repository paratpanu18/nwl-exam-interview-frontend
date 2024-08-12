<script lang="ts">
    import { onMount } from 'svelte';

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    interface AccountQuery {
        items: any[]; // This represents the array of accounts
        page: number;
        pages: number;
        size: number;
        total: number;
    }

    let accounts: any[] = []; 
    let selectedAccount: string = '';

    onMount(async () => {
        try {
            const response = await fetch(`${BASE_URL}/seniors`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data: AccountQuery = await response.json();
            accounts = data.items;
        } catch (error) {
        console.error('Error fetching users:', error);
        }
    });

    const handleLogin = async () => {
        document.cookie = `seniorId=${selectedAccount}; path=/`;
        document.cookie = `seniorName=${accounts.find(account => account.id === selectedAccount).name}; path=/`;
        window.location.href = '/home';
    }

  </script>

<head>
    <title>
        NaCl - Interview Exam Scoring System
    </title>
</head>

<body class="flex items-center justify-center min-h-[100vh]">
    <div class="min-w-[70vw] min-h-[70vh] bg-white rounded-[5%] flex">
        <div class="min-w-[50%] flex flex-col items-center justify-center text-center bg-cover bg-center rounded-l-[5%]" style="background-image: url('images/login_bg.jpg');">
            <p class="font-bold text-[2rem] text-white drop-shadow-md">Network and Cloud Laboratory</p>
            <p class="text-[1.25rem] text-white drop-shadow-md">Interview Exam Scoring System</p>
        </div>

        <div class="min-w-[50%] text-center flex-col content-center">
            <div class="mt-auto">

            <form class="login-form flex flex-col">
                <div class="form-group">
                    <select class="select select-info w-[80%] bg-white text-black" bind:value={selectedAccount}>
                        <option value="" selected disabled>Select Your Account</option>
                        {#each accounts as account}
                            <option value={account.id}>{account.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <button class="btn btn-info w-[80%] mt-[1rem]" on:click={handleLogin}>Login</button>
                </div>
            </form>

            <div>
                <p class="text-[0.9rem] mt-[2rem]">Don't found your account? <button class="text-blue-500 underline" on:click={() => {alert("It is impossible. If you are really a lab's member, you name should be on the list. Otherwise, you are not a lab's member for sure !")}}>Contact administrator</button></p>
            </div>
        </div>  
    </div>
</body>