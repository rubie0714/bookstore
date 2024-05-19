<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import supabase from '~/plugins/supabase';

const columns = [{
  key: 'id',
  label: 'ID'
}, {
  key: 'book_name',
  label: '書名'
}, {
  key: 'book_describe',
  label: '書籍簡介'
}, {
  key: 'create_at',
  label: '建立時間'

}, {
  key: 'last_update',
  label: '最後更新時間'
},
{
  key: 'author',
  label: '作者'
},
{
  key: 'actions'
}]


interface BookRow {
  id: any;
}
const items = (row: BookRow): object[][] => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => openBookModal(row.id)
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => deleteBook(row.id)
  }
  ]]


interface Book {
  id: any;
  book_name: string;
  book_describe: string;
  create_at: string;
  last_update: string;
  author: string;
}

let books = reactive<Book[]>([]);
let getBooks = async () => {
  let data: any = await supabase.from('books').select('*')
  books.splice(0, books.length, ...data.data)
}

onMounted(() => {
  getBooks()
})



let book_id = ref(null);

let bookData = computed(() => {
  if (book_id.value) {

    return books.filter(item => item.id === Number(book_id.value));
  } else {
    return books
  }
})

const selected = ref([])



import { string, objectAsync, date, minLength, type Input } from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import AlertModal from './components/AlertModal.vue';

const schema = objectAsync<Schema>({
  book_name: string([minLength(1, 'Must be at least 1 characters')]),
  book_describe: string([minLength(1, 'Must be at least 1 characters')]),
  create_at: string(),
  last_update: string(),
  author: string([minLength(1, 'Must be at least 1 characters')]),
})

type Schema = Input<typeof schema>

const isOpen = ref(false)

let book = reactive({
  book_name: '',
  book_describe: '',
  create_at: '',
  last_update: '',
  author: ''
})


let editBookeId = ref(null)
const openBookModal = (id = null) => {
  isOpen.value = !isOpen.value
  editBookeId.value = id
  if (editBookeId.value) {
    getBooksByID(editBookeId.value)
  }
}

let getBooksByID = async (id: number) => {
  let data = await supabase.from('books').select("*").eq('id', id)
  book.id = data.data[0].id
  book.book_name = data.data[0].book_name
  book.book_describe = data.data[0].book_describe
  book.create_at = data.data[0].create_at
  book.last_update = data.data[0].last_update
  book.author = data.data[0].author
}


interface AlertMessage {
  open: boolean;
  title: string;
  description: string;
  icon: string;
  color: string;
  checkFunction: (() => Promise<void>) | null;
  cancelFunction: (() => void) | null;
}

let alertMessage = reactive<AlertMessage>({
  open: false,
  title: '',
  description: '',
  icon: '',
  color: '',
  checkFunction: null,
  cancelFunction: null
});


const addBook = async (event: FormSubmitEvent<Schema>) => {
  let error = await supabase
    .from('books')
    .insert(book)
  if (error.status === 201) {
    alertMessage.open = true
    alertMessage.title = '新增成功'
    alertMessage.description = '新增成功'
    alertMessage.icon = 'i-heroicons-check-circle-20-solid'
    alertMessage.color = 'text-green-500 dark:text-green-400'
    getBooks()
  }

}


const editBook = async () => {
  isOpen.value = false
  let error = await supabase
    .from('books')
    .update(book)
    .eq('id', editBookeId.value)
  if (error.status === 204) {
    alertMessage.open = true
    alertMessage.title = '編輯成功'
    alertMessage.description = '編輯成功'
    alertMessage.icon = 'i-heroicons-check-circle-20-solid'
    alertMessage.color = 'text-green-500 dark:text-green-400'
    getBooks()
  }

}

const deleteBook = async (id: number) => {
  //確認要刪除嗎？
  alertMessage.open = true
  alertMessage.title = '確定要刪除嗎'
  alertMessage.description = '如確定要刪除，請確認。'
  alertMessage.icon = 'i-heroicons-check-circle-20-solid'
  alertMessage.color = 'text-orange-500 dark:text-orange-400'
  alertMessage.checkFunction = async () => {
    await supabase
      .from('books')
      .delete()
      .eq('id', id)
    alertMessage.open = false
    getBooks()
  }
  alertMessage.cancelFunction = () => {
    alertMessage.open = false
  }
  isOpen.value = false
}



</script>

<template>
  <div>
    <UPage class="mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <UPageHeader headline="HOME" title="Rubie's Store" description="My Bookstore" />
      </div>
      <div class="flex py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
        <UInput v-model="book_id" placeholder="Filter people..." />
        <UButton color="primary" variant="solid" @click="openBookModal(null)" label="Open">Add Book</UButton>
      </div>
      <UTable v-model="selected" :rows="bookData" :columns="columns">
        <template #name-data="{ row }">
          <span :class="[selected.find(books => books.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{
          row.name }}</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UPage>
    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ book.id ? '編輯' : '新增' }}書籍
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>
        <UForm :schema="schema" :state="book" class="space-y-4">
          <UFormGroup label="書籍名稱" name="book_name">
            <UInput v-model="book.book_name" />
          </UFormGroup>

          <UFormGroup label="書籍簡介" name="book_describe">
            <UInput v-model="book.book_describe" type="text" />
          </UFormGroup>

          <UFormGroup label="建立日期" name="created_at">
            <UInput v-model="book.create_at" type="date" />
          </UFormGroup>

          <UFormGroup label="更新日期" name="last_update">
            <UInput v-model="book.last_update" type="date" />
          </UFormGroup>

          <UFormGroup label="作者" name="author">
            <UInput v-model="book.author" type="text" />
          </UFormGroup>
          <UButton type="submit" @click="editBook" v-if="book?.id">編輯</UButton>
          <UButton type="submit" @click="addBook" v-else>新增</UButton>


        </UForm>
      </UCard>
    </UModal>
    <AlertModal :open="alertMessage.open" :title="alertMessage.title" :description="alertMessage.description"
      :icon="alertMessage.icon" :checkFunction="alertMessage.checkFunction" :color="alertMessage.color"
      :cancelFunction="alertMessage.cancelFunction" />

  </div>


</template>
