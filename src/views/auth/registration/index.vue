<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <div class="text-center mb-4">
                <h1 class="text-2xl font-bold">Create account</h1>
                <p class="text-sm text-gray-500">Sign up to start creating and sharing notes.</p>
            </div>

            <form @submit.prevent="handleRegister" novalidate>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700">Full name</label>
                    <input
                        type="text"
                        v-model="name"
                        placeholder="Your full name"
                        required
                        class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        v-model="email"
                        placeholder="you@example.com"
                        required
                        class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="flex items-center gap-2">
                        <input
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                            placeholder="Create a password"
                            required
                            class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="button" @click="toggleShowPassword" class="text-sm text-gray-600 px-2 py-1 rounded border hover:bg-gray-100" :aria-pressed="showPassword">
                            <FontAwesomeIcon v-if="showPassword" :icon="faEyeSlash" />
                            <FontAwesomeIcon v-else :icon="faEye" />
                        </button>
                    </div>
                    <p v-if="password && password.length < 6" class="text-xs text-red-500 mt-1">Password must be at least 6 characters.</p>
                </div>

                <div v-if="errorMessage" class="mb-3 text-sm text-red-600">{{ errorMessage }}</div>

                <button
                    type="submit"
                    :disabled="!canSubmit || loading"
                    class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path></svg>
                    <span>{{ loading ? 'Creating...' : 'Create account' }}</span>
                </button>
            </form>

            <div class="mt-4">
                <button @click="googleLogin" class="w-full border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                    <FontAwesomeIcon :icon="faGoogle" />
                    <span>Continue with Google</span>
                </button>
            </div>

            <p class="mt-4 text-center text-sm text-gray-600">
                Already have an account?
                <router-link to="/login" class="text-blue-600 font-medium">Sign in</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { register, googleLogin as googleAuthLogin } from '../../../services/auth';
import api from '@/services/api.js';
import { useRouter } from 'vue-router';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const toast = useToast();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const emailIsValid = (val) => /\S+@\S+\.\S+/.test(val);
const canSubmit = computed(() => name.value.trim().length > 1 && emailIsValid(email.value) && password.value.length >= 6);

const handleRegister = async () => {
    if (!canSubmit.value) {
        errorMessage.value = 'Please fill all fields with valid values.';
        return;
    }

    loading.value = true;
    errorMessage.value = '';
    try {
        const { data } = await register({ name: name.value, email: email.value, password: password.value });
        // Save token from response if present
        if (data?.data?.accessToken) {
            localStorage.setItem('accessToken', data.data.accessToken);
        }
        // Fetch current user using token or cookies and persist
        try {
            const me = await api.get('/auth/me', {
                headers: data?.data?.accessToken ? { Authorization: `Bearer ${data.data.accessToken}` } : undefined,
            });
            if (me.data?.data) {
                localStorage.setItem('activeUser', JSON.stringify(me.data.data));
            }
        } catch (_) {
            // ignore; user still has token
        }
        toast.success('Registered successfully');
        router.push('/');
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Registration failed';
        toast.error(errorMessage.value);
    } finally {
        loading.value = false;
    }
};

const googleLogin = () => {
    googleAuthLogin();
};

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
