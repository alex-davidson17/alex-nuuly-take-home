<script setup lang="ts">
import { ref, watch } from 'vue'
import DataTable from './components/DataTable.vue'
import UIButton from './components/UIButton.vue'

const text = ref('')
const page = ref(1)
const country = ref('')
const tableSize = ref(25)
const artist_data = ref()
const api_key = '36802c4f539a97703d695f2e2311bdb1' // please don't use this nefariously

// separate loaders for country and artist data (table)
const countryLoading = ref(false)
const artistLoading = ref(false)
const inputList = ref()
const errorMessage = ref()

// stores direction and header that are used to sort table
const sortKey = ref({
  field: '',
  direction: '',
})

// sorts table based on where the user clicks on the header
function sortData(field: string) {
  if (field === sortKey.value.field) {
    sortKey.value.direction = sortKey.value.direction === 'asc' ? 'desc' : 'asc'
  }
  sortKey.value.field = field
  artist_data.value.sort((a, b) => {
    let mod = 1
    if (sortKey.value.direction === 'desc')
      mod = -1
    if (a[sortKey.value.field] < b[sortKey.value.field])
      return -1 * mod
    if (a[sortKey.value.field] > b[sortKey.value.field])
      return 1 * mod
    return 0
  })
}
const lastFMURL = 'http://ws.audioscrobbler.com/2.0/'
const artistKeys = {
  Rank: 'rank',
  Name: 'name',
  Listeners: 'listeners',
  // Genre: 'genre'
}

async function getCountry() {
  try {
    countryLoading.value = true
    const response = await fetch(`https://restcountries.com/v3.1/name/${text.value}?fields=name`)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    inputList.value = json.map(x => x.name.common)
    countryLoading.value = false
  }
  catch (error) {
    errorMessage.value = 'an error has occured please try again'
    console.error(error.message)
  }
}
async function getArtist() {
  try {
    const response = await fetch(
      `${lastFMURL}?method=geo.gettopartists&country=${text.value}&api_key=${api_key}&page=${page.value}&limit=${tableSize.value}&format=json`,
    )
    artistLoading.value = true
    artist_data.value = []
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()

    // the Last.FM api has a bug where the second page returns all the data from page 1 and page 2
    // slicing the array ensures that we only get the data meant for page 2
    artist_data.value = json.topartists.artist.slice(`-${tableSize.value}`).map((artist, idx) => {
      return {
        ...artist,
        listeners: Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(Number(artist.listeners)), // converts string to number with formatting (ex. 1.2k for 1,200)
        rank: Number((page.value * tableSize.value) - tableSize.value + idx + 1), // rank of each artist in table
      }
    })

    artistLoading.value = false
  }
  catch (error) {
    errorMessage.value = 'An error has occured please try again.'
    console.error(error.message)
  }
}

// gets new artists when table size changes or querying new page
watch([page, tableSize], () => getArtist())

// checks if text is a valid country based on the list we recieve from the countries api
watch(text, () => {
  if (inputList.value && inputList.value.find(country => country === text.value)) {
    country.value = text.value
    errorMessage.value = null
  }
  else {
    getCountry()
    errorMessage.value = 'Please search and select a valid country name.'
  }
})
</script>

<template>
  <main>
    <h1>TRACK NINJA</h1>
    <div>
      <input v-model="text" placeholder="Enter Country" :list="inputList">
      <datalist :id="inputList">
        <option v-for="countryName in inputList" :key="countryName" :value="countryName">
          {{ countryName }}
        </option>
      </datalist>
      <UIButton id="artist-button":disabled="errorMessage" @click="getArtist">
        Get Artists
      </UIButton>
      <span v-if="countryLoading" class="country-loader" />
      <p class="error">
        {{ errorMessage }}
      </p>
    </div>
    <div v-if="artistLoading" class="artist-loader" />
    <template v-if="!artistLoading">
      <h2 v-if="artist_data">
        Top Artists in {{ country }}
      </h2>
      <DataTable
        v-if="artist_data"
        :page="page"
        :table-size="tableSize"
        :data="artist_data"
        :key-map="artistKeys"
        @update-page="(n: number) => page += n"
        @update-table-size="(n:number) => tableSize = n"
        @sort-data="sortData"
      />
    </template>
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  flex-direction:column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
h1{
  color: #555;
  mix-blend-mode: color-burn;
}
input {
  backdrop-filter: blur(11px) saturate(100%);
  -webkit-backdrop-filter: blur(11px) saturate(100%);
  background-color: rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
}
.error {
  color: red;
}

.country-loader {
    width: 20px;
    height: 20px;
    border: 3px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.artist-loader {
  width: 45px;
  aspect-ratio: 1;
  --c: no-repeat linear-gradient(#000 0 0);
  background:
    var(--c) 0%   50%,
    var(--c) 50%  50%,
    var(--c) 100% 50%;
  background-size: 20% 100%;
  animation: l1 1s infinite linear;
}
@keyframes l1 {
  0%  {background-size: 20% 100%,20% 100%,20% 100%}
  33% {background-size: 20% 10% ,20% 100%,20% 100%}
  50% {background-size: 20% 100%,20% 10% ,20% 100%}
  66% {background-size: 20% 100%,20% 100%,20% 10% }
  100%{background-size: 20% 100%,20% 100%,20% 100%}
}
#artist-button {
  margin-left: 10px;
}
</style>
