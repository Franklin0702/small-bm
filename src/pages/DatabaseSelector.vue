<template>
  <div class="py-10 flex-1 bg-white">
    <div class="w-full" :class="{ 'pointer-events-none': loadingDatabase }">
      <div class="px-12">
        <h1 class="text-2xl font-semibold">
          {{ _('Bienvenido a Small BM') }}
        </h1>
        <p class="text-gray-600 text-base" v-if="!showFiles">
          {{
            _(
              'Crea un nuevo archivo de base de datos o carga uno existente desde tu computadora.'
            )
          }}
        </p>
        <p class="text-gray-600 text-base" v-if="showFiles">
          {{ _('Elige un archivo para cargar la información de tu negocio.') }}
        </p>
      </div>
      <div class="px-12 mt-10 window-no-drag" v-if="!showFiles">
        <div class="flex">
          <div
            @click="newDatabase"
            class="w-1/2 border rounded-xl flex flex-col items-center py-8 px-5 cursor-pointer hover:shadow"
          >
            <div
              class="w-14 h-14 rounded-full bg-blue-200 relative flex-center"
            >
              <div
                class="w-12 h-12 absolute rounded-full bg-blue-500 flex-center"
              >
                <feather-icon name="plus" class="text-white w-5 h-5" />
              </div>
            </div>
            <div class="mt-5 font-medium">
              <template
                v-if="loadingDatabase && fileSelectedFrom === 'New File'"
              >
                {{ _('Cargando...') }}
              </template>
              <template v-else>
                {{ _('Archivo Nuevo') }}
              </template>
            </div>
            <div class="mt-2 text-sm text-gray-600 text-center">
              {{ _('Crea un nuevo archivo para guardar en tu computadora.') }}
            </div>
          </div>
          <div
            @click="existingDatabase"
            class="ml-6 w-1/2 border rounded-xl flex flex-col items-center py-8 px-5 cursor-pointer hover:shadow"
          >
            <div
              class="w-14 h-14 rounded-full bg-green-200 relative flex-center"
            >
              <div class="w-12 h-12 rounded-full bg-green-500 flex-center">
                <feather-icon name="upload" class="w-4 h-4 text-white" />
              </div>
            </div>
            <div class="mt-5 font-medium">
              <template
                v-if="loadingDatabase && fileSelectedFrom === 'Existing File'"
              >
                {{ _('Cargando...') }}
              </template>
              <template v-else>
                {{ _('Archivo Existente') }}
              </template>
            </div>
            <div class="mt-2 text-sm text-gray-600 text-center">
              {{ _('Carga un archivo .db desde tu computadora.') }}
            </div>
          </div>
          <div
            @click="remoteDatabase"
            class="ml-6 w-1/2 border rounded-xl flex flex-col items-center py-8 px-5 cursor-pointer hover:shadow"
          >
            <div
              class="w-14 h-14 rounded-full bg-green-200 relative flex-center"
            >
              <div class="w-12 h-12 rounded-full bg-green-500 flex-center">
                <feather-icon name="upload" class="w-4 h-4 text-white" />
              </div>
            </div>
            <div class="mt-5 font-medium">
              <template
                v-if="loadingDatabase && fileSelectedFrom === 'Remote Database'"
              >
                {{ _('Cargando...') }}
              </template>
              <template v-else>
                {{ _('Base de datos central') }}
              </template>
            </div>
            <div class="mt-2 text-sm text-gray-600 text-center">
              {{
                _(
                  'Configura los parametros de conexión hacia tu base de datos.'
                )
              }}
            </div>
          </div>
        </div>
        <a
          v-if="files.length > 0"
          class="text-brand text-sm mt-4 inline-block cursor-pointer"
          @click="showFiles = true"
        >
          Elige de los archivos que existen
        </a>
      </div>

      <div v-if="showFiles">
        <div class="px-12 mt-6">
          <div
            class="py-2 px-4 text-sm flex justify-between  items-center hover:bg-gray-100 cursor-pointer border-b"
            :class="{ 'border-t': i === 0 }"
            v-for="(file, i) in files"
            :key="file.filePath"
            @click="selectFile(file)"
          >
            <div class="flex items-baseline">
              <span>
                <template v-if="loadingDatabase && fileSelectedFrom === file">
                  {{ _('Loading...') }}
                </template>
                <template v-else>
                  {{ file.companyName }}
                </template>
              </span>
            </div>
            <div class="text-gray-700">
              {{ getFileLastModified(file.filePath) }}
            </div>
          </div>
        </div>
        <div class="px-12 mt-4">
          <a
            class="text-brand text-sm cursor-pointer"
            @click="showFiles = false"
          >
            Elegir archivo manualmente
          </a>
        </div>
      </div>
    </div>
    <div
      v-if="loadingDatabase && fileSelectedFrom === 'Remote Database'"
      class="flex content-center m-auto"
    >
      <RemoteDatabase @on-connect="value => connectToDatabase(value)" />
    </div>
  </div>
</template>
<script>
import fs from 'fs';
import config from '@/config';
import { DateTime } from 'luxon';
import RemoteDatabase from '@/pages/RemoteDatabase/RemoteDatabase.vue';
import VueTailwindModal from 'vue-tailwind-modal';

import {
  createNewDatabase,
  loadExistingDatabase,
  connectToLocalDatabase,
  connectToDatabaseServer,
  openRemoteDatabase
} from '@/utils';

export default {
  name: 'DatabaseSelector',
  components: {
    RemoteDatabase,
    VueTailwindModal
  },
  data() {
    return {
      loadingDatabase: false,
      fileSelectedFrom: null,
      showFiles: false,
      files: []
    };
  },
  mounted() {
    this.files = config.get('files', []);
    this.showFiles = false; //this.files.length > 0;
    this.dbType = config.get('dbType', null);
  },
  methods: {
    async newDatabase() {
      this.fileSelectedFrom = 'New File';
      let filePath = await createNewDatabase();
      config.set('dbType', 'local');
      this.connectToDatabase(filePath);
    },
    async existingDatabase() {
      this.fileSelectedFrom = 'Existing File';
      let filePath = await loadExistingDatabase();
      config.set('dbType', 'local');
      this.connectToDatabase(filePath);
    },
    async remoteDatabase() {
      this.fileSelectedFrom = 'Remote Database';
      this.loadingDatabase = true;
      config.set('dbType', 'server');
    },
    async selectFile(file) {
      this.fileSelectedFrom = file;
      await this.connectToDatabase(file.filePath);
    },
    async connectToDatabase(options) {
      this.dbType = config.get('dbType', null);
      if (this.dbType === 'local') {
        let filePath = options.filePath;
        this.loadingDatabase = true;
        await connectToLocalDatabase(filePath);
        this.loadingDatabase = false;
        this.$emit('database-connect');
      } else if (this.dbType === 'server') {
        this.loadingDatabase = true;
        await connectToDatabaseServer(options);
        this.loadingDatabase = false;
        this.$emit('database-connect');
      }
    },
    getFileLastModified(filePath) {
      let stats = fs.statSync(filePath);
      return DateTime.fromJSDate(stats.mtime).toRelative();
    }
  }
};
</script>
