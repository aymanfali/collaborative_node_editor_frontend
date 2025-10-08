<script setup>
import { faEye, faPen, faTrash, faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'
import api from '@/services/api.js'
import { faHtml5, faMarkdown } from '@fortawesome/free-brands-svg-icons'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    showActions: { type: Boolean, default: true },
    allowEdit: { type: Boolean, default: true },
    itemsPerPage: { type: Number, default: 5 },
    filterableColumns: { type: Array, default: () => [] },
    // Granular visibility controls
    showView: { type: Boolean, default: true },
    showEdit: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },
    showExport: { type: Boolean, default: true },
})

function headerKey(h) {
    if (h && typeof h === 'object' && h.key) return String(h.key)
    return String(h)
}

function headerLabel(h) {
    if (h && typeof h === 'object' && h.label) return String(h.label)
    return String(h)
}

const emit = defineEmits(['edit', 'delete', 'view'])

const currentPage = ref(1)
const filters = reactive({})

function initFilters() {
    // reset and initialize keys to empty strings
    Object.keys(filters).forEach(k => delete filters[k])
    props.filterableColumns.forEach(col => {
        if (col?.key) filters[col.key] = ''
    })
}

onMounted(() => {
    initFilters()
})

watch(() => props.filterableColumns, () => {
    initFilters()
})

const filterItems = computed(() => {
    if (!Array.isArray(props.items)) return []
    if (!props.filterableColumns?.length) return props.items
    return props.items.filter(item => {
        return props.filterableColumns.every(filterConfig => {
            const filterValue = filters[filterConfig.key]
            if (!filterValue) return true
            const itemValue = item[filterConfig.key]
            if (filterConfig.type === 'date') {
                try {
                    const filteredItem = new Date(itemValue).setHours(0, 0, 0, 0)
                    const dateFilter = new Date(filterValue).setHours(0, 0, 0, 0)
                    return filteredItem === dateFilter
                } catch {
                    return false
                }
            }
            return itemValue && itemValue.toString().toLowerCase().includes(filterValue.toLowerCase())
        })
    })
})

const totalPages = computed(() => Math.max(1, Math.ceil((filterItems.value.length || 0) / props.itemsPerPage)))

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    return filterItems.value.slice(start, end)
})

const hasAnyActions = computed(() => {
    // showActions prop must be true and at least one specific action flag enabled
    return props.showActions && (props.showView || (props.allowEdit && props.showEdit) || props.showDelete || props.showExport)
})

// Keep currentPage in range when filters/items change
watch(filterItems, () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
    if (currentPage.value < 1) currentPage.value = 1
})

function handleEdit(item) { emit('edit', item) }
function handleDelete(item) { emit('delete', item) }
function handleView(item) { emit('view', item) }

function sanitizeFilename(name = 'note') {
    return String(name)
        .trim()
        .replace(/[\n\r\t]/g, ' ')
        .replace(/[^a-zA-Z0-9 _.-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100) || 'note'
}

async function downloadExport(item, ext) {
    try {
        const id = item?._id || item?.id
        if (!id) return
        const url = `/notes/${id}/export.${ext}`
        const res = await api.get(url, { responseType: 'blob' })
        const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' })
        // Try to extract filename from content-disposition
        const cd = res.headers['content-disposition'] || ''
        const match = /filename\s*=\s*"?([^";]+)"?/i.exec(cd)
        const fallback = `${sanitizeFilename(item?.title || 'note')}.${ext}`
        const fileName = match?.[1] || fallback
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(link.href), 2000)
    } catch (_) { }
}

// track which row (id or index) currently has the export dropdown open
const openExportFor = ref(null)

function toggleExport(id, event) {
    // prevent global click handler from immediately closing when toggling
    if (event && event.stopPropagation) event.stopPropagation()
    openExportFor.value = openExportFor.value === id ? null : id
}

function handleExport(item, ext) {
    // call existing download helper and close the dropdown
    downloadExport(item, ext)
    openExportFor.value = null
}

// global click listener to close any open export dropdown when clicking outside
const _closeExportListener = () => { openExportFor.value = null }
onMounted(() => document.addEventListener('click', _closeExportListener))
onBeforeUnmount(() => document.removeEventListener('click', _closeExportListener))

function formatDate(value) {
    if (!value) return ''
    try { return new Date(value).toLocaleDateString() } catch { return value }
}

function isImage(value) {
    return typeof value === 'string' && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:image'))
}

function goToPage(page) { if (page >= 1 && page <= totalPages.value) currentPage.value = page }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function handleFilter() { currentPage.value = 1 }
function clearFilters() { Object.keys(filters).forEach(k => filters[k] = ''); currentPage.value = 1 }
</script>

<template>
    <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-auto">
        <div class="p-3 border-b border-gray-200 dark:border-gray-800">
            <form @submit.prevent="handleFilter" class="md:flex md:flex-wrap">
                <div v-for="filterConfig in filterableColumns" :key="filterConfig.key" class="m-2">
                    <label v-if="filterConfig.label"
                        class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                        {{ filterConfig.label }}
                    </label>
                    <input v-if="filterConfig.type !== 'date'" type="text" v-model="filters[filterConfig.key]"
                        @input="handleFilter" :placeholder="t('table.labels.filterBy', { label: filterConfig.label || filterConfig.key })"
                        class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 px-3 rounded w-full shadow-sm">
                    <input v-else type="date" v-model="filters[filterConfig.key]" @input="handleFilter"
                        :placeholder="t('table.labels.filterBy', { label: filterConfig.label || filterConfig.key })"
                        class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 px-3 rounded w-full shadow-sm">
                </div>
                <div class="m-2 flex items-end">
                    <button type="button" @click="clearFilters"
                        class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow">
                        {{ t('table.labels.clear') }}
                    </button>
                </div>
            </form>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead class="bg-gradient-to-r from-slate-900 to-blue-900 text-white sticky top-0 z-10">
                    <tr>
                        <th v-for="(header, index) in headers" :key="`header-${index}`"
                            class="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                            {{ headerLabel(header) }}
                        </th>
                        <th v-if="hasAnyActions"
                            class="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                            {{ t('table.labels.actions') }}
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="(item, itemIndex) in paginatedItems" :key="`row-${itemIndex}`"
                        class="hover:bg-slate-50 dark:hover:bg-gray-800/60">
                        <template v-for="(header, headerIndex) in headers" :key="`cell-${itemIndex}-${headerIndex}`">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">
                                <template v-if="isImage(item[headerKey(header).toLowerCase()])">
                                    <img :src="item[headerKey(header).toLowerCase()]"
                                        class="h-10 w-10 rounded-full object-cover mx-auto" :alt="`${header} image`">
                                </template>
                                <template v-else-if="headerKey(header).toLowerCase().includes('date')">
                                    <div class="text-center">{{ formatDate(item[headerKey(header).toLowerCase()]) }}</div>
                                </template>
                                <template v-else>
                                    {{ item[headerKey(header).toLowerCase()] }}
                                </template>
                            </td>
                        </template>

                        <td v-if="hasAnyActions" class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button v-if="showView" @click="handleView(item)"
                                class="mr-3 cursor-pointer text-indigo-600 hover:text-indigo-700" :title="t('table.tooltips.view')">
                                <FontAwesomeIcon :icon="faEye" />
                            </button>
                            <button v-if="allowEdit && showEdit" @click="handleEdit(item)"
                                class="mr-3 cursor-pointer text-amber-600 hover:text-amber-700" :title="t('table.tooltips.edit')">
                                <FontAwesomeIcon :icon="faPen" />
                            </button>
                            <button v-if="showDelete" @click="handleDelete(item)"
                                class="cursor-pointer text-rose-600 hover:text-rose-700" :title="t('table.tooltips.delete')">
                                <FontAwesomeIcon :icon="faTrash" />
                            </button>

                            <div v-if="showExport" class="relative inline-block text-left">
                                <div class="flex justify-center">
                                    <button @click="toggleExport(item._id || item.id || itemIndex, $event)"
                                        type="button"
                                        class="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-2 py-1 bg-white dark:bg-gray-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        aria-expanded="true" aria-haspopup="true">
                                        <FontAwesomeIcon :icon="faDownload" />
                                    </button>
                                </div>

                                <div v-if="openExportFor === (item._id || item.id || itemIndex)" @click.stop
                                    class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000]">
                                    <div class="py-1">
                                        <button @click="handleExport(item, 'md')"
                                            class="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <FontAwesomeIcon class="me-3" :icon="faMarkdown" />Markdown
                                            (MD)
                                        </button>
                                    </div>
                                    <div class="py-1">
                                        <button @click="handleExport(item, 'html')"
                                            class="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <FontAwesomeIcon class="me-3" :icon="faHtml5" />HTML
                                        </button>
                                    </div>
                                    <div class="py-1">
                                        <button @click="handleExport(item, 'pdf')"
                                            class="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <FontAwesomeIcon class="me-3" :icon="faFilePdf" />PDF
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="filterItems.length === 0">
                        <td :colspan="headers.length + (showActions ? 1 : 0)"
                            class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                            {{ t('table.labels.noItems') }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md"
                    :class="currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-gray-800'">
                    {{ t('table.labels.prev') }}
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="me-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md"
                    :class="currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-gray-800'">
                    {{ t('table.labels.next') }}
                </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-slate-600 dark:text-slate-300">
                        {{ t('table.labels.showing', {
                            from: (currentPage - 1) * itemsPerPage + 1,
                            to: Math.min(currentPage * itemsPerPage, filterItems.length),
                            total: filterItems.length
                        }) }}
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium"
                            :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800'">
                            <span class="sr-only">{{ t('table.labels.prev') }}</span>
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>

                        <!-- Page numbers -->
                        <template v-for="page in totalPages" :key="`page-${page}`">
                            <button @click="goToPage(page)" :aria-current="page === currentPage ? 'page' : undefined"
                                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                :class="page === currentPage
                                    ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                                    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800'">
                                {{ page }}
                            </button>
                        </template>

                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium"
                            :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800'">
                            <span class="sr-only">{{ t('table.labels.next') }}</span>
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>
