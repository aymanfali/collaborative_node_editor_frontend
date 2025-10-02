<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <div class="text-center mb-4">
                <h1 class="text-2xl font-bold">Sign in</h1>
                <p class="text-sm text-gray-500">Welcome back — please sign in to continue.</p>
            </div>

            <form @submit.prevent="handleLogin" novalidate>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" v-model="email" placeholder="you@example.com" required
                        class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Email" />
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="flex items-center gap-2">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Your password"
                            required
                            class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Password" />
                        <button type="button" @click="toggleShowPassword"
                            class="text-sm text-gray-600 px-2 py-1 rounded border hover:bg-gray-100"
                            :aria-pressed="showPassword">
                            <FontAwesomeIcon v-if="showPassword" :icon="faEyeSlash" />
                            <FontAwesomeIcon v-else :icon="faEye" />
                        </button>

                    </div>
                    <p v-if="password && password.length < 6" class="text-xs text-red-500 mt-1">Password should be at
                        least 6 characters.</p>
                </div>

                <div v-if="errorMessage" class="mb-3 text-sm text-red-600">{{ errorMessage }}</div>

                <button type="submit" :disabled="!canSubmit || loading"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                    <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                            fill="none"></circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                    </svg>
                    <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
                </button>
            </form>

            <div class="mt-4">
                <button @click="googleLogin"
                    class="w-full border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                    <FontAwesomeIcon :icon="faGoogle" />
                    <span>Continue with Google</span>
                </button>
            </div>

            <p class="mt-4 text-center text-sm text-gray-600">
                Don't have an account?
                <router-link to="/register" class="text-blue-600 font-medium">Create one</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { login, googleLogin as googleAuthLogin } from '../../../services/auth';
import { useRouter } from 'vue-router';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const toast = useToast();
const router = useRouter();

const email = ref(localStorage.getItem('lastEmail') || '');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const emailIsValid = (val) => /\S+@\S+\.\S+/.test(val);

const canSubmit = computed(() => emailIsValid(email.value) && password.value.length >= 6);

const handleLogin = async () => {
    if (!canSubmit.value) {
        errorMessage.value = 'Please provide a valid email and a password with at least 6 characters.';
        return;
    }

    loading.value = true;
    errorMessage.value = '';
    try {
        const { data } = await login({ email: email.value, password: password.value });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('activeUser', JSON.stringify(data.data.user));
        localStorage.setItem('lastEmail', email.value);
        toast.success('Logged in successfully');
        router.push('/dashboard');
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Login failed';
        toast.error(errorMessage.value);
    } finally {
        loading.value = false;
    }
};

const googleLogin = () => {
    googleAuthLogin();
};

// Optional: handle backend redirect with tokens in query
onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        toast.success('Logged in with Google!');
        router.push('/dashboard');
    }
});
</script>
