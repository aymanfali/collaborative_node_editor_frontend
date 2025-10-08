<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
        <!-- Top gradient banner -->
        <div class="bg-gradient-to-r from-slate-900 to-blue-900 py-10">
            <div class="max-w-3xl mx-auto px-6">
                <h1 class="text-3xl font-semibold text-white">{{ $t('auth.registerBannerTitle') }}</h1>
                <p class="text-white/70 mt-1">{{ $t('auth.registerBannerSubtitle') }}</p>
            </div>
        </div>

        <!-- Auth card -->
        <div class="max-w-md mx-auto -mt-8 px-6 pb-10">
            <div
                class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm">
                <div class="text-center mb-4">
                    <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ $t('auth.signUp') }}</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ $t('auth.minuteToSignUp') }}</p>
                </div>

                <form @submit.prevent="handleRegister" novalidate>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('auth.fullName') }}</label>
                        <input
                            type="text"
                            v-model="name"
                            @input="touched.name = true"
                            :placeholder="$t('auth.fullNamePlaceholder')"
                            required
                            autocomplete="name"
                            :aria-invalid="!!nameError || undefined"
                            :aria-describedby="nameError ? 'name-error' : undefined"
                            :class="[
                              'mt-1 w-full bg-white dark:bg-gray-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 text-slate-700 dark:text-slate-200',
                              nameError ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500'
                            ]"
                        />
                        <p v-if="nameError" id="name-error" class="text-xs text-rose-500 mt-1">{{ nameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('auth.email') }}</label>
                        <input
                            type="email"
                            v-model="email"
                            @input="touched.email = true"
                            :placeholder="$t('auth.emailPlaceholder')"
                            required
                            autocomplete="email"
                            :aria-invalid="!!emailError || undefined"
                            :aria-describedby="emailError ? 'email-error' : undefined"
                            :class="[
                              'mt-1 w-full bg-white dark:bg-gray-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 text-slate-700 dark:text-slate-200',
                              emailError ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500'
                            ]"
                        />
                        <p v-if="emailError" id="email-error" class="text-xs text-rose-500 mt-1">{{ emailError }}</p>
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('auth.password') }}</label>
                        <div class="relative">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                v-model="password"
                                @input="touched.password = true"
                                :placeholder="$t('auth.createPasswordPlaceholder')"
                                required autocomplete="new-password"
                                :aria-invalid="!!passwordError || undefined"
                                :aria-describedby="passwordError ? 'password-error' : undefined"
                                :class="[
                                  'mt-1 w-full bg-white dark:bg-gray-800 border rounded !px-3 dir-pad-end-10 py-2 focus:outline-none focus:ring-2 text-slate-700 dark:text-slate-200',
                                  passwordError ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500'
                                ]"
                            />
                            <button type="button" @click="toggleShowPassword" class="absolute dir-abs-end top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" :aria-pressed="showPassword" aria-label="Toggle password visibility">
                                <FontAwesomeIcon v-if="showPassword" :icon="faEyeSlash" />
                                <FontAwesomeIcon v-else :icon="faEye" />
                            </button>
                        </div>
                        <p v-if="passwordError" id="password-error" class="text-xs text-rose-500 mt-1">{{ passwordError }}</p>
                    </div>

                    <div v-if="errorMessage" class="mb-3 text-sm text-rose-600">{{ errorMessage }}</div>

                    <button
                        type="submit"
                        :disabled="!canSubmit || loading"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md disabled:opacity-60 flex items-center justify-center gap-2 shadow"
                    >
                        <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path></svg>
                        <span>{{ loading ? 'Creating...' : 'Create account' }}</span>
                    </button>
                </form>

                <div class="mt-4">
                    <button @click="googleLogin"
                        class="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200">
                        <FontAwesomeIcon :icon="faGoogle" />
                        <span>{{ $t('auth.continueWithGoogle') }}</span>
                    </button>
                </div>

                <p class="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    {{ $t('auth.alreadyHaveAccount') }}
                    <router-link to="/login" class="text-indigo-600 dark:text-indigo-400 font-medium">{{ $t('auth.signInLink') }}
                        </router-link>
                </p>
            </div>
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
const touched = ref({ name: false, email: false, password: false });

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const emailIsValid = (val) => /\S+@\S+\.\S+/.test(val);
const nameError = computed(() => {
    if (!touched.value.name) return '';
    const v = name.value.trim();
    if (!v) return 'Name is required';
    if (v.length < 3) return 'Name must be at least 3 characters';
    return '';
});
const emailError = computed(() => {
    if (!touched.value.email) return '';
    const v = email.value.trim();
    if (!v) return 'Email is required';
    if (!emailIsValid(v)) return 'Enter a valid email address';
    return '';
});
const passwordError = computed(() => {
    if (!touched.value.password) return '';
    if (!password.value) return 'Password is required';
    if (password.value.length < 6) return 'Password must be at least 6 characters';
    return '';
});
const canSubmit = computed(() => {
    const vName = name.value.trim();
    const vEmail = email.value.trim();
    return (
        vName.length >= 3 &&
        emailIsValid(vEmail) &&
        password.value.length >= 6
    );
});

const handleRegister = async () => {
    if (!canSubmit.value) {
        touched.value = { name: true, email: true, password: true };
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
        router.push('/dashboard');
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
